import type React from 'react';
import type { Metadata } from 'next';
import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';
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

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* 预加载关键字体文件 */}
        <link
          rel="preload"
          href="/marketing/fonts/NeueMachina-Ultrabold.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/marketing/fonts/NeueMachina-Regular.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/marketing/fonts/AVENIR-BLACK-3.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/marketing/fonts/MontserratAlternates-SemiBold.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[url('/images/bg.png')] bg-cover">
        <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''} />
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
