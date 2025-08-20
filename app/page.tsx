'use client';

import { Sidebar } from '@/components/Sidebar';
import { ImageGrid } from '../components/ImageGrid/index';
import { Album as AlbumDrawer } from '@/components/Album';
import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { useVariationFormStore } from '@/stores/useVariationFormStore';

// 包裹 useSearchParams 的组件
function SearchParamsHandler() {
  const searchParams = useSearchParams();
  const { setCurrentVariationType, updateImageUrl } = useVariationFormStore();

  useEffect(() => {
    // 检查URL参数
    const imageUrl = searchParams.get('imageUrl');
    const variationType = searchParams.get('variationType');
    const tab = searchParams.get('tab');

    // 如果有图片URL和变型类型，设置到store中
    if (imageUrl && variationType) {
      console.log('Setting homepage params:', { imageUrl, variationType, tab });
      setCurrentVariationType(variationType);
      updateImageUrl(decodeURIComponent(imageUrl));
    }
  }, [searchParams, setCurrentVariationType, updateImageUrl]);

  return null; // 这个组件只处理副作用，不渲染任何内容
}

export default function Page() {
  return (
    <div className="flex p-6 pt-[30px] z-0">
      <Suspense fallback={<div>Loading...</div>}>
        <SearchParamsHandler />
        <Sidebar />
      </Suspense>
      <main className="flex-1 pl-6 h-[calc(100vh-110px)] overflow-y-auto bg-transparent">
        <ImageGrid />
      </main>
      <AlbumDrawer />
    </div>
  );
}
