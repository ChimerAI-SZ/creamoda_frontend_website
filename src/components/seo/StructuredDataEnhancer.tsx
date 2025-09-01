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
  operatingSystem?: string;
  softwareVersion?: string;
  image?: string;
  brand?: string;
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

  // 生成产品结构化数据（SoftwareApplication格式）
  const generateProductStructuredData = () => {
    if (!productData) return null;

    const baseProductData: any = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': productData.name,
      'image': productData.image,
      'description': productData.description,
      'operatingSystem': productData.operatingSystem || 'Web',
      'applicationCategory': productData.category || 'ImageEditingApplication',
      'softwareVersion': productData.softwareVersion || '1.0',
      'sku': productData.sku,
      'brand': {
        '@type': 'Brand',
        'name': 'Creamoda'
      },
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD',
        'availability': 'https://schema.org/InStock'
      }
    };

    // 添加评价数据（如果有）
    if (reviewData) {
      baseProductData.aggregateRating = {
        '@type': 'AggregateRating',
        'ratingValue': reviewData.ratingValue,
        'reviewCount': reviewData.reviewCount
      };
    }

    return baseProductData;
  };

  // 生成WebSite结构化数据（仅首页）
  const generateWebSiteStructuredData = () => {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'url': 'https://creamoda.ai/',
      'name': 'Creamoda | AI-Powered Fashion Design Platform',
      'description': 'Reimagine Fashion with All-in-One AI-powered Solution.',
      'publisher': {
        '@type': 'Organization',
        'name': 'Creamoda',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://creamoda.ai/_next/image?url=%2Fmarketing%2Fimages%2Flogo_light.png&w=256&q=75'
        }
      }
    };
  };





  const structuredDataArray = [];

  // 根据页面类型添加相应的结构化数据
  if (pageType === 'homepage') {
    structuredDataArray.push(generateWebSiteStructuredData());
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
