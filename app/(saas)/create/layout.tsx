'use client';

import type React from 'react';
import { useEffect } from 'react';

import { Analytics } from '@vercel/analytics/react';
import { LoginModal } from '@/app/app-components/Login';

import { TooltipProvider } from '@/components/ui/tooltip';
import { GlobalConfirm } from '@/components/GlobalConfirm';
import { AlertToast } from '@/components/AlertToast';
import { api } from '@/lib/axios';

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  // 确保页面加载时 axios 能正确读取 token
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        // 确保 axios 默认 header 包含 token
        api.defaults.headers.common['Authorization'] = token;
        console.log('[CreateLayout] Token initialized:', token.substring(0, 20) + '...');
      } else {
        console.log('[CreateLayout] No token found in localStorage');
      }
    }
  }, []);

  return (
    <TooltipProvider>
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


