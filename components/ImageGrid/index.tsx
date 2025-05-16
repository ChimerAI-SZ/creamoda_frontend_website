'use client';

import { useEffect, useState, useCallback } from 'react';

import { ImageCard } from './ImageCard';
import ImageDetail from './ImageDetail';

import { showErrorDialog } from '@/utils/index';
import { usePendingImages } from './hooks/usePendingImages';

import { useGenerationStore } from '@/stores/useGenerationStore';
import usePersonalInfoStore from '@/stores/usePersonalInfoStore';
import { eventBus } from '@/utils/events';
import { generate } from '@/lib/api';

// 图片类型接口
export interface ImageItem {
  genImgId: number;
  genId: number;
  genBatchId?: string | number; // 从代码中看出有这个属性
  type: number;
  status: number;
  resultPic: string;
  createTime: string;
}

const PAGE_SIZE = 10000; // 请求的图片数量

export function ImageGrid() {
  // 图片列表
  const [images, setImages] = useState<ImageItem[]>([]);

  const { setGenerating } = useGenerationStore();
  const { clearUserInfo } = usePersonalInfoStore();
  // 查看图片详情相关state
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [detailVisible, setDetailVisible] = useState<boolean>(false);

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
        }
      } catch (error) {
        showErrorDialog('Something went wrong. Please try again later or contact support if the issue persists');
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
  }, [fetchImages]);

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
  }, [fetchImages]);

  // 监听提交成功事件，加载最近图片
  useEffect(() => {
    const handleSubmitSuccess = () => {
      fetchRecentImages();
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
      <div
        className="image-grid-container grid gap-4 z-20 bg-[#FFFDFA]
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
          <ImageCard key={image.genImgId || index} image={image} onClick={() => handleImageClick(image)} />
        ))}
      </div>
      <ImageDetail
        imgList={images}
        image={selectedImage}
        isOpen={detailVisible}
        onClose={() => {
          setDetailVisible(false);
        }}
        onImageChange={handleImageChange}
      />
    </>
  );
}
