'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';

export function ConditionalHeader() {
  const pathname = usePathname();
  const [showHeader, setShowHeader] = useState(true);
  
  useEffect(() => {
    // 营销页路由（这些路径不显示 SaaS Header）
    const marketingRoutes = [
      '/',
      '/image-background-remover',
      '/image-background-changer', 
      '/image-enhancer',
      '/image-changer',
      '/image-color-changer',
      '/virtual-try-on',
      '/outfit-generator',
      '/sketch-to-image',
      '/free-nano-banana',
      '/designs',
      '/about',
      '/not-found',
      '/fashion-agent',
      '/privacy-policy',
      '/terms-of-service'
    ];
    
    // 如果是营销页路由，不显示 SaaS Header
    if (marketingRoutes.includes(pathname)) {
      setShowHeader(false);
      return;
    }
    
    // 如果是 /designs/slug 这样的动态路由，也不显示 SaaS Header
    if (pathname.startsWith('/designs/') && pathname !== '/designs') {
      setShowHeader(false);
      return;
    }

    // 如果路径以营销页面模式开头，也不显示 SaaS Header
    const marketingPatterns = [
      '/image-',
      '/virtual-',
      '/outfit-',
      '/sketch-',
      '/magic-kit/',
      '/fashion-design/',
    ];
    
    if (marketingPatterns.some(pattern => pathname.startsWith(pattern) && !pathname.includes('/create'))) {
      setShowHeader(false);
      return;
    }
    
    // SaaS页面路由模式 - 这些应该显示SaaS Header
    const saasPatterns = [
      '/fashion-design/create',
      '/magic-kit/create',
      '/ai-fashion/',
      '/community/',
      '/virtual-try-on/create'
    ];
    
    const isSaasRoute = saasPatterns.some(pattern => pathname.startsWith(pattern));
    
    // 如果是SaaS路由，显示Header
    if (isSaasRoute) {
      setShowHeader(true);
      return;
    }
    
    // 对于其他未知路径（可能是404页面），不显示SaaS Header
    // 这样404页面就只会显示营销页导航栏
    setShowHeader(false);
  }, [pathname]);
  
  return showHeader ? <Header /> : null;
}
