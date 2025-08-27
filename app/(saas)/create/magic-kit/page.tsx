import { Suspense } from 'react';
import MagicKitClient from './client-page';

// 为应用页面添加基本的SEO信息
export const metadata = {
  title: 'Magic Kit - AI Image Editing Tools | Creamoda',
  description: 'Professional AI-powered image editing tools including background removal, color changing, image enhancement and more.',
  robots: {
    index: false, // 应用页面不需要被搜索引擎索引
    follow: true,
  },
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MagicKitClient />
    </Suspense>
  );
}