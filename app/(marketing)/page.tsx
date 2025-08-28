import type { Metadata } from 'next';
import StaticHero from '@/src/components/server/StaticHero';
import { getThemeForRoute } from '@/src/utils/themeRenderer';
import StaticFooter from '@/src/components/server/StaticFooter';
import StructuredDataEnhancer from '@/src/components/seo/StructuredDataEnhancer';

export const metadata: Metadata = {
  metadataBase: new URL('https://creamoda.ai'),
  title: 'Creamoda AI Tools | AI-Powered Fashion Design Platform',
  description: 'Reimagine Fashion with All-in-One AI-powered Solution. Create, design, and transform fashion with our comprehensive AI tools: background removal, virtual try-on, outfit generation, and more.',
  keywords: 'AI fashion design, outfit generator, virtual try-on, background remover, image enhancer, sketch to image, fashion AI tools',
  authors: [{ name: 'Creamoda AI' }],
  creator: 'Creamoda AI',
  publisher: 'Creamoda AI',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://creamoda.ai/',
    title: 'Creamoda AI Tools | AI-Powered Fashion Design Platform',
    description: 'Reimagine Fashion with All-in-One AI-powered Solution. Create stunning fashion designs with our comprehensive AI toolkit.',
    siteName: 'Creamoda AI Tools',
    images: [
      {
        url: '/marketing/images/hero/official_hero.svg',
        width: 900,
        height: 280,
        alt: 'Creamoda AI Fashion Design Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Creamoda AI Tools | AI-Powered Fashion Design Platform',
    description: 'Reimagine Fashion with All-in-One AI-powered Solution',
    images: ['/marketing/images/hero/official_hero.svg'],
    creator: '@creamoda_ai',
    site: '@creamoda_ai',
  },
  alternates: {
    canonical: 'https://creamoda.ai/',
  },
};

export default function Home() {
  // 获取默认主题（首页使用background_remove主题）
  const theme = getThemeForRoute('background_remove');
  const saasUrl = 'https://www.creamoda.ai/fashion-design/create';

  // 首页的结构化数据
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'Creamoda AI Tools',
    'description': 'AI-Powered Fashion Design Platform with comprehensive tools for fashion creation',
    'url': 'https://creamoda.ai',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': 'https://creamoda.ai/{search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    },
    'mainEntity': {
      '@type': 'SoftwareApplication',
      'name': 'Creamoda AI Fashion Tools',
      'applicationCategory': 'DesignApplication',
      'operatingSystem': 'Web Browser',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD',
        'description': 'Free credits for new users'
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* 增强版结构化数据 */}
      <StructuredDataEnhancer
        pageType="homepage"
        currentUrl="/"
      />
      
      {/* 静态Hero组件 - 包含所有主要内容 */}
      <StaticHero theme={theme} saasUrl={saasUrl} isHomepage={true} />
      
      {/* Footer组件 */}
      <StaticFooter />
    </div>
  );
}
