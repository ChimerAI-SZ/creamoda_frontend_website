'use client';

import { usePathname } from 'next/navigation';
import GoogleOneTap from './GoogleOneTap';

export function ConditionalGoogleOneTap() {
  const pathname = usePathname();
  
  // 只在营销页面显示 Google One Tap，不在 SaaS 功能页面显示
  const isMarketingRoute = !pathname.startsWith('/create') && 
                          !pathname.startsWith('/magic-kit/create') && 
                          !pathname.startsWith('/virtual-try-on/create') &&
                          !pathname.startsWith('/fashion-design/create') &&
                          !pathname.startsWith('/community') &&
                          !pathname.startsWith('/api');
  
  // 营销页面显示 Google One Tap
  if (!isMarketingRoute) {
    return null;
  }
  
  return <GoogleOneTap debug={process.env.NODE_ENV === 'development'} />;
}
