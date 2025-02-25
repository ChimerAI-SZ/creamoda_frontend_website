'use client';

import { useEffect, useState } from 'react';
import { mockAPI } from '@/lib/axios';
import Image from 'next/image';

export function ImageGrid() {
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const { status, data } = await mockAPI.get('/m2/5875613-5562180-default/261961292');
      setImages(data);

      // if ([50, 0].includes(data.code)) {
      console.log(data.data.list);

      setImages(data.data.list);
      // }
    };
    fetchImages();
  }, []);

  return (
    // 规则
    // 大于等于1920px：6栏布局（图片约262px）
    // [1680,1920)：5栏布局（图片约240px）
    // [1440,1680)：4栏布局（图片约244px）
    // [1200,1440)：3栏布局（图片约233px）
    // [800,1200)：2栏布局（图片约242px）
    // ＜800px：1栏布局（全宽显示）
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
        <div key={index} className="aspect-[3/4] relative overflow-hidden rounded-lg">
          <Image
            src={src.resultPic || '/placeholder.svg'}
            alt={`Fashion image ${index + 1}`}
            fill
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
