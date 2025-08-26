'use client';

import { ImageGrid } from './components/ImageGrid';
import { Album as AlbumDrawer } from '@/components/Album';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community Gallery - Fashion AI Creations | Creamoda',
  description: 'Explore amazing AI-generated fashion designs created by our community. Get inspired and share your own creations.',
  keywords: 'AI fashion, community gallery, fashion designs, AI art, creative community',
  openGraph: {
    title: 'Community Gallery - Fashion AI Creations | Creamoda',
    description: 'Explore amazing AI-generated fashion designs created by our community.',
    type: 'website',
  },
};

export default function Page() {
  return (
    <div className="flex p-6 pt-[30px] z-0">
      <main className="flex-1 h-[calc(100vh-110px)] overflow-y-auto bg-transparent">
        <ImageGrid />
      </main>
      <AlbumDrawer />
    </div>
  );
}
