import { Suspense } from 'react';
import VirtualTryOnClient from './client-page';

// 为应用页面添加基本的SEO信息
export const metadata = {
  title: 'Virtual Try-On - AI Fashion Fitting Tool | Creamoda',
  description: 'Try on clothes virtually with AI-powered fitting technology. Upload your photo and see how outfits look on you.',
  robots: {
    index: false, // 应用页面不需要被搜索引擎索引
    follow: true,
  },
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VirtualTryOnClient />
    </Suspense>
  );
}
