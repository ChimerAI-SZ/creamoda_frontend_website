'use client';

import { ImageGrid } from '@/components/ImageGrid';
import { Sidebar } from '@/app/magic-kit/components/Sidebar';
import { Album as AlbumDrawer } from '@/components/Album';

export default function Page() {
  return (
    <div className="flex p-6 pt-[30px] z-0">
      <Sidebar />
      <main className="flex-1 pl-6 h-[calc(100vh-110px)] overflow-y-auto bg-transparent">
        <ImageGrid />
      </main>
      <AlbumDrawer />
    </div>
  );
}
