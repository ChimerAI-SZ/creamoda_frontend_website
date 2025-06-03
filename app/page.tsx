'use client';

import { LoginModal } from '@/app/app-components/Login';

import { Sidebar } from '@/components/Sidebar';
import { ImageGrid } from '../components/ImageGrid/index';

import { Album as AlbumDrawer } from '@/components/Album';

export default function Page() {
  return (
    <div className="flex p-6 pt-[30px]">
      <Sidebar />
      <main className="flex-1 z-0 pl-6 h-[calc(100vh-110px)] overflow-y-auto bg-transparent">
        <ImageGrid />
        <LoginModal />
      </main>
      <AlbumDrawer />
    </div>
  );
}
