import Script from 'next/script';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface ReviewData {
  ratingValue: string;
  reviewCount: string;
  bestRating?: string;
  worstRating?: string;
}

interface ProductData {
  name: string;
  description: string;
  sku: string;
  category?: string;
  brand?: string;
  images?: string[];
}

interface StructuredDataEnhancerProps {
  pageType: 'homepage' | 'product' | 'tool';
  breadcrumbs?: BreadcrumbItem[];
  productData?: ProductData;
  reviewData?: ReviewData;
  currentUrl?: string;
}

export default function StructuredDataEnhancer({
  pageType,
  breadcrumbs,
  productData,
  reviewData,
  currentUrl = ''
}: StructuredDataEnhancerProps) {
  
  // 生成面包屑导航结构化数据
  const generateBreadcrumbStructuredData = () => {
    if (!breadcrumbs || breadcrumbs.length === 0) return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': crumb.name,
        'item': `https://creamoda.ai${crumb.url}`
      }))
    };
  };

  // 生成产品结构化数据（增强版）
  const generateProductStructuredData = () => {
    if (!productData) return null;

    const baseProductData: any = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      'name': productData.name,
      'description': productData.description,
      'sku': productData.sku,
      'brand': {
        '@type': 'Brand',
        'name': productData.brand || 'Creamoda AI'
      },
      'category': productData.category || 'AI Tools',
      'url': `https://creamoda.ai${currentUrl}`,
      'offers': {
        '@type': 'Offer',
        'availability': 'https://schema.org/InStock',
        'price': '0',
        'priceCurrency': 'USD',
        'priceValidUntil': '2025-12-31',
        'seller': {
          '@type': 'Organization',
          'name': 'Creamoda AI'
        }
      }
    };

    // 添加图片数据（如果有）
    if (productData.images && productData.images.length > 0) {
      baseProductData.image = productData.images;
    }

    // 添加评价数据（如果有）
    if (reviewData) {
      baseProductData.aggregateRating = {
        '@type': 'AggregateRating',
        'ratingValue': reviewData.ratingValue,
        'reviewCount': reviewData.reviewCount,
        'bestRating': reviewData.bestRating || '5',
        'worstRating': reviewData.worstRating || '1'
      };
    }

    return baseProductData;
  };

  // 生成组织结构化数据
  const generateOrganizationStructuredData = () => {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': 'Creamoda AI',
      'description': 'AI-Powered Fashion Design Platform',
      'url': 'https://creamoda.ai',
      'logo': 'https://creamoda.ai/marketing/images/bottom_logo.png',
      'sameAs': [
        'https://youtube.com/@chimer-ai',
        'https://www.instagram.com/creamoda.ai/',
        'https://x.com/ai_creamoda',
        'https://www.tiktok.com/@creamoda.ai'
      ],
      'contactPoint': {
        '@type': 'ContactPoint',
        'contactType': 'customer service',
        'email': 'contact@creamoda.ai'
      }
    };
  };

  // 生成FAQ结构化数据
  const generateFAQStructuredData = (faqItems: Array<{question: string, answer: string}>) => {
    if (!faqItems || faqItems.length === 0) return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqItems.map(item => ({
        '@type': 'Question',
        'name': item.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': item.answer
        }
      }))
    };
  };

  // 生成软件应用结构化数据
  const generateSoftwareApplicationStructuredData = () => {
    return {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'Creamoda AI Tools',
      'description': 'Comprehensive AI-powered fashion design and image editing platform',
      'applicationCategory': 'DesignApplication',
      'operatingSystem': 'Web Browser',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD',
        'description': 'Free credits for new users'
      },
      'creator': {
        '@type': 'Organization',
        'name': 'Creamoda AI'
      },
      'featureList': [
        'AI Background Remover',
        'Virtual Try-On',
        'Outfit Generator',
        'Image Enhancer',
        'Sketch to Image Converter'
      ]
    };
  };

  const structuredDataArray = [];

  // 始终添加组织数据
  structuredDataArray.push(generateOrganizationStructuredData());

  // 根据页面类型添加相应的结构化数据
  if (pageType === 'homepage') {
    structuredDataArray.push(generateSoftwareApplicationStructuredData());
  }

  if (pageType === 'product' || pageType === 'tool') {
    const productStructuredData = generateProductStructuredData();
    if (productStructuredData) {
      structuredDataArray.push(productStructuredData);
    }
  }

  // 添加面包屑数据
  const breadcrumbStructuredData = generateBreadcrumbStructuredData();
  if (breadcrumbStructuredData) {
    structuredDataArray.push(breadcrumbStructuredData);
  }

  return (
    <>
      {structuredDataArray.map((data, index) => (
        <Script
          key={`structured-data-${index}`}
          id={`structured-data-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data, null, 2)
          }}
        />
      ))}
    </>
  );
}
