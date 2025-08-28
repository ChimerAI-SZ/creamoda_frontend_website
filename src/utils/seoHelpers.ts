// SEO辅助函数集合

export interface BreadcrumbItem {
  name: string;
  url: string;
  isActive?: boolean;
}

// 根据路由生成面包屑导航数据
export function generateBreadcrumbsForRoute(route: string): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Home', url: '/' }
  ];

  const routeMapping: Record<string, string> = {
    'image-background-remover': 'Background Remover',
    'image-background-changer': 'Background Changer',
    'image-enhancer': 'Image Enhancer',
    'image-changer': 'AI Image Changer',
    'image-color-changer': 'Color Changer',
    'virtual-try-on': 'Virtual Try-On',
    'outfit-generator': 'Outfit Generator',
    'sketch-to-image': 'Sketch to Image'
  };

  if (route && routeMapping[route]) {
    breadcrumbs.push({
      name: routeMapping[route],
      url: `/${route}`,
      isActive: true
    });
  }

  return breadcrumbs;
}

// 根据路由获取产品数据
export function getProductDataForRoute(route: string) {
  const productDataMap: Record<string, any> = {
    'image-background-remover': {
      name: 'Image Background Remover',
      description: 'Instantly cut out subjects and get a clean, transparent PNG in seconds. Professional quality background removal powered by AI.',
      sku: 'AI-BGR-001',
      category: 'AI Image Tools',
      images: ['/marketing/images/card/removes_bg.png'],
    },
    'image-background-changer': {
      name: 'Image Background Changer',
      description: 'Replace any background with custom colors, images, or scenes. AI-powered background replacement made simple.',
      sku: 'AI-BGC-001',
      category: 'AI Image Tools',
      images: ['/marketing/images/card/changes_bg.png'],
    },
    'image-enhancer': {
      name: 'AI Image Enhancer',
      description: 'Boost image resolution up to 2x without losing sharpness or detail. Transform blurry photos into crystal clear images.',
      sku: 'AI-ENH-001',
      category: 'AI Image Tools',
      images: ['/marketing/images/card/upscaless.png'],
    },
    'image-changer': {
      name: 'AI Image Changer',
      description: 'Edit or replace only the areas you select, keeping the rest untouched. Precise AI-powered selective editing.',
      sku: 'AI-CHG-001',
      category: 'AI Image Tools',
      images: ['/marketing/images/card/partial_mod.png'],
    },
    'image-color-changer': {
      name: 'AI Color Changer',
      description: 'Instantly swap product or object colors with realistic results. Perfect for fashion and product photography.',
      sku: 'AI-COL-001',
      category: 'AI Image Tools',
      images: ['/marketing/images/card/change_colors.png'],
    },
    'virtual-try-on': {
      name: 'AI Virtual Try-On',
      description: 'Generate lifelike model images wearing your products, cutting shoot costs and boosting sales.',
      sku: 'AI-VTO-001',
      category: 'AI Fashion Tools',
      images: ['/marketing/images/card/virtual_try.png'],
    },
    'outfit-generator': {
      name: 'AI Outfit Generator',
      description: 'Generate and customize fashion outfits — swap fabrics, tweak styles, redesign patterns, all in one tool.',
      sku: 'AI-OFG-001',
      category: 'AI Fashion Tools',
      images: ['/marketing/images/card/designs.png'],
    },
    'sketch-to-image': {
      name: 'AI Sketch to Image Converter',
      description: 'Turn garment sketches into realistic images for prototyping and presentations.',
      sku: 'AI-STI-001',
      category: 'AI Fashion Tools',
      images: ['/marketing/images/card/sketch_design.png'],
    }
  };

  return productDataMap[route] || null;
}

// 根据路由获取评价数据
export function getReviewDataForRoute(route: string) {
  const reviewDataMap: Record<string, any> = {
    'image-background-remover': { ratingValue: '4.8', reviewCount: '247' },
    'image-background-changer': { ratingValue: '4.7', reviewCount: '189' },
    'image-color-changer': { ratingValue: '4.6', reviewCount: '134' },
    'outfit-generator': { ratingValue: '4.8', reviewCount: '173' },
    'image-changer': { ratingValue: '4.7', reviewCount: '156' },
    'sketch-to-image': { ratingValue: '4.7', reviewCount: '98' },
    'image-enhancer': { ratingValue: '4.9', reviewCount: '321' },
    'virtual-try-on': { ratingValue: '4.9', reviewCount: '284' },
  };

  return reviewDataMap[route] || null;
}

// 生成优化的图片alt属性
export function generateImageAlt(imagePath: string, context: string): string {
  const filename = imagePath.split('/').pop()?.split('.')[0] || '';
  
  const altMapping: Record<string, string> = {
    'removes_bg': 'AI background removal tool demonstration showing before and after results',
    'changes_bg': 'Image Background Changer tool showing various background replacement options',
    'upscaless': 'AI image enhancer improving image resolution and clarity',
    'partial_mod': 'AI image editor for selective area modification and enhancement',
    'change_colors': 'AI color changer tool demonstrating product color variations',
    'virtual_try': 'AI virtual try-on technology showing clothing on different models',
    'designs': 'AI outfit generator creating custom fashion designs and patterns',
    'sketch_design': 'AI sketch to image converter transforming drawings into realistic garments'
  };

  return altMapping[filename] || `${context} - Creamoda AI tool demonstration`;
}

// 生成页面级别的关键词
export function generateKeywords(route: string): string[] {
  const baseKeywords = ['AI fashion tools', 'creamoda ai', 'fashion design', 'AI image editing'];

  const routeKeywords: Record<string, string[]> = {
    'image-background-remover': ['background remover', 'remove background', 'transparent PNG', 'photo cutout'],
    'image-background-changer': ['background changer', 'replace background', 'background replacement', 'photo editing'],
    'image-enhancer': ['image enhancer', 'upscale image', 'improve image quality', 'AI enhancement'],
    'image-changer': ['image editor', 'partial modification', 'selective editing', 'AI photo editor'],
    'image-color-changer': ['color changer', 'recolor products', 'change object colors', 'color replacement'],
    'virtual-try-on': ['virtual try-on', 'AI model', 'fashion photography', 'product modeling'],
    'outfit-generator': ['outfit generator', 'fashion design', 'AI clothing design', 'style creation'],
    'sketch-to-image': ['sketch to image', 'design converter', 'fashion sketches', 'garment visualization']
  };

  return [...baseKeywords, ...(routeKeywords[route] || [])];
}
