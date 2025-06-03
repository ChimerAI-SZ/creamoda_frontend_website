import type React from 'react';
import type { Metadata } from 'next';

import { ErrorDialog } from '@/components/ErrorDialog';
import { Analytics } from '@vercel/analytics/react';
import { Header } from '@/components/Header';
import GlobalAlert from '@/components/GlobalAlert';

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
      <body className="min-h-screen flex flex-col bg-[url('/images/bg.png')] bg-cover">
        <Header />
        {children}
        <ErrorDialog />
        <Analytics />
        <GlobalAlert />
      </body>
    </html>
  );
}
import './globals.css';
