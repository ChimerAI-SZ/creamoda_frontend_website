import type { Metadata } from 'next';
import { Suspense } from 'react';
import ThemeAwarePage from '@/src/components/ThemeAwarePage';

export const metadata: Metadata = {
  title: 'Creamoda AI Tools | 首页',
  description: '一站式 AI 图片编辑工具集合：背景移除、背景替换、图片增强、颜色替换、局部修改、草图转图、虚拟试衣与服装生成。',
};

// Loading fallback component
function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<PageLoading />}>
      <ThemeAwarePage initialTheme="background_remove" />
    </Suspense>
  );
}
