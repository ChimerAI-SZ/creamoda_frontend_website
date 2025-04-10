'use client';

import { LoginModal } from '@/app/app-components/Login';

import { Header } from '@/components/Header';
import { MenuBar } from '@/components/MenuBar';

import { Sidebar } from '@/components/Sidebar';

export default function Page() {
  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      <Header />
      <div className="flex">
        {/* <MenuBar /> */}
        {/* <Sidebar /> */}
        <main className="flex-1 z-0 p-[16px] h-[calc(100vh-64px)] overflow-y-auto bg-[#FFFDFA]">
          <LoginModal />
        </main>
      </div>
    </div>
  );
}
