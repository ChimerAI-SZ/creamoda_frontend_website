'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';

export function ConditionalHeader() {
  const pathname = usePathname();
  const [showHeader, setShowHeader] = useState(false);
  
  useEffect(() => {
    // SaaS页面路由模式 - 这些应该显示SaaS Header
    const saasPatterns = [
      '/fashion-design/create',
      '/magic-kit/create',
      '/ai-fashion/',
      '/community/',
      '/virtual-try-on/create'
    ];
    
    const isSaasRoute = saasPatterns.some(pattern => pathname.startsWith(pattern));
    
    // 只有SaaS路由才显示Header，其他路由（包括营销页面）都不显示
    setShowHeader(isSaasRoute);
  }, [pathname]);
  
  return showHeader ? <Header /> : null;
}
