import type React from 'react';
import type { Metadata } from 'next';

import { Analytics } from '@vercel/analytics/react';
import { Header } from '@/components/Header';
import { LoginModal } from '@/app/app-components/Login';

import { TooltipProvider } from '@/components/ui/tooltip';
import { GlobalConfirm } from '@/components/GlobalConfirm';
import { AlertToast } from '@/components/AlertToast';

export const metadata: Metadata = {
  title: 'CREAMODA',
  description: 'Fashion design platform',
  icons: {
    icon: [{ url: '/favicon.ico' }, { url: '/icon.png', type: 'image/png' }],
    apple: [{ url: '/apple-icon.png' }]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[url('/images/bg.png')] bg-cover">
        <TooltipProvider>
          <Header />
          {children}
          <Analytics />
          <LoginModal />
          <GlobalConfirm />
        </TooltipProvider>
        <AlertToast />
      </body>
    </html>
  );
}
import './globals.css';
