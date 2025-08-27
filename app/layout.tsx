import type React from 'react';
import type { Metadata } from 'next';
import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import { ConditionalHeader } from '@/components/ConditionalHeader';
import { ConditionalLoginModal } from '@/components/ConditionalLoginModal';

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
          <ConditionalHeader />
          {children}
          <Analytics />
          <ConditionalLoginModal />
          <GlobalConfirm />
        </TooltipProvider>
        <AlertToast />
      </body>
    </html>
  );
}
