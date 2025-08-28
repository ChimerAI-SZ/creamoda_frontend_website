'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/Header';

export function ConditionalHeader() {
  const pathname = usePathname();
  
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
    '/free-nano-banana'
  ];
  
  // 如果是营销页路由，不显示 SaaS Header
  if (marketingRoutes.includes(pathname)) {
    return null;
  }
  
  return <Header />;
}
