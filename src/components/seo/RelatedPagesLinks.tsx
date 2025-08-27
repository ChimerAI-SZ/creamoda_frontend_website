import Link from 'next/link';
import Image from 'next/image';

interface RelatedPage {
  title: string;
  description: string;
  url: string;
  image: string;
  category: string;
}

interface RelatedPagesLinksProps {
  currentRoute: string;
  maxItems?: number;
  className?: string;
}

export default function RelatedPagesLinks({ 
  currentRoute, 
  maxItems = 4,
  className = ''
}: RelatedPagesLinksProps) {
  
  // 所有页面的配置
  const allPages: RelatedPage[] = [
    {
      title: 'AI Background Remover',
      description: 'Remove backgrounds from images instantly with AI',
      url: '/image-background-remover',
      image: '/marketing/images/card/removes_bg.png',
      category: 'Image Tools'
    },
    {
      title: 'AI Background Changer',
      description: 'Change image backgrounds with AI precision',
      url: '/image-background-changer', 
      image: '/marketing/images/card/changes_bg.png',
      category: 'Image Tools'
    },
    {
      title: 'AI Image Enhancer',
      description: 'Upscale and enhance image quality with AI',
      url: '/image-enhancer',
      image: '/marketing/images/card/upscaless.png',
      category: 'Image Tools'
    },
    {
      title: 'AI Image Changer',
      description: 'Edit specific areas of your images with AI',
      url: '/image-changer',
      image: '/marketing/images/card/partial_mod.png',
      category: 'Image Tools'
    },
    {
      title: 'AI Color Changer',
      description: 'Change object colors in images with AI',
      url: '/image-color-changer',
      image: '/marketing/images/card/change_colors.png',
      category: 'Image Tools'
    },
    {
      title: 'AI Virtual Try-On',
      description: 'Try on clothes virtually with AI models',
      url: '/virtual-try-on',
      image: '/marketing/images/card/virtual_try.png',
      category: 'Fashion Tools'
    },
    {
      title: 'AI Outfit Generator', 
      description: 'Generate fashion outfits with AI creativity',
      url: '/outfit-generator',
      image: '/marketing/images/card/designs.png',
      category: 'Fashion Tools'
    },
    {
      title: 'AI Sketch to Image',
      description: 'Convert sketches to realistic images with AI',
      url: '/sketch-to-image',
      image: '/marketing/images/card/sketch_design.png',
      category: 'Fashion Tools'
    }
  ];

  // 获取当前页面信息
  const currentPage = allPages.find(page => page.url === `/${currentRoute}`);
  const currentCategory = currentPage?.category || '';

  // 智能推荐算法：优先推荐同类别的页面
  const getRelatedPages = (): RelatedPage[] => {
    const otherPages = allPages.filter(page => page.url !== `/${currentRoute}`);
    
    // 同类别页面
    const sameCategoryPages = otherPages.filter(page => 
      page.category === currentCategory
    );
    
    // 不同类别页面
    const differentCategoryPages = otherPages.filter(page => 
      page.category !== currentCategory
    );

    // 先取同类别页面，不足的话补充其他类别页面
    const relatedPages = [
      ...sameCategoryPages.slice(0, Math.min(maxItems - 1, sameCategoryPages.length)),
      ...differentCategoryPages.slice(0, Math.max(0, maxItems - sameCategoryPages.length))
    ];

    return relatedPages.slice(0, maxItems);
  };

  const relatedPages = getRelatedPages();

  if (relatedPages.length === 0) {
    return null;
  }

  return (
    <section className={`related-pages-section ${className}`}>
      <div className="container mx-auto px-4">
        <h2 className="related-pages-title text-2xl font-bold text-center mb-8">
          Explore More AI Tools
        </h2>
        
        <div className="related-pages-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedPages.map((page, index) => (
            <Link 
              key={page.url}
              href={page.url}
              className="related-page-card group block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="related-page-image-container p-4">
                <Image
                  src={page.image}
                  alt={page.title}
                  width={240}
                  height={180}
                  className="w-full h-32 object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="related-page-content p-4 pt-0">
                <span className="related-page-category text-xs text-gray-500 uppercase tracking-wide">
                  {page.category}
                </span>
                <h3 className="related-page-title text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                  {page.title}
                </h3>
                <p className="related-page-description text-sm text-gray-600 line-clamp-2">
                  {page.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
