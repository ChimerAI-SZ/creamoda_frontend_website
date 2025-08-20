'use client';

import { Sidebar } from '@/components/Sidebar';
import { ImageGrid } from '../components/ImageGrid/index';
import { Album as AlbumDrawer } from '@/components/Album';
import { Suspense } from 'react';
import { useVariationFormStore } from '@/stores/useVariationFormStore';
import { SearchParamsHandler } from '@/components/SearchParamsHandler';

export default function Page() {
  const { setCurrentVariationType, updateImageUrl } = useVariationFormStore();

  return (
    <div className="flex p-6 pt-[30px] z-0">
      <Suspense fallback={<div>Loading...</div>}>
        <SearchParamsHandler 
          onImageUrl={updateImageUrl}
          onVariationType={setCurrentVariationType}
        />
        <Sidebar />
      </Suspense>
      <main className="flex-1 pl-6 h-[calc(100vh-110px)] overflow-y-auto bg-transparent">
        <ImageGrid />
      </main>
      <AlbumDrawer />
    </div>
  );
}
