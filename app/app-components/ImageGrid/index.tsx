'use client';

import { useEffect, useState, useCallback } from 'react';

import { ImageCard } from './ImageCard';
import ImageDetail from './ImageDetail';

import { useImageLoader } from './hooks/useImageLoader';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';
import { usePendingImages } from './hooks/usePendingImages';

import { emitter } from '@/utils/events';
import { localAPI } from '@/lib/axios';

// 定义图片类型接口
export interface ImageItem {
  genImgId: number;
  genId: number;
  genBatchId?: string | number; // 从代码中看出有这个属性
  type: number;
  status: number;
  resultPic: string;
  createTime: string;
}

export function ImageGrid() {
  // 图片列表
  const [images, setImages] = useState<ImageItem[]>([]);
  // 分页参数
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  // 是否还有更多数据
  const [hasMore, setHasMore] = useState(true);

  // 查看图片详情相关state
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [detailVisible, setDetailVisible] = useState<boolean>(false);

  // 自定义钩子处理图片加载状态
  const { loadedImages, handleImageLoad } = useImageLoader();

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
        const URL = `/api/v1/img/generate/list?page=${currentPage}&pageSize=${pageSize}`;
        const { data } = await localAPI.get(URL);

        if (data.code === 0) {
          if (currentPage === 1) {
            setImages(data.data.list);
          } else {
            setImages(prev => [...prev, ...data.data.list]);
          }

          setHasMore(currentPage * pageSize < (data.data.total || 1000));
        }
      } catch (error) {
        console.error('加载图片失败:', error);
      }
    },
    [pageSize]
  );

  // 加载最近图片
  const fetchRecentImages = useCallback(async () => {
    try {
      const URL = `/api/v1/img/generate/list?page=1&pageSize=10`;
      const { data } = await localAPI.get(URL);

      if (data.code === 0) {
        const recentImages = data.data.list || [];
        const existingGenImgIds = new Set(images.map(img => img.genImgId));
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

          setImages(prevImages => [...newImages, ...prevImages]);
        }

        setHasMore(pageSize < (data.data.total || 1000));
      }
    } catch (error) {
      console.error('加载最近图片失败:', error);
    }
  }, [pageSize, images, pendingIdsRef, startPolling]);

  // 加载更多图片
  const loadMoreImages = useCallback(() => {
    if (!hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchImages(nextPage);
  }, [hasMore, page, fetchImages]);

  // 使用自定义钩子处理无限滚动
  const { containerRef, lastItemRef } = useInfiniteScroll({
    hasMore,
    loadMore: loadMoreImages,
    rootMargin: '300px'
  });

  const handleImageClick = useCallback((image: ImageItem) => {
    console.log(image);
    setSelectedImage(image);
    setDetailVisible(true);
  }, []);

  // 初始加载
  useEffect(() => {
    fetchImages(1);
  }, [fetchImages]);

  // 监听事件
  useEffect(() => {
    const handler = (data: { data: any }) => {
      console.log('收到 Sidebar 提交成功事件', data);
      fetchRecentImages();
    };

    emitter.on('sidebar:submit-success', handler);
    return () => {
      emitter.off('sidebar:submit-success', handler);
    };
  }, [fetchRecentImages]);

  // 清理轮询定时器
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return (
    <>
      <div
        ref={containerRef}
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
          <ImageCard
            key={image.genImgId || index}
            image={image}
            ref={index === images.length - Math.min(9, images.length / 3) ? lastItemRef : undefined}
            isLoaded={loadedImages.get(image.genImgId)}
            onImageLoad={() => handleImageLoad(image.genImgId)}
            onClick={() => handleImageClick(image)}
          />
        ))}
      </div>
      <ImageDetail imgList={images} image={selectedImage} isOpen={detailVisible} onClose={() => {}} />
    </>
  );
}
