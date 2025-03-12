import type React from 'react';
import type { Metadata } from 'next';

import { ErrorDialog } from '@/components/ErrorDialog';
import { UserDataInitializer } from '@/app/components/UserDataInitializer';

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
        <UserDataInitializer />
        {children}
        <ErrorDialog />
      </body>
    </html>
  );
}

import './globals.css';
