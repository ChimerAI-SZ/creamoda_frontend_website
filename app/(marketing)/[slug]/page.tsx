import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { getAllRoutes } from '@/src/config/routes';
import { getThemeForRoute, getSaasUrlForRoute } from '@/src/utils/themeRenderer';
import StaticHero from '@/src/components/server/StaticHero';
import DesignHero from '@/src/components/server/DesignHero';
import ThemeContent from '@/src/components/server/ThemeContent';
import StaticFAQ from '@/src/components/server/StaticFAQ';
import StaticFooter from '@/src/components/server/StaticFooter';
import StructuredDataEnhancer from '@/src/components/seo/StructuredDataEnhancer';
import DesignFilterSection from '@/src/components/server/DesignFilterSection';
import DesignStepsModule from '@/src/components/server/DesignStepsModule';
import DesignAboutModule from '@/src/components/server/DesignAboutModule';

import { 
  generateBreadcrumbsForRoute, 
  getProductDataForRoute, 
  getReviewDataForRoute
} from '@/src/utils/seoHelpers';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// 为每个功能页面定制的 meta 信息
const pageMetaConfig: Record<string, {
  title: string;
  description: string;
  keywords: string;
  ogImage?: string;
}> = {
  'image-background-remover': {
    title: 'Image Background Remover | Professional Quality | Creamoda',
    description: 'Use AI to immediately delete the image background. 100% automatic, simple, and fast, very suitable for e-commerce, design, and social media. Try it now!',
    keywords: 'free background remover, AI background removal, professional photo editing, credit-based image tool, e-commerce photo editor, high-quality background removal'
  },
  'image-background-changer': {
    title: 'Image Background Changer | Customize Your Image Background Instantly | Creamoda',
    description: 'Use AI to change the background of your images, support inputting reference images or selecting design features, and you can also use language to describe the final generated image you want - no need for manual editing!',
    keywords: 'AI background replacement, remove and change background, AI design tool, background changer, credit-based image tool, high-quality background editing',
  },
  'image-enhancer': {
    title: 'AI Image Enhancer | Enlarge & Enhance Photos Without Losing Quality | Creamoda',
    description: 'Instantly upscale images with AI-powered precision. Perfect for low-res photos, old scans, or any unclear images—get sharper details, reduced noise, and natural textures in seconds. No design skills needed!',
    keywords: 'Image upscaler, AI image enhancer, high-resolution converter, enlarge image without blur, restore old photos, HD image quality, credit-based upscaling tool',
  },
  'image-changer': {
    title: 'AI Image Changer | AI-Powered Selective Image Editor | Creamoda',
    description: 'Modify specific areas of any image with AI - change colors, textures, or objects while keeping the rest perfectly intact.',
    keywords: 'selective editing, AI image changer, object replacement, image tweaking, non-destructive editing'
  },
  'image-color-changer': {
    title: 'AI Color Changer | Instantly Swap Colors in Any Image | Creamoda',
    description: 'Modify specific colors with perfect accuracy using AI. Ideal for product photos, designs, and fashion - get natural-looking results in one click.',
    keywords: 'color replacement, AI recolor tool, product photo editor, garment color changer, precise color adjustment, AI Color Changer'
  },
  'virtual-try-on': {
    title: 'AI Virtual Try-On Tool | AI-Powered Online Fitting Room | Creamoda',
    description: 'Instantly see how clothes fit with our AI-powered virtual try-on technology. Upload your image to try any outfit digitally - no physical change needed! Supports trying on your own clothes or preset garments, with realistic pose adjustments for perfect fit visualization.',
    keywords: 'AI clothing try-on, virtual fitting room, online outfit simulator, fashion tech, 3D garment visualization, AI fashion assistant, body measurement scanning, AI pose adjustment, virtual posing tool',
  },
  'outfit-generator': {
    title: 'AI Image Generator | Text-to-Image & Image-to-Image Creation Tool | Creamoda',
    description: 'Create stunning AI-generated images from text prompts or transform existing photos with our powerful AI image generator. Perfect for designers, marketers & content creators - generate unique visuals, enhance photos, or reimagine existing images in seconds. No design skills needed!',
    keywords: 'AI image generator, text to image AI, image to image AI, AI art generator, AI photo generator, free AI image creator, AI for social media, e-commerce image generator, AI design tool, virtual try-on AI, high-quality AI images, fast AI art generator, AI image enhancer, Image Background Remover, copyright-free AI images online, AI photo to cartoon, AI model generator, custom AI artwork, professional AI art tool',
  },
  'sketch-to-image': {
    title: 'AI Sketch Converter | Turn Drawings into Professional Design | Creamoda',
    description: 'Instantly transform your hand-drawn sketches into polished designs with AI. Perfect for fashion, product design, and concept art. No manual tracing needed!',
    keywords: 'sketch to image AI, drawing to digital converter, fashion design tool, AI design assistant, concept art generator'
  },
  'free-nano-banana': {
    title: "Free Nano-Banana Generator | Explore Google's Trending Model for Image Editing",
    description: "Discover Free Nano-Banana, Google's Gemini 2.5 Flash Image, and see how it inspires fashion design and creative image generation. Try it with Creamoda's design tools to explore new possibilities.",
    keywords: 'Free Nano-Banana, Google AI model, Nano Banana AI, AI fashion design, AI outfit generator, virtual try-on, AI image generator'
  },
  'design': {
    title: 'Design Hub | AI-Powered Design Tools | Creamoda',
    description: 'Explore our comprehensive suite of AI-powered design tools. From outfit generation to image editing, create stunning fashion designs with professional-grade AI technology.',
    keywords: 'AI design tools, fashion design platform, AI outfit generator, virtual try-on, design hub, creative tools, AI fashion design, digital design platform'
  }
};

// 动态生成元数据
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  // 检查路由是否有效
  const validRoutes = getAllRoutes();
  if (!validRoutes.includes(slug)) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    };
  }

  // 获取自定义 meta 配置
  const metaConfig = pageMetaConfig[slug];
  if (!metaConfig) {
    // 如果没有自定义配置，使用主题配置作为后备
    const theme = getThemeForRoute(slug);
    
    return {
      title: `${theme.heroMain.title} - Creamoda AI Tools`,
      description: theme.heroMain.subtitle,
      keywords: `AI, ${theme.name}, 图像处理, 人工智能, 在线工具`,
    };
  }

  return {
    metadataBase: new URL('https://creamoda.ai'),
    title: metaConfig.title,
    description: metaConfig.description,
    keywords: metaConfig.keywords,
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
      url: `https://creamoda.ai/${slug}`,
      title: metaConfig.title,
      description: metaConfig.description,
      siteName: 'Creamoda AI Tools',
      images: [
        {
          url: metaConfig.ogImage || '/marketing/images/card/removes_bg.png',
          width: 1200,
          height: 630,
          alt: metaConfig.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaConfig.title,
      description: metaConfig.description,
      images: [metaConfig.ogImage || '/marketing/images/card/removes_bg.png'],
      creator: '@creamoda_ai',
      site: '@creamoda_ai',
    },
    alternates: {
      canonical: `https://creamoda.ai/${slug}`,
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
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  
  // 检查路由是否有效
  const validRoutes = getAllRoutes();
  if (!validRoutes.includes(slug)) {
    notFound();
  }

  // 获取对应的主题和SaaS URL
  const theme = getThemeForRoute(slug);
  const saasUrl = getSaasUrlForRoute(slug);

  // Schema结构化数据现在通过 StructuredDataEnhancer 组件和 seoHelpers.ts 统一管理

  // 获取SEO增强数据
  const breadcrumbs = generateBreadcrumbsForRoute(slug);
  const productData = getProductDataForRoute(slug);
  const reviewData = getReviewDataForRoute(slug);

  return (
    <div className="min-h-screen">
      {/* 增强版结构化数据 */}
      <StructuredDataEnhancer
        pageType="product"
        breadcrumbs={breadcrumbs}
        productData={productData}
        reviewData={reviewData}
        currentUrl={`/${slug}`}
      />
      
      {/* Hero组件 - 设计页面使用专门的DesignHero */}
      {slug === 'design' ? (
        <DesignHero saasUrl={saasUrl} />
      ) : (
        <StaticHero theme={theme} saasUrl={saasUrl} isHomepage={false} />
      )}
      
      {/* 主题内容组件 */}
      <ThemeContent theme={theme} currentRoute={slug} />
      
      {/* FAQ组件 */}
      <StaticFAQ faqData={theme.faq} />
      
      {/* Footer组件 */}
      <StaticFooter />
    </div>
  );
}

// 生成静态路径（可选，用于提高性能）
export async function generateStaticParams() {
  const routes = getAllRoutes();
  
  return routes.map((slug) => ({
    slug,
  }));
} 