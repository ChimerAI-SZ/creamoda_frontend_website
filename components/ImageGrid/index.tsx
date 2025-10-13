'use client';

import { useEffect, useState, useCallback, useMemo, memo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

import { ImageCard } from './ImageCard';
import ImageDetail from './ImageDetail';

import { downloadImage } from '@/utils';
import { useDeleteImage } from '@/hooks/useDeleteImage';
import { usePendingImages } from './hooks/usePendingImages';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';
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

const PAGE_SIZE = 10; // 匹配后端默认分页大小

// 使用memo优化图片网格组件，避免不必要的重渲染
const MemoizedImageGrid = memo(function ImageGridContent({
  images,
  lastItemRef,
  handleImageClick,
  handleDeleteImage,
  handleCollectImage,
  isLoading,
  hasMore,
  totalImages
}: {
  images: ImageItem[];
  lastItemRef: (node: HTMLDivElement | null) => void;
  handleImageClick: (image: ImageItem) => void;
  handleDeleteImage: (imageId: number) => void;
  handleCollectImage: (imageId: number, isCollected: boolean) => void;
  isLoading: boolean;
  hasMore: boolean;
  totalImages: number;
}) {
  return (
    <ResponsiveMasonry
      columnsCountBreakPoints={{
        350: 1,
        800: 2,
        1200: 3,
        1440: 4,
        1680: 5,
        1920: 6,
        2560: 7,
        3440: 8,
        3840: 9
      }}
    >
      <Masonry>
        {images.map((image, index) => (
          <ImageCard
            key={image.genImgId || index}
            ref={index === images.length - 1 ? lastItemRef : undefined}
            image={image}
            onClick={() => handleImageClick(image)}
            handleDeleteImage={handleDeleteImage}
            handleCollectImage={handleCollectImage}
          />
        ))}
        
        {/* Loading more indicator */}
        {isLoading && hasMore && (
          <div className="w-full h-20 flex items-center justify-center col-span-full">
            <div className="flex items-center gap-2 text-gray-500">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              <span>Loading more images...</span>
            </div>
          </div>
        )}
        
        {/* All images loaded indicator */}
        {/* {!hasMore && images.length > 0 && (
          <div className="w-full h-16 flex items-center justify-center col-span-full">
            <span className="text-gray-500 text-sm">All images loaded ({images.length} / {totalImages})</span>
          </div>
        )} */}
      </Masonry>
    </ResponsiveMasonry>
  );
});

export function ImageGrid() {
  // 图片列表
  const [images, setImages] = useState<ImageItem[]>([]);
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [totalImages, setTotalImages] = useState(0); // 记录后端返回的总图片数

  const { clearUserInfo, fetchUserInfo } = usePersonalInfoStore();
  // 查看图片详情相关state
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [detailVisible, setDetailVisible] = useState<boolean>(false);

  const [mounted, setMounted] = useState(false);

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

  // 使用 ref 来跟踪加载状态，避免依赖循环
  const isLoadingRef = useRef(false);

  // 加载图片数据
  const fetchImages = useCallback(
    async (page: number, isLoadMore: boolean = false) => {
      console.log('🔄 fetchImages called:', { page, isLoadMore, isLoadingRef: isLoadingRef.current });
      if (isLoadingRef.current) {
        console.log('⚠️ Already loading, skipping...');
        return; // 防止重复请求
      }
      
      console.log('✅ Starting fetch, setting loading states');
      isLoadingRef.current = true;
      setIsLoading(true);
      try {
        const data = await generate.getGenerateList(page, PAGE_SIZE);

        if (data.code === 0) {
          const imageList = data.data.list;
          const total = data.data.total || 0; // 获取后端返回的总数
          console.log('📥 API response:', { page, imageCount: imageList.length, total, isLoadMore });
          
          // 更新总图片数
          setTotalImages(total);

          // 检查是否有正在生成中的图片
          const pendingImages = imageList.filter((item: ImageItem) => [1, 2].includes(item.status));

          // 如果有正在生成中的图片，添加到轮询中但不设置全局状态
          if (pendingImages.length > 0) {
            // 添加待生成图片到轮询集合中
            const pendingIds = pendingImages.map((img: ImageItem) => img.genImgId);
            pendingIdsRef.current = new Set([...pendingIdsRef.current, ...pendingIds]);

            // 开始轮询检查图片状态
            startPolling();
          }

          if (isLoadMore) {
            // 加载更多时追加图片
            setImages(prev => {
              const newImages = [...prev, ...imageList];
              return newImages;
            });
            // 根据当前页数和总数判断是否还有更多
            const newHasMore = page * PAGE_SIZE < total;
            console.log('Load more - hasMore updated:', { page, PAGE_SIZE, total, newHasMore });
            setHasMore(newHasMore);
          } else {
            // 首次加载或刷新时替换图片
            setImages(imageList);
            setCurrentPage(1);
            // 根据首页图片数量和总数判断是否还有更多
            const newHasMore = imageList.length < total;
            console.log('First load - hasMore updated:', { imageCount: imageList.length, total, newHasMore });
            setHasMore(newHasMore);
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
      } finally {
        console.log('✅ fetchImages completed, resetting loading states');
        isLoadingRef.current = false;
        setIsLoading(false);
      }
    },
    [pendingIdsRef, startPolling, showAlert]
  );

  // 加载更多图片
  const loadMore = useCallback(() => {
    console.log('🚀 loadMore triggered:', { hasMore, isLoadingRef: isLoadingRef.current, currentPage });
    if (hasMore && !isLoadingRef.current) {
      const nextPage = currentPage + 1;
      console.log('📄 Loading page:', nextPage);
      setCurrentPage(nextPage);
      fetchImages(nextPage, true);
    } else {
      console.log('❌ loadMore blocked:', { hasMore, isLoadingRef: isLoadingRef.current });
    }
  }, [currentPage, hasMore, fetchImages]);

  // 无限滚动钩子
  const { lastItemRef } = useInfiniteScroll({
    hasMore,
    loadMore
  });

  // 监听图片列表生成事件
  // 当用户登录成功或提交生成请求后，会触发此事件来刷新图片列表
  useEffect(() => {
    const handler = async () => {
      // 收到事件后重新获取第一页的图片数据，重置分页状态
      console.log('🎯 Event handler triggered: imageList:generate-list');
      
      // 重置状态
      isLoadingRef.current = false;
      setCurrentPage(1);
      setHasMore(true);
      
      // 直接调用API，避免函数依赖
      try {
        setIsLoading(true);
        isLoadingRef.current = true;
        
        const data = await generate.getGenerateList(1, PAGE_SIZE);
        if (data.code === 0) {
          const imageList = data.data.list;
          const total = data.data.total || 0;
          
          setImages(imageList);
          setTotalImages(total);
          setHasMore(imageList.length < total);
          
          console.log('🎯 Event refresh completed:', { imageCount: imageList.length, total });
        }
      } catch (error) {
        console.error('🎯 Event refresh failed:', error);
      } finally {
        isLoadingRef.current = false;
        setIsLoading(false);
      }
    };

    // 订阅和卸载 imageList:generate-list 事件
    eventBus.on('imageList:generate-list', handler);

    return () => {
      eventBus.off('imageList:generate-list', handler);
    };
  }, []); // 完全不依赖任何函数

  // 加载最近图片
  const fetchRecentImages = useCallback(async () => {
    try {
      const data = await generate.getGenerateList(1, 10);

      if (data.code === 0) {
        const recentImages = data.data.list || [];
        const total = data.data.total || 0;
        
        // 更新总图片数
        setTotalImages(total);
        
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

            const updatedImages = [...newImages, ...prevImages];
            return updatedImages;
          }
          return prevImages;
        });
      }
    } catch (error) {
      console.error('Failed to load recent images:', error);
    }
  }, [pendingIdsRef, startPolling]);

  // 使用useMemo优化回调函数
  const memoizedHandlers = useMemo(() => ({
    handleImageClick: (image: ImageItem) => {
      setSelectedImage(image);
      setDetailVisible(true);
    },
    handleDeleteImage: (imageId: number) => {
      deleteImage(imageId, () => {
        setImages(prev => prev.filter(img => img.genImgId !== imageId));
      });
    },
    handleCollectImage: (imageId: number, currentIsCollected: boolean) => {
      const newIsCollected = !currentIsCollected;
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
          console.error(error);
          return { code: -1, message: error.message || 'A network error occurred' };
        });

      promise.then(res => {
        if (res.code !== 0) {
          setImages(prevImages =>
            prevImages.map(img => (img.genImgId === imageId ? { ...img, isCollected: currentIsCollected } : img))
          );
          if (selectedImage?.genImgId === imageId) {
            setSelectedImage(prev => (prev ? { ...prev, isCollected: currentIsCollected } : null));
          }
        }
      });

      return promise;
    }
  }), [deleteImage, selectedImage]);

  const handleActionButtonClick = async (text: string, image: ImageItem) => {
    if (text === 'Download') {
      downloadImage(image?.resultPic ?? '', 'image.jpg');
    } else if (text === 'Delete') {
      const imageId = image?.genImgId ?? 0;

      memoizedHandlers.handleDeleteImage(imageId);
      setDetailVisible(false);
    } else if (['Remove from album', 'Add to album'].includes(text)) {
      try {
        const res = await memoizedHandlers.handleCollectImage(image.genImgId, image.isCollected);

        if (res.code === 0) {
          showAlert({
            type: 'success',
            content: text === 'Remove from album' ? 'Image removed from album' : 'Image added to album'
          });
        } else {
          showAlert({
            type: 'error',
            content: res.message || res.msg || 'Failed to collect image'
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
      router.push('/magic-kit/create');
    } else if (text === 'Virtual Try-On') {
      router.push(`/virtual-try-on/create?imageUrl=${encodeURIComponent(image?.resultPic ?? '')}`);
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
            content: res.msg || 'Failed to share image'
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
    const loadInitialImages = async () => {
      const token = localStorage.getItem('auth_token');

      // 如果用户已登录，则加载图片
      if (token) {
        console.log('🏁 Initial load triggered');
        
        // 等待用户信息加载完成（防止 Google One Tap 登录后立即跳转导致 401）
        const { email } = usePersonalInfoStore.getState();
        if (!email) {
          console.log('⏳ Waiting for user info to load...');
          
          // 等待最多 3 秒，让用户信息有时间加载
          let attempts = 0;
          const maxAttempts = 30; // 30 * 100ms = 3秒
          
          while (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 100));
            const currentState = usePersonalInfoStore.getState();
            if (currentState.email) {
              console.log('✅ User info loaded, proceeding with image load');
              break;
            }
            attempts++;
          }
          
          // 如果 3 秒后还没有用户信息，尝试主动获取一次
          const finalState = usePersonalInfoStore.getState();
          if (!finalState.email) {
            console.log('⚠️ User info still not loaded, fetching manually...');
            try {
              await fetchUserInfo();
            } catch (error) {
              console.warn('Failed to fetch user info:', error);
            }
          }
        }
        
        // 重置所有状态
        isLoadingRef.current = false;
        setCurrentPage(1);
        setHasMore(true);
        
        // 直接调用API，避免函数依赖
        try {
          setIsLoading(true);
          isLoadingRef.current = true;
          
          const data = await generate.getGenerateList(1, PAGE_SIZE);
          if (data.code === 0) {
            const imageList = data.data.list;
            const total = data.data.total || 0;
            
            setImages(imageList);
            setTotalImages(total);
            setHasMore(imageList.length < total);
            
            console.log('🏁 Initial load completed:', { imageCount: imageList.length, total });
          }
        } catch (error) {
          console.error('🏁 Initial load failed:', error);
        } finally {
          isLoadingRef.current = false;
          setIsLoading(false);
        }
      }
    };

    loadInitialImages();
  }, [fetchUserInfo]); // 添加 fetchUserInfo 依赖

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
  }, [fetchRecentImages, clearUserInfo, fetchUserInfo]);

  // 清理轮询定时器
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <div className="w-full h-full p-4 z-20 bg-[#fff] rounded-[20px] overflow-hidden shadow-card-shadow">
        <div className="h-full overflow-y-auto">
          {mounted && images.length > 0 && (
            <MemoizedImageGrid
              images={images}
              lastItemRef={lastItemRef}
              handleImageClick={memoizedHandlers.handleImageClick}
              handleDeleteImage={memoizedHandlers.handleDeleteImage}
              handleCollectImage={memoizedHandlers.handleCollectImage}
              isLoading={isLoading}
              hasMore={hasMore}
              totalImages={totalImages}
            />
          )}
          
          {/* Empty state display */}
          {/* {mounted && images.length === 0 && !isLoading && (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <div className="text-center">
                <Image
                  src="/images/empty-state.svg"
                  alt="No images"
                  width={120}
                  height={120}
                  className="mx-auto mb-4 opacity-50"
                />
                <p className="text-lg font-medium mb-2">No Generated Image</p>
                <p className="text-sm">Start creating your first fashion design.</p>
              </div>
            </div>
          )} */}
          
          {/* Initial loading state */}
          {mounted && images.length === 0 && isLoading && (
            <div className="h-full flex items-center justify-center">
              <div className="flex items-center gap-2 text-gray-500">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                <span>Loading images...</span>
              </div>
            </div>
          )}
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
