import { Header } from '@/components/Header';
import { Sidebar } from '@/app/app-components/Sidebar';
import { MenuBar } from '@/components/MenuBar/menu-bar';
import { ImageGrid } from '@/app/app-components/ImageGrid';

export default function Page() {
  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      <Header />
      <div className="flex">
        <MenuBar />
        <Sidebar />
        <main className="flex-1 p-6 z-0 h-[calc(100vh-64px)] overflow-y-auto">
          <ImageGrid />
        </main>
      </div>
    </div>
  );
}
