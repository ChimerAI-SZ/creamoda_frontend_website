import type { Metadata } from 'next';
import AgentHero from '@/src/components/server/AgentHero';
import StaticFooter from '@/src/components/server/StaticFooter';
import StaticNavigation from '@/src/components/server/StaticNavigation';
import ClientHeroInteractions from '@/src/components/client/ClientHeroInteractions';
import StructuredDataEnhancer from '@/src/components/seo/StructuredDataEnhancer';
import { 
  generateBreadcrumbsForRoute, 
  getProductDataForRoute, 
  getReviewDataForRoute
} from '@/src/utils/seoHelpers';
import StaticFusionGuide from '@/src/components/server/StaticFusionGuide';
import { themes } from '@/src/config/themes';
import StaticWhyChoose from '@/src/components/server/StaticWhyChoose';
import StaticOfferMore from '@/src/components/server/StaticOfferMore';
import HowDifferent from '@/src/components/server/HowDifferent';
import OutfitGeneratorFeatureModule from '@/src/components/server/OutfitGeneratorFeatureModule';

export const metadata: Metadata = {
  metadataBase: new URL('https://creamoda.ai'),
  title: 'AI Fashion Agent | Creamoda - Turn Creative Concepts into Complete Fashion Designs',
  description: 'Experience the power of AI Fashion Agent. Transform your creative ideas into complete fashion designs with our intelligent AI assistant. Generate inspiration, covers, patterns, and complete fashion pieces.',
  keywords: 'AI fashion agent, fashion design AI, creative fashion concepts, AI fashion assistant, fashion design generator, AI fashion creativity',
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
    url: 'https://creamoda.ai/fashion-agent',
    siteName: 'Creamoda AI',
    title: 'AI Fashion Agent | Creamoda - Turn Creative Concepts into Complete Fashion Designs',
    description: 'Experience the power of AI Fashion Agent. Transform your creative ideas into complete fashion designs with our intelligent AI assistant.',
    images: [
      {
        url: '/images/og-fashion-agent.jpg',
        width: 1200,
        height: 630,
        alt: 'Creamoda AI Fashion Agent',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@CreamodaAI',
    creator: '@CreamodaAI',
    title: 'AI Fashion Agent | Creamoda - Turn Creative Concepts into Complete Fashion Designs',
    description: 'Experience the power of AI Fashion Agent. Transform your creative ideas into complete fashion designs with our intelligent AI assistant.',
    images: ['/images/og-fashion-agent.jpg'],
  },
  other: {
    'theme-color': '#000000',
  },

  alternates: {
    canonical: 'https://creamoda.ai/fashion-agent',
  },
};

export default function FashionAgentPage() {
  const saasUrl = 'https://creamoda.ai/fashion-design/create';
  
  // 使用适合的主题配置
  const theme = themes.agent_page || themes.design_page || themes[Object.keys(themes)[0]];
  
  // 获取SEO增强数据
  const breadcrumbs = generateBreadcrumbsForRoute('fashion-agent');
  const productData = getProductDataForRoute('fashion-agent');
  const reviewData = getReviewDataForRoute('fashion-agent');

  return (
    <div className="min-h-screen">
      {/* 增强版结构化数据 */}
      <StructuredDataEnhancer
        pageType="product"
        breadcrumbs={breadcrumbs}
        productData={productData}
        reviewData={reviewData}
        currentUrl="/fashion-agent"
      />
      
      {/* AgentHero 作为全屏背景 */}
      <div className="relative -mt-20 pt-20">
        <AgentHero />
        
        {/* 导航栏覆盖在背景之上 */}
        <div className="absolute top-0 left-0 right-0 z-30">
          <StaticNavigation currentSaasUrl={saasUrl} />
        </div>
      </div>
      
      {/* 下拉菜单容器 - 绝对定位，不占据空间 */}
      <div className="dropdown-container"></div>
      
      {/* 客户端交互增强 */}
      <ClientHeroInteractions currentSaasUrl={saasUrl} />
      <StaticFusionGuide theme={theme} />
      <StaticWhyChoose theme={theme} />
      <HowDifferent />
      <StaticOfferMore  />
      <OutfitGeneratorFeatureModule theme={theme} />
      
      {/* Footer组件 */}
      <StaticFooter />
    </div>
  );
}
