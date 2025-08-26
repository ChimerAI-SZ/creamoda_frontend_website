import { Suspense } from 'react';
import CommunityClient from './client-page';
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
    <Suspense fallback={<div>Loading...</div>}>
      <CommunityClient />
    </Suspense>
  );
}
