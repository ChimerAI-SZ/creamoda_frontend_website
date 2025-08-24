import type React from 'react';

import { Analytics } from '@vercel/analytics/react';
import { Header } from '@/components/Header';
import { LoginModal } from '@/app/app-components/Login';

import { TooltipProvider } from '@/components/ui/tooltip';
import { GlobalConfirm } from '@/components/GlobalConfirm';
import { AlertToast } from '@/components/AlertToast';

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <Header />
      <div className="flex-1">
        {children}
      </div>
      <Analytics />
      <LoginModal />
      <GlobalConfirm />
      <AlertToast />
    </TooltipProvider>
  );
}


