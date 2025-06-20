'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { ImageCard } from './ImageCard';
import ImageDetail from './ImageDetail';

import { downloadImage } from '@/utils';
import { useDeleteImage } from '@/hooks/useDeleteImage';
import { usePendingImages } from './hooks/usePendingImages';
import { useGenerationStore } from '@/stores/useGenerationStore';
import usePersonalInfoStore from '@/stores/usePersonalInfoStore';
import { useVariationFormStore } from '@/stores/useMagicKitStore';
import { eventBus } from '@/utils/events';
import { generate, album, community } from '@/lib/api';
import { useAlertStore } from '@/stores/useAlertStore';

// 图片类型接口
export interface ImageItem {
  genImgId: number;
  genId: number;
  genBatchId?: string | number; // 从代码中看出有这个属性
  type: number;
  status: number;
  resultPic: string;
  createTime: string;
  isCollected: boolean;
}

const PAGE_SIZE = 10000; // 请求的图片数量

export function ImageGrid() {
  // 图片列表
  const [images, setImages] = useState<ImageItem[]>([]);

  const { setGenerating } = useGenerationStore();
  const { clearUserInfo, fetchUserInfo } = usePersonalInfoStore();
  // 查看图片详情相关state
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [detailVisible, setDetailVisible] = useState<boolean>(false);

  const { updateImageUrl } = useVariationFormStore();

  const router = useRouter();

  const { showAlert } = useAlertStore();

  const deleteImage = useDeleteImage();

  // 自定义钩子处理待生成图片
  const { pendingIdsRef, startPolling, stopPolling } = usePendingImages({
    onImageUpdate: updatedImage => {
      setImages(prev => prev.map(img => (img.genImgId === updatedImage.genImgId ? updatedImage : img)));
    }
  });

  // 加载图片数据
  const fetchImages = useCallback(
    async (currentPage: number) => {
      try {
        const data = await generate.getGenerateList(currentPage, PAGE_SIZE);

        if (data.code === 0) {
          const imageList = data.data.list;

          // 检查是否有正在生成中的图片
          const pendingImages = imageList.filter((item: ImageItem) => [1, 2].includes(item.status));

          // 如果有正在生成中的图片，标记全局的generating状态
          if (pendingImages.length > 0) {
            setGenerating(true);

            // 添加待生成图片到轮询集合中
            const pendingIds = pendingImages.map((img: ImageItem) => img.genImgId);
            pendingIdsRef.current = new Set([...pendingIdsRef.current, ...pendingIds]);

            // 开始轮询检查图片状态
            startPolling();
          }

          if (currentPage === 1) {
            setImages(imageList);
          } else {
            setImages(prev => [...prev, ...imageList]);
          }
        } else {
          showAlert({
            type: 'error',
            content:
              data.message || 'Something went wrong. Please try again later or contact support if the issue persists'
          });
        }
      } catch (error: any) {
        showAlert({
          type: 'error',
          content:
            error.message || 'Something went wrong. Please try again later or contact support if the issue persists'
        });
      }
    },
    [setGenerating, pendingIdsRef, startPolling]
  );

  // 监听图片列表生成事件
  // 当用户登录成功或提交生成请求后，会触发此事件来刷新图片列表
  useEffect(() => {
    const handler = () => {
      // 收到事件后重新获取第一页的图片数据，而不是当前页
      fetchImages(1);
    };

    // 订阅和卸载 imageList:generate-list 事件
    eventBus.on('imageList:generate-list', handler);

    return () => {
      eventBus.off('imageList:generate-list', handler);
    };
  }, []);

  // 加载最近图片
  const fetchRecentImages = useCallback(async () => {
    try {
      const data = await generate.getGenerateList(1, 10);

      if (data.code === 0) {
        const recentImages = data.data.list || [];
        // 使用函数式更新，避免依赖 images
        setImages(prevImages => {
          const existingGenImgIds = new Set(prevImages.map(img => img.genImgId));
          const newImages = recentImages.filter((img: ImageItem) => !existingGenImgIds.has(img.genImgId));

          if (newImages.length > 0) {
            // 添加新的待生成图片到跟踪集合
            const newPendingIds = newImages
              .filter((img: ImageItem) => img.status === 1 || img.status === 2)
              .map((img: ImageItem) => img.genImgId);

            if (newPendingIds.length > 0) {
              // 更新待处理图片并开始轮询
              pendingIdsRef.current = new Set([...pendingIdsRef.current, ...newPendingIds]);
              startPolling();
            }

            return [...newImages, ...prevImages];
          }
          return prevImages;
        });
      }
    } catch (error) {
      console.error('加载最近图片失败:', error);
    }
  }, [pendingIdsRef, startPolling]);

  // 图片点击事件，标记当前点击的图片，然后打开详情
  const handleImageClick = useCallback((image: ImageItem) => {
    setSelectedImage(image);
    setDetailVisible(true);
  }, []);

  const handleCollectImage = useCallback(
    (imageId: number, currentIsCollected: boolean) => {
      const newIsCollected = !currentIsCollected;
      // Optimistic update
      setImages(prevImages =>
        prevImages.map(img => (img.genImgId === imageId ? { ...img, isCollected: newIsCollected } : img))
      );
      if (selectedImage?.genImgId === imageId) {
        setSelectedImage(prev => (prev ? { ...prev, isCollected: newIsCollected } : null));
      }

      const promise = album
        .collectImage({
          genImgId: imageId,
          action: newIsCollected ? 1 : 2
        })
        .catch(error => {
          // Ensure we return a similar structure on caught error
          // to prevent downstream .then/.catch from breaking
          console.error(error);
          return { code: -1, message: error.message || 'A network error occurred' };
        });

      promise.then(res => {
        if (res.code !== 0) {
          // Revert on failure
          setImages(prevImages =>
            prevImages.map(img => (img.genImgId === imageId ? { ...img, isCollected: currentIsCollected } : img))
          );
          if (selectedImage?.genImgId === imageId) {
            setSelectedImage(prev => (prev ? { ...prev, isCollected: currentIsCollected } : null));
          }
        }
      });

      return promise;
    },
    [selectedImage] // Dependency on selectedImage is needed for optimistic update of detail view
  );

  const handleDeleteImage = useCallback((imageId: number) => {
    deleteImage(imageId, () => {
      setImages(prev => prev.filter(img => img.genImgId !== imageId));
    });
  }, []);

  const handleActionButtonClick = async (text: string, image: ImageItem) => {
    if (text === 'Download') {
      downloadImage(image?.resultPic ?? '', 'image.jpg');
    } else if (text === 'Delete') {
      const imageId = image?.genImgId ?? 0;

      deleteImage(imageId, () => {
        setImages(prev => prev.filter(img => img.genImgId !== imageId));

        setDetailVisible(false);
      });
    } else if (['Remove from album', 'Add to album'].includes(text)) {
      try {
        const res = await handleCollectImage(image.genImgId, image.isCollected);

        if (res.code === 0) {
          showAlert({
            type: 'success',
            content: text === 'Remove from album' ? 'Image removed from album' : 'Image added to album'
          });
        } else {
          showAlert({
            type: 'error',
            content: res.message || 'Failed to collect image'
          });
        }
      } catch (error: any) {
        showAlert({
          type: 'error',
          content: error.message || 'Failed to collect image'
        });
      }
    } else if (text === 'Magic Kit') {
      updateImageUrl(image?.resultPic ?? '');
      router.push('/magic-kit');
    } else if (text === 'Virtual Try-On') {
      router.push(`/virtual-try-on?imageUrl=${encodeURIComponent(image?.resultPic ?? '')}`);
    } else if (text === 'Share') {
      try {
        const res = await community.shareImage({ genImgId: image?.genImgId ?? 0 });

        if (res.code === 0) {
          showAlert({
            type: 'success',
            content: 'Image shared successfully'
          });
        } else {
          showAlert({
            type: 'error',
            content: res.message || 'Failed to share image'
          });
        }
      } catch (error: any) {
        showAlert({
          type: 'error',
          content: error.message || 'Failed to share image'
        });
      }
    }
  };

  // 详情里支持切换图片，会更新在 selectedImage 上
  const handleImageChange = useCallback((image: ImageItem | null) => {
    setSelectedImage(image);
  }, []);

  // 初始加载
  useEffect(() => {
    const token = localStorage.getItem('auth_token');

    // 如果用户已登录，则加载图片
    if (token) {
      fetchImages(1);
    }
  }, []);

  // 监听提交成功事件，加载最近图片
  useEffect(() => {
    const handleSubmitSuccess = () => {
      fetchRecentImages();
      fetchUserInfo();
    };

    // 登出清空图片历史
    const handleLogout = () => {
      setImages([]);
      clearUserInfo();
    };

    eventBus.on('sidebar:submit-success', handleSubmitSuccess);
    eventBus.on('auth:logout', handleLogout);

    return () => {
      eventBus.off('sidebar:submit-success', handleSubmitSuccess);
      eventBus.off('auth:logout', handleLogout);
    };
  }, [fetchRecentImages, clearUserInfo]);

  // 清理轮询定时器
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return (
    <>
      <div className="w-full h-full p-4 z-20 bg-[#fff] rounded-[20px] overflow-hidden shadow-card-shadow">
        <div className="h-full overflow-y-auto">
          <div
            className="image-grid-container grid gap-4 auto-rows-max
      grid-cols-1
      sm:grid-cols-2 
      min-[800px]:grid-cols-2 
      min-[1200px]:grid-cols-3 
      min-[1440px]:grid-cols-4 
      min-[1680px]:grid-cols-5 
      min-[1920px]:grid-cols-6
      min-[2560px]:grid-cols-7
      min-[3440px]:grid-cols-8
      min-[3840px]:grid-cols-9"
          >
            {images.map((image, index) => (
              <ImageCard
                key={image.genImgId || index}
                image={image}
                onClick={() => handleImageClick(image)}
                handleDeleteImage={handleDeleteImage}
                handleCollectImage={handleCollectImage}
              />
            ))}
          </div>
        </div>
      </div>
      <ImageDetail
        imgList={images}
        image={selectedImage}
        isOpen={detailVisible}
        onClose={() => {
          setDetailVisible(false);
        }}
        onImageChange={handleImageChange}
        handleActionButtonClick={handleActionButtonClick}
      />
    </>
  );
}
