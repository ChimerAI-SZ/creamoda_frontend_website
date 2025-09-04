import { Metadata } from 'next';
import { Suspense } from 'react';
import DesignHero from '@/src/components/server/DesignHero';
import DesignFilterSection from '@/src/components/server/DesignFilterSection';
import DesignStepsModule from '@/src/components/server/DesignStepsModule';
import DesignAboutModule from '@/src/components/server/DesignAboutModule';
import StaticFAQ from '@/src/components/server/StaticFAQ';
import StaticFooter from '@/src/components/server/StaticFooter';
import StructuredDataEnhancer from '@/src/components/seo/StructuredDataEnhancer';
import { 
  generateBreadcrumbsForRoute, 
  getProductDataForRoute, 
  getReviewDataForRoute
} from '@/src/utils/seoHelpers';
import { getTheme } from '@/src/config/themes';

export const metadata: Metadata = {
  metadataBase: new URL('https://creamoda.ai'),
  title: 'AI Fashion Design Ideas | Inspire Your Next Collection | Creamoda',
  description: 'Find inspiration for your next collection with AI fashion design ideas, spanning casualwear, couture, and avant-garde styles — spark creativity and bring bold concepts to life.',
  keywords: 'AI fashion design, fashion inspiration, clothing design ideas, AI outfit generator, fashion collection, design trends, creative fashion, AI design tool',
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
    url: 'https://creamoda.ai/designs',
    title: 'AI Fashion Design Ideas | Inspire Your Next Collection | Creamoda',
    description: 'Find inspiration for your next collection with AI fashion design ideas, spanning casualwear, couture, and avant-garde styles — spark creativity and bring bold concepts to life.',
    siteName: 'Creamoda AI Tools',
    images: [
      {
        url: '/marketing/images/card/designs.png',
        width: 1200,
        height: 630,
        alt: 'AI Fashion Design Ideas',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Fashion Design Ideas | Inspire Your Next Collection | Creamoda',
    description: 'Find inspiration for your next collection with AI fashion design ideas, spanning casualwear, couture, and avant-garde styles — spark creativity and bring bold concepts to life.',
    images: ['/marketing/images/card/designs.png'],
    creator: '@creamoda_ai',
    site: '@creamoda_ai',
  },
  alternates: {
    canonical: 'https://creamoda.ai/designs',
  },
  other: {
    'application-name': 'Creamoda AI Tools',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Creamoda AI',
    'format-detection': 'telephone=no',
    'mobile-web-app-capable': 'yes',
    'msapplication-config': '/browserconfig.xml',
    'msapplication-TileColor': '#2B5797',
    'msapplication-tap-highlight': 'no',
    'theme-color': '#000000',
  },
};

export default function DesignsPage() {
  const saasUrl = 'https://www.creamoda.ai/fashion-design/create';
  
  // 获取主题数据
  const theme = getTheme('design_page');
  
  // 获取SEO增强数据
  const breadcrumbs = generateBreadcrumbsForRoute('designs');
  const productData = getProductDataForRoute('designs');
  const reviewData = getReviewDataForRoute('designs');

  return (
    <div className="min-h-screen">
      {/* 增强版结构化数据 */}
      <StructuredDataEnhancer
        pageType="product"
        breadcrumbs={breadcrumbs}
        productData={productData}
        reviewData={reviewData}
        currentUrl="/designs"
      />
      
      {/* Hero组件 - 设计页面使用专门的DesignHero */}
      <DesignHero saasUrl={saasUrl} />
      
      {/* 设计筛选和展示区域 */}
      <Suspense fallback={<div>Loading designs...</div>}>
        <DesignFilterSection />
      </Suspense>
      
      {/* 设计步骤模块 */}
      <DesignStepsModule />
      
      {/* 关于设计模块 */}
      <DesignAboutModule />
      
      {/* FAQ组件 */}
      <StaticFAQ faqData={theme.faq} />
      
      {/* Footer组件 */}
      <StaticFooter />
    </div>
  );
}
