'use client';
import { ImageGrid } from '@/components/ImageGrid';
import { Sidebar } from './components/Sidebar';

export default function Page() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 z-0 p-[16px] h-[calc(100vh-64px)] overflow-y-auto bg-[#FFFDFA]">
        <ImageGrid />
      </main>
    </div>
  );
}
