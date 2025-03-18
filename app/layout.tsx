import type React from 'react';
import type { Metadata } from 'next';

import { ErrorDialog } from '@/components/ErrorDialog';

import './globals.css';

export const metadata: Metadata = {
  title: 'CREAMODA',
  description: 'Fashion design platform',
  generator: 'v0.dev'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background">
        {children}
        <ErrorDialog />
      </body>
    </html>
  );
}

import './globals.css';
