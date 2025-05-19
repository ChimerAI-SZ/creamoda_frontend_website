'use client';

import { LoginModal } from '@/app/app-components/Login';

import { Sidebar } from '@/components/Sidebar';
import { ImageGrid } from '../components/ImageGrid/index';

import { Album as AlbumDrawer } from '@/components/Album';

export default function Page() {
  return (
    <div className="flex h-[calc(100vh - 56px)]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 z-0 p-[16px] overflow-auto bg-[#FFFDFA]">
          <ImageGrid />
          <LoginModal />
        </main>
      </div>
      <AlbumDrawer />
    </div>
  );
}
