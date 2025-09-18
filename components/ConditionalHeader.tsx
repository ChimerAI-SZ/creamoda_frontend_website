'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';

export function ConditionalHeader() {
  const pathname = usePathname();
  const [isNotFound, setIsNotFound] = useState(false);
  
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
    '/about'
  ];

  // 已知的有效路由模式
  const validRoutePatterns = [
    ...marketingRoutes,
    /^\/designs\/[^\/]+$/, // /designs/slug
    /^\/create(\/.*)?$/, // /create 及其子路由
    /^\/magic-kit(\/.*)?$/, // /magic-kit 及其子路由
    /^\/virtual-try-on(\/.*)?$/, // /virtual-try-on 及其子路由
    /^\/fashion-design(\/.*)?$/, // /fashion-design 及其子路由
    /^\/community(\/.*)?$/, // /community 及其子路由
    /^\/ai-fashion(\/.*)?$/, // /ai-fashion 及其子路由
    /^\/app-components(\/.*)?$/, // /app-components 及其子路由
    /^\/privacy-policy$/, // /privacy-policy
    /^\/terms-of-service$/, // /terms-of-service
    /^\/api(\/.*)?$/, // API 路由
  ];

  useEffect(() => {
    // 检查当前路径是否匹配任何有效路由模式
    const isValidRoute = validRoutePatterns.some(pattern => {
      if (typeof pattern === 'string') {
        return pathname === pattern;
      } else {
        return pattern.test(pathname);
      }
    });

    // 如果不是有效路由，可能是 404 页面
    setIsNotFound(!isValidRoute);
  }, [pathname]);
  
  // 如果是营销页路由，不显示 SaaS Header
  if (marketingRoutes.includes(pathname)) {
    return null;
  }
  
  // 如果是 /designs/slug 这样的动态路由，也不显示 SaaS Header
  if (pathname.startsWith('/designs/') && pathname !== '/designs') {
    return null;
  }

  // 如果是 404 页面，不显示 SaaS Header（让根级 not-found.tsx 处理导航栏）
  if (isNotFound) {
    return null;
  }
  
  return <Header />;
}
