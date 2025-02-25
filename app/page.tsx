import { Header } from '@/components/Header';
import { Sidebar } from '@/app/app-components/sidebar';
import { MenuBar } from '@/app/app-components/menu-bar';
import { ImageGrid } from '@/app/app-components/image-grid';

export default function Page() {
  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      <Header />
      <div className="flex">
        <MenuBar />
        <Sidebar />
        <main className="flex-1 p-6 z-0">
          <ImageGrid />
        </main>
      </div>
    </div>
  );
}
