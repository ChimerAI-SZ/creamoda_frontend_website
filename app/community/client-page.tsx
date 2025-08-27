'use client';

import { ImageGrid } from './components/ImageGrid';
import { Album as AlbumDrawer } from '@/components/Album';

export default function CommunityClient() {
  return (
    <div className="flex p-6 pt-[30px] z-0">
      <main className="flex-1 h-[calc(100vh-110px)] overflow-y-auto bg-transparent">
        <ImageGrid />
      </main>
      <AlbumDrawer />
    </div>
  );
}
