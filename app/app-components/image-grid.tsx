'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { mockAPI } from '@/lib/axios';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function ImageGrid() {
  // 图片列表
  const [images, setImages] = useState<any[]>([]);
  // 分页参数
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [total, setTotal] = useState(1000);
  // 加载状态
  const [loading, setLoading] = useState(false);
  // 是否还有更多数据
  const [hasMore, setHasMore] = useState(true);
  // 容器引用
  const containerRef = useRef<HTMLDivElement>(null);
  // 观察器引用
  const observer = useRef<IntersectionObserver | null>(null);
  // 最后一个元素引用
  const lastImageElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
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
    [loading, hasMore]
  );

  // 加载图片数据
  const fetchImages = async (currentPage: number) => {
    setLoading(true);
    try {
      const URL = `/m2/5875613-5562180-default/261961292?page=${currentPage}&pageSize=${pageSize}`;
      const { data } = await mockAPI.get(URL);

      if (data.code === 0) {
        if (currentPage === 1) {
          setImages(data.data.list);
        } else {
          setImages(prev => [...prev, ...data.data.list]);
        }

        setTotal(data.data.total || 1000);
        setHasMore(currentPage * pageSize < (data.data.total || 1000));
      }
    } catch (error) {
      console.error('加载图片失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 加载更多图片
  const loadMoreImages = () => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchImages(nextPage);
  };

  // 初始加载
  useEffect(() => {
    fetchImages(1);
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
      className="grid gap-4 pr-[26px] relative z-0
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
      {images.map((src, index) => (
        <div
          key={index}
          ref={index === images.length - Math.min(9, images.length / 3) ? lastImageElementRef : undefined}
          className="aspect-[3/4] relative overflow-hidden rounded-lg group"
        >
          <Image
            src={src.resultPic || '/placeholder.svg'}
            alt={`Fashion image ${index + 1}`}
            fill
            className="object-cover"
            loading="lazy"
          />
          {/* 添加渐变遮罩层和按钮 */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
            style={{
              background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%)'
            }}
          >
            {/* todo 3d making 按钮 点击事件 */}
            <Button size="sm" className="w-[calc(100%-32px)] absolute bottom-8 w-fit">
              3D making
            </Button>
          </div>
        </div>
      ))}

      {loading && (
        <div className="col-span-full flex justify-center py-4">
          <div className="animate-spin h-6 w-6 border-2 border-gray-500 border-t-transparent rounded-full"></div>
        </div>
      )}

      {!hasMore && images.length > 0 && (
        <div className="col-span-full text-center py-4 text-gray-500">没有更多图片了</div>
      )}
    </div>
  );
}
