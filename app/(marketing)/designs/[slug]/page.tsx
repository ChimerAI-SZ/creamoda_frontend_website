import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getFrontendImageDetail } from '@/lib/api/common';
import { FrontendImageItem } from '@/types/frontendImages';
import StaticNavigation from '@/src/components/server/StaticNavigation';
import StaticFooter from '@/src/components/server/StaticFooter';
import StructuredDataEnhancer from '@/src/components/seo/StructuredDataEnhancer';
import { getThemeForRoute } from '@/src/utils/themeRenderer';
import { 
  generateBreadcrumbsForRoute, 
  getProductDataForRoute, 
  getReviewDataForRoute
} from '@/src/utils/seoHelpers';
import DesignImageDetailPage from '@/src/components/server/DesignImageDetailPage';
import ClientHeroInteractions from '@/src/components/client/ClientHeroInteractions';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// 获取图片详情数据
async function getImageBySlug(slug: string): Promise<FrontendImageItem | null> {
  try {
    // 直接调用后端API，避免通过Next.js API路由 - 使用环境变量配置的后端地址
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/common/frontend/images/detail?slug=${encodeURIComponent(slug)}`;
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // 添加超时设置
      signal: AbortSignal.timeout(10000), // 10秒超时
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.code === 0 && data.data) {
      return data.data;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch image by slug:', error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const image = await getImageBySlug(slug);
  
  if (!image) {
    return {
      title: 'Image Not Found | Creamoda',
      description: 'The requested image could not be found.',
    };
  }

  const title = `${image.clothing_description} | AI Fashion Design | Creamoda`;
  const description = `Explore this stunning ${image.type} design for ${image.gender}. ${image.clothing_description} - Created with AI fashion design technology.`;

  return {
    metadataBase: new URL('https://creamoda.ai'),
    title,
    description,
    keywords: `AI fashion design, ${image.type}, ${image.gender}, ${image.feature}, fashion AI, outfit generator`,
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
      type: 'article',
      locale: 'en_US',
      url: `https://creamoda.ai/designs/${slug}`,
      title,
      description,
      siteName: 'Creamoda AI Tools',
      images: [
        {
          url: image.image_url,
          width: 800,
          height: 1200,
          alt: image.clothing_description,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image.image_url],
      creator: '@creamoda_ai',
      site: '@creamoda_ai',
    },
    alternates: {
      canonical: `https://creamoda.ai/designs/${slug}`,
    },
  };
}

export default async function DesignImagePage({ params }: PageProps) {
  const { slug } = await params;
  const image = await getImageBySlug(slug);
  
  if (!image) {
    notFound();
  }

  // 获取对应的主题
  const theme = getThemeForRoute('design');

  // 获取SEO增强数据
  const breadcrumbs = generateBreadcrumbsForRoute('design');
  const productData = getProductDataForRoute('design');
  const reviewData = getReviewDataForRoute('design');

  return (
    <div className="min-h-screen bg-black">
      {/* 增强版结构化数据 */}
      <StructuredDataEnhancer
        pageType="product"
        breadcrumbs={breadcrumbs}
        productData={productData}
        reviewData={reviewData}
        currentUrl={`/designs/${slug}`}
      />
      
      {/* 营销导航栏 */}
      <StaticNavigation currentSaasUrl="https://www.creamoda.ai/fashion-design/create" />
      
      {/* 下拉菜单容器 - 由客户端组件管理显示 */}
      <div className="dropdown-container"></div>
      
      {/* 主要内容区域 */}
      <main className="flex-1">
        <DesignImageDetailPage image={image} />
      </main>
      
      {/* 客户端交互增强 */}
      <ClientHeroInteractions currentSaasUrl="https://www.creamoda.ai/fashion-design/create" />
      
      {/* Footer */}
      <StaticFooter />
    </div>
  );
}

// 生成静态路径（可选，用于提高性能）
export async function generateStaticParams() {
  // 这里可以预生成一些热门图片的静态路径
  // 暂时返回空数组，让Next.js动态生成
  return [];
}
