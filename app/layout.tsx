import type React from 'react';
import type { Metadata } from 'next';

import { ErrorDialog } from '@/components/ErrorDialog';
import { Analytics } from '@vercel/analytics/react';
import GlobalAlert from '@/components/GlobalAlert';
import { Album as AlbumDrawer } from '@/components/Album';

import '@/utils/modal';

export const metadata: Metadata = {
  title: 'CREAMODA',
  description: 'Fashion design platform',
  generator: 'v0.dev',
  icons: {
    icon: [{ url: '/favicon.ico' }, { url: '/icon.png', type: 'image/png' }],
    apple: [{ url: '/apple-icon.png' }]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background">
        {children}
        <ErrorDialog />
        <Analytics />
        <GlobalAlert />
        <AlbumDrawer />
      </body>
    </html>
  );
}
import './globals.css';
