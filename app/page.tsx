import { Header } from "@/components/app-components/header";
import { Sidebar } from "@/components/app-components/sidebar";
import { MenuBar } from "@/components/app-components/menu-bar";
import { ImageGrid } from "@/components/app-components/image-grid";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      <Header />
      <div className="flex">
        <MenuBar />
        <Sidebar />
        <main className="flex-1 p-6">
          <ImageGrid />
        </main>
      </div>
    </div>
  );
}
