'use client';

import { Suspense } from 'react';
import { ImageGrid } from '@/components/ImageGrid';
import { Sidebar } from '@/app/magic-kit/components/Sidebar';
import { Album as AlbumDrawer } from '@/components/Album';
import { useVariationFormStore } from '@/stores/useMagicKitStore';
import { SearchParamsHandler } from '@/components/SearchParamsHandler';

export default function MagicKitClient() {
  const { setCurrentVariationType, updateImageUrl } = useVariationFormStore();

  return (
    <div className="flex p-6 pt-[30px] z-0">
      <Suspense fallback={<div>Loading...</div>}>
        <SearchParamsHandler 
          onImageUrl={updateImageUrl}
          onVariationType={setCurrentVariationType}
        />
      </Suspense>
      <Sidebar />
      <main className="flex-1 pl-6 h-[calc(100vh-110px)] overflow-y-auto bg-transparent">
        <ImageGrid />
      </main>
      <AlbumDrawer />
    </div>
  );
}
