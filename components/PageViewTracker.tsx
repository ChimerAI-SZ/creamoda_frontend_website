/**
 * 页面浏览追踪组件
 * 自动追踪页面加载和路由变化，发送 page_enter 事件
 */

'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Analytics } from '@/lib/analytics';

export function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 页面加载或路由变化时发送 page_enter 事件
    Analytics.trackPageView();
    
    console.log('📊 [GA] page_enter event sent:', {
      pathname,
      search: searchParams.toString(),
      url: window.location.href,
    });
  }, [pathname, searchParams]);

  // 这个组件不渲染任何内容
  return null;
}

