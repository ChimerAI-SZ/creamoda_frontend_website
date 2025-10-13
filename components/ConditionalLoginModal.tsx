'use client';

import { usePathname } from 'next/navigation';
import { LoginModal } from '@/app/app-components/Login';

export function ConditionalLoginModal() {
  // 现在在所有页面都显示登录模态框
  return <LoginModal />;
}
