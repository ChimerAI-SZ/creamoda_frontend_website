import { Suspense } from 'react';

import { ImageGrid } from '@/components/ImageGrid';
import { Sidebar } from './components/Sidebar';
import { Album as AlbumDrawer } from '@/components/Album';

export default function Page() {
  return (
    <>
      <div className="flex">
        <Suspense fallback={<div></div>}>
          <Sidebar />
        </Suspense>
        <main className="flex-1 z-0 p-[16px] h-[calc(100vh-56px)] overflow-y-auto bg-[#FFFDFA]">
          <ImageGrid />
        </main>
      </div>
      <AlbumDrawer />
    </>
  );
}
