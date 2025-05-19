'use client';

import { LoginModal } from '@/app/app-components/Login';

import { MenuBar } from '@/components/MenuBar';

import { Sidebar } from '@/components/Sidebar';
import { ImageGrid } from '../components/ImageGrid/index';

import { Album as AlbumDrawer } from '@/components/Album';

export default function Page() {
  return (
    <>
      <div className="flex flex-1">
        {/* <MenuBar /> */}
        <Sidebar />
        <main className="flex-1 z-0 p-[16px] h-[calc(100vh - 56px)] overflow-y-auto bg-[#FFFDFA]">
          <ImageGrid />
          <LoginModal />
        </main>
      </div>
      <AlbumDrawer />
    </>
  );
}
