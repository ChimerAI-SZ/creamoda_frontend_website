'use client';

import { Suspense, useState } from 'react';

import { ImageGrid } from '@/components/ImageGrid';
import { Sidebar } from '../../../virtual-try-on/components/Sidebar';
import { Album as AlbumDrawer } from '@/components/Album';
import { SearchParamsHandler } from '@/components/SearchParamsHandler';

// 为应用页面添加基本的SEO信息
export const metadata = {
  title: 'Virtual Try-On - AI Fashion Fitting Tool | Creamoda',
  description: 'Try on clothes virtually with AI-powered fitting technology. Upload your photo and see how outfits look on you.',
  robots: {
    index: false, // 应用页面不需要被搜索引擎索引
    follow: true,
  },
};

export default function Page() {
  const [externalImageUrl, setExternalImageUrl] = useState<string>('');

  return (
    <div className="flex p-6 pt-[30px] z-0">
      <Suspense fallback={<div></div>}>
        <SearchParamsHandler 
          onImageUrl={setExternalImageUrl}
        />
        <Sidebar externalImageUrl={externalImageUrl} />
      </Suspense>
      <main className="flex-1 pl-6 h-[calc(100vh-110px)] overflow-y-auto bg-transparent">
        <ImageGrid />
      </main>
      <AlbumDrawer />
    </div>
  );
}
