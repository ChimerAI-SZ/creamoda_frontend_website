import type { Metadata } from 'next';
import StaticHero from '@/src/components/server/StaticHero';
import StaticNavigation from '@/src/components/server/StaticNavigation';
import Endorsement from '@/src/components/client/Endorsement';
import { getThemeForRoute } from '@/src/utils/themeRenderer';
import StaticFooter from '@/src/components/server/StaticFooter';
import StructuredDataEnhancer from '@/src/components/seo/StructuredDataEnhancer';
import WhyChoose from '@/src/components/server/WhyChoose';
import HowToUse from '@/src/components/server/HowToUse';
import StaticOfferMore from '@/src/components/server/StaticOfferMore';
import InsightsBeta from '@/src/components/server/InsightsBeta';
import ChasingTrends from '@/src/components/server/ChasingTrends';
import FashionAgent from '@/src/components/server/FasionAgent';
import OutfitGeneratorFeatureModule from '@/src/components/server/OutfitGeneratorFeatureModule';
import TestHero from '@/src/components/server/TestHero';
import ClientHeroInteractions from '@/src/components/client/ClientHeroInteractions';
import ClientGeneralWorkflowInteractions from '@/src/components/client/ClientGeneralWorkflowInteractions';

export const metadata: Metadata = {
  metadataBase: new URL('https://creamoda.ai'),
  title: 'Creamoda | AI-Powered Fashion Design Platform',
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
    title: 'Creamoda | AI-Powered Fashion Design Platform',
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
    title: 'Creamoda | AI-Powered Fashion Design Platform',
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
  const saasUrl = 'https://creamoda.ai/fashion-design/create';

  // 结构化数据现在通过 StructuredDataEnhancer 组件统一管理

  return (
    <div className="min-h-screen">
      {/* 增强版结构化数据 */}
      <StructuredDataEnhancer
        pageType="homepage"
        currentUrl="/"
      />
      {/* 独立的导航栏组件 - 添加适当的容器样式 */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="hero-content">
          <StaticNavigation currentSaasUrl={saasUrl} />
          <div className="dropdown-container"></div>
          {/* 客户端交互增强 */}
          <ClientHeroInteractions currentSaasUrl={saasUrl} />
          <ClientGeneralWorkflowInteractions />
        </div>
      </div>
      <TestHero />
      {/* 静态Hero组件 - 包含所有主要内容 */}
      {/* <StaticHero theme={theme} saasUrl={saasUrl} isHomepage={true} /> */}
      <Endorsement />
      <WhyChoose />
      <FashionAgent />
      <HowToUse />
      <OutfitGeneratorFeatureModule theme={theme} />
      <StaticOfferMore />
      <InsightsBeta />
      <ChasingTrends />
      {/* Footer组件 */}
      <StaticFooter />
    </div>
  );
}
