'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ImageGrid } from '@/components/ImageGrid';
import { Sidebar } from '@/app/magic-kit/components/Sidebar';
import { Album as AlbumDrawer } from '@/components/Album';
import { useVariationFormStore } from '@/stores/useMagicKitStore';

// 包裹 useSearchParams 的组件
function SearchParamsHandler() {
  const searchParams = useSearchParams();
  const { setCurrentVariationType, updateImageUrl } = useVariationFormStore();

  useEffect(() => {
    // 检查URL参数
    const imageUrl = searchParams.get('imageUrl');
    const variationType = searchParams.get('variationType');

    if (imageUrl && variationType) {
      // 设置功能类型
      setCurrentVariationType(variationType);
      
      // 对于外部URL，直接使用解码后的URL，不进行Base64编码处理
      const decodedUrl = decodeURIComponent(imageUrl);
      console.log('Received image URL:', decodedUrl);
      
      // 直接设置图片URL，不需要额外处理
      updateImageUrl(decodedUrl);
    }
  }, [searchParams, setCurrentVariationType, updateImageUrl]);

  return null; // 这个组件只处理副作用，不渲染任何内容
}

export default function Page() {
  return (
    <div className="flex p-6 pt-[30px] z-0">
      <Suspense fallback={<div>Loading...</div>}>
        <SearchParamsHandler />
      </Suspense>
      <Sidebar />
      <main className="flex-1 pl-6 h-[calc(100vh-110px)] overflow-y-auto bg-transparent">
        <ImageGrid />
      </main>
      <AlbumDrawer />
    </div>
  );
}
