'use client';

import { useEffect, useState } from 'react';
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

  useEffect(() => {
    const fetchImages = async () => {
      const URL = `/m2/5875613-5562180-default/261961292?page=${page}&pageSize=${pageSize}`;
      const { data } = await mockAPI.get(URL);

      if (data.code === 0) {
        setImages(data.data.list);
      }
    };
    fetchImages();
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
        <div key={index} className="aspect-[3/4] relative overflow-hidden rounded-lg group">
          <Image
            src={src.resultPic || '/placeholder.svg'}
            alt={`Fashion image ${index + 1}`}
            fill
            className="object-cover"
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
    </div>
  );
}
