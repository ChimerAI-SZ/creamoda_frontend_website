'use client';

import { LoginModal } from '@/app/app-components/Login';

import { MenuBar } from '@/components/MenuBar';

import { Sidebar } from '@/components/Sidebar';
import { ImageGrid } from '../components/ImageGrid/index';

export default function Page() {
  return (
    <div className="flex">
      <MenuBar />
      <Sidebar />
      <main className="flex-1 z-0 p-[16px] h-[calc(100vh-64px)] overflow-y-auto bg-[#FFFDFA]">
        <ImageGrid />
        <LoginModal />
      </main>
    </div>
  );
}
