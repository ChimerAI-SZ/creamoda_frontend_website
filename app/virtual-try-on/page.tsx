'use client';

import { Suspense, useState } from 'react';

import { ImageGrid } from '@/components/ImageGrid';
import { Sidebar } from './components/Sidebar';
import { Album as AlbumDrawer } from '@/components/Album';
import { SearchParamsHandler } from '@/components/SearchParamsHandler';

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
