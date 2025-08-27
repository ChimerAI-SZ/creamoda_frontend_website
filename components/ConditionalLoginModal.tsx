'use client';

import { usePathname } from 'next/navigation';
import { LoginModal } from '@/app/app-components/Login';

export function ConditionalLoginModal() {
  const pathname = usePathname();
  
  // 只在SAAS路径中显示登录模态框
  const isSaasRoute = pathname.startsWith('/create') || 
                     pathname.startsWith('/magic-kit/create') || 
                     pathname.startsWith('/virtual-try-on/create') ||
                     pathname.startsWith('/fashion-design/create') ||
                     pathname.startsWith('/community');
  
  // 营销页面不显示登录模态框
  if (!isSaasRoute) {
    return null;
  }
  
  return <LoginModal />;
}
