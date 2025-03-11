'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import GetIntTouchDialog from '@/components/GetIntTouchDialog';

import { emitter } from '@/utils/events';
import { localAPI } from '@/lib/axios';
import { cn } from '@/lib/utils';

export function ImageGrid() {
  // 图片列表
  const [images, setImages] = useState<any[]>([]);
  // 分页参数
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // 是否还有更多数据
  const [hasMore, setHasMore] = useState(true);
  // 容器引用
  const containerRef = useRef<HTMLDivElement>(null);
  // 观察器引用
  const observer = useRef<IntersectionObserver | null>(null);

  // 移除 pendingImageIds state，只保留 ref
  const pendingIdsRef = useRef<Set<string>>(new Set());
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 添加一个 Map 来跟踪图片加载状态
  const [loadedImages, setLoadedImages] = useState<Map<string, boolean>>(new Map());

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

  // 修改 checkPendingImages
  const checkPendingImages = useCallback(async () => {
    if (pendingIdsRef.current.size === 0) {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
      return;
    }

    try {
      const pendingIds = Array.from(pendingIdsRef.current).join(',');
      const { data } = await localAPI.get(`/api/v1/img/generate/refresh_status?genImgIdList=${pendingIds}`);

      if (data.code === 0) {
        const updatedImages = data.data?.list || [];
        const completedIds = new Set<string>();

        updatedImages.forEach((image: any) => {
          // 更新所有返回的图片状态
          setImages(prev => prev.map(img => (img.genImgId === image.genImgId ? image : img)));

          // 如果图片已完成，记录ID
          if ([3, 4].includes(image.status)) {
            completedIds.add(image.genImgId);
          }
        });

        // 从pendingIdsRef中移除已完成的图片
        if (completedIds.size > 0) {
          const newSet = new Set(pendingIdsRef.current);
          completedIds.forEach(id => newSet.delete(id));
          pendingIdsRef.current = newSet;
        }
      }
    } catch (error) {
      console.error('检查待生成图片状态失败:', error);
    }
  }, []);

  // 修改 fetchRecentImages
  const fetchRecentImages = useCallback(async () => {
    try {
      const URL = `/api/v1/img/generate/list?page=1&pageSize=10`;
      const { data } = await localAPI.get(URL);

      if (data.code === 0) {
        const recentImages = data.data.list || [];
        const existingGenImgIds = new Set(images.map(img => img.genImgId));
        const newImages = recentImages.filter((img: any) => !existingGenImgIds.has(img.genImgId));

        if (newImages.length > 0) {
          // 添加新的待生成图片到跟踪集合
          const newPendingIds = newImages
            .filter((img: any) => img.status === 1 || img.status === 2)
            .map((img: any) => img.genImgId);

          if (newPendingIds.length > 0) {
            // 直接更新 ref
            pendingIdsRef.current = new Set([...pendingIdsRef.current, ...newPendingIds]);

            if (!pollTimerRef.current) {
              setTimeout(() => {
                checkPendingImages();
              }, 0);

              pollTimerRef.current = setInterval(checkPendingImages, 3000);
            }
          }

          setImages(prevImages => [...newImages, ...prevImages]);
        }

        setHasMore(pageSize < (data.data.total || 1000));
      }
    } catch (error) {
      console.error('加载最近图片失败:', error);
    }
  }, [pageSize, images, checkPendingImages]);

  // 加载更多图片
  const loadMoreImages = useCallback(() => {
    if (!hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchImages(nextPage);
  }, [hasMore, page, fetchImages]);

  // 最后一个元素引用
  const lastImageElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting && hasMore) {
            loadMoreImages();
          }
        },
        {
          rootMargin: '300px' // 提前触发加载的距离
        }
      );

      if (node) observer.current.observe(node);
    },
    [hasMore, loadMoreImages]
  );

  // 初始加载
  useEffect(() => {
    fetchImages(1);
  }, [fetchImages]);

  useEffect(() => {
    // 监听事件
    const handler = (data: { data: any }) => {
      console.log('收到 Sidebar 提交成功事件', data);
      // 当收到提交成功事件时，刷新最近图片
      fetchRecentImages();
    };

    emitter.on('sidebar:submit-success', handler);

    // 组件卸载时取消监听
    return () => {
      emitter.off('sidebar:submit-success', handler);
    };
  }, [fetchRecentImages]);

  // 清理轮询定时器
  useEffect(() => {
    return () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    };
  }, []);

  // 处理图片加载完成事件
  const handleImageLoad = useCallback((genImgId: string) => {
    setLoadedImages(prev => new Map(prev).set(genImgId, true));
  }, []);

  return (
    // 响应式布局规则:
    // < 640px: 1栏布局 (grid-cols-1)
    // [640px, 800px): 2栏布局 (sm:grid-cols-2)
    // [800px, 1200px): 2栏布局 (min-[800px]:grid-cols-2)
    // [1200px, 1440px): 3栏布局 (min-[1200px]:grid-cols-3)
    // [1440px, 1680px): 4栏布局 (min-[1440px]:grid-cols-4)
    // [1680px, 1920px): 5栏布局 (min-[1680px]:grid-cols-5)
    // [1920px, 2560px): 6栏布局 (min-[1920px]:grid-cols-6)
    // [2560px, 3440px): 7栏布局 (min-[2560px]:grid-cols-7)
    // [3440px, 3840px): 8栏布局 (min-[3440px]:grid-cols-8)
    // >= 3840px: 9栏布局 (min-[3840px]:grid-cols-9)
    <div
      ref={containerRef}
      className="grid gap-4 relative z-0 bg-[#FFFDFA]
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
      {images.map((src, index) => {
        const isGenerating = src.status === 1 || src.status === 2;
        const isFailed = src.status === 4;
        const isLoaded = loadedImages.get(src.genImgId);
        const showLoading = isGenerating || (!isLoaded && src.status === 3);

        return (
          <div
            key={src.genImgId || index}
            ref={index === images.length - Math.min(9, images.length / 3) ? lastImageElementRef : undefined}
            className="aspect-[3/4] relative overflow-hidden group border-none"
          >
            {/* 生成中状态 */}
            {showLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FAFAFA] z-[1] rounded-[4px] border border-[#DCDCDC]">
                <div className="relative w-[64px] h-[64px]">
                  <Image
                    src="/images/generate/loading.gif"
                    alt="Generating..."
                    fill
                    className="object-cover"
                    priority
                    unoptimized
                  />
                </div>
                <div className="absolute top-[10px] left-[10px] text-center">
                  <div className="inline-flex px-2 py-[2px] justify-center items-center gap-1 rounded-[9999px] border border-[#DCDCDC] bg-white">
                    <span className="inline-flex px-2 py-[2px] justify-center items-center gap-1 text-sm font-medium text-gray-700 leading-4">
                      Generating ≈ 20s
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 生成失败状态 */}
            {isFailed && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FAFAFA] z-[1] rounded-[4px] border border-[#DCDCDC]">
                <div className="relative w-[150px] h-[150px]">
                  <Image
                    src="/images/generate/failToGenerate.svg"
                    alt="Generation Failed"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            )}

            {/* 结果图片 (仅在成功生成且加载完成时显示) */}
            {!isFailed && (
              <div
                className={cn(
                  'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center bg-[#FAFAFA] rounded-[4px] border border-[#DCDCDC] overflow-hidden',
                  !showLoading ? 'opacity-100' : 'opacity-0'
                )}
              >
                <Image
                  src={src.resultPic || '/placeholder.svg'}
                  alt={`Fashion image ${index + 1}`}
                  fill
                  className="object-cover"
                  loading="lazy"
                  onLoadingComplete={() => src.genImgId && handleImageLoad(src.genImgId)}
                />
              </div>
            )}

            {/* 正常状态的悬浮效果 (仅在成功生成时显示) */}
            {!showLoading && !isFailed && (
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-[4px]"
                style={{
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%)'
                }}
              >
                <GetIntTouchDialog
                  trigger={
                    <Button size="sm" className="w-[104px] h-[28px] absolute bottom-8">
                      3D making
                    </Button>
                  }
                />
              </div>
            )}
          </div>
        );
      })}

      {/* {!hasMore && images.length > 0 && (
        <div className="col-span-full text-center py-4 text-gray-500">没有更多图片了</div>
      )} */}
    </div>
  );
}
