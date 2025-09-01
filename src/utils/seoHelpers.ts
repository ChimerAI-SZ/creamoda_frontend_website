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
      description: 'Instantly cut out subjects and get a clean, transparent PNG in seconds.',
      sku: 'image-background-remover',
      category: 'ImageEditingApplication',
      operatingSystem: 'Web',
      softwareVersion: '1.0',
      image: '/marketing/images/hero/background_remover/remove_backgrounds.png',
    },
    'image-background-changer': {
      name: 'Image Background Changer',
      description: 'Replace any background in seconds—no skills needed.',
      sku: 'image-background-changer',
      category: 'ImageEditingApplication',
      operatingSystem: 'Web',
      softwareVersion: '1.0',
      image: '/marketing/images/hero/background_changer/change_backgrounds.png',
    },
    'image-enhancer': {
      name: 'Image Enhancer',
      description: 'Boost image resolution up to 2× without losing sharpness or detail.',
      sku: 'image-enhancer',
      category: 'ImageEditingApplication',
      operatingSystem: 'Web',
      softwareVersion: '1.0',
      image: '/marketing/images/hero/enhance/enhance.png',
    },
    'image-changer': {
      name: 'AI Image Changer',
      description: 'Edit or replace only the areas you select, keeping the rest untouched.',
      sku: 'image-changer',
      category: 'ImageEditingApplication',
      operatingSystem: 'Web',
      softwareVersion: '1.0',
      image: '/marketing/images/hero/changer/changer.png',
    },
    'image-color-changer': {
      name: 'Image Color Changer',
      description: 'Instantly swap product or object colors with realistic results.',
      sku: 'image-color-changer',
      category: 'ImageEditingApplication',
      operatingSystem: 'Web',
      softwareVersion: '1.0',
      image: '/marketing/images/hero/color_changer/color_changer.png',
    },
    'virtual-try-on': {
      name: 'AI Virtual Try-On',
      description: 'Generate lifelike model images wearing your products, cutting shoot costs and boosting sales.',
      sku: 'virtual-try-on',
      category: 'ImageEditingApplication',
      operatingSystem: 'Web',
      softwareVersion: '1.0',
      image: '/marketing/images/hero/virtual_try/virtuals_trye.png',
    },
    'outfit-generator': {
      name: 'AI Outfit Generator',
      description: 'Generate and customize fashion outfits — swap fabrics, tweak styles, redesign patterns, all in one tool.',
      sku: 'text-to-design',
      category: 'ImageEditingApplication',
      operatingSystem: 'Web',
      softwareVersion: '1.0',
      image: '/marketing/images/hero/outfit_generator/outfit_generatorss.png',
    },
    'sketch-to-image': {
      name: 'AI Sketch to Image Converter',
      description: 'Turn garment sketches into realistic images for prototyping and presentations.',
      sku: 'sketch-to-design',
      category: 'ImageEditingApplication',
      operatingSystem: 'Web',
      softwareVersion: '1.0',
      image: '/marketing/images/hero/sketch_convert/sketch_convert.png',
    },
    'free-nano-banana': {
      name: 'Free Nano-Banana Generator',
      description: 'Discover Free Nano-Banana, Google\'s Gemini 2.5 Flash Image, and see how it inspires fashion design and creative image generation.',
      sku: 'text-to-design',
      category: 'ImageEditingApplication',
      operatingSystem: 'Web',
      softwareVersion: '1.0',
      image: '/marketing/images/hero/banana/banana.png',
    }
  };

  return productDataMap[route] || null;
}

// 根据路由获取评价数据
export function getReviewDataForRoute(route: string) {
  const reviewDataMap: Record<string, any> = {
    'image-background-remover': { ratingValue: '4.9', reviewCount: '2680' },
    'image-background-changer': { ratingValue: '4.7', reviewCount: '3890' },
    'image-color-changer': { ratingValue: '4.5', reviewCount: '3228' },
    'outfit-generator': { ratingValue: '4.8', reviewCount: '8769' },
    'image-changer': { ratingValue: '4.8', reviewCount: '6777' },
    'sketch-to-image': { ratingValue: '4.9', reviewCount: '5378' },
    'image-enhancer': { ratingValue: '4.6', reviewCount: '5328' },
    'virtual-try-on': { ratingValue: '4.6', reviewCount: '4586' },
    'free-nano-banana': { ratingValue: '4.5', reviewCount: '2699' },
  };

  return reviewDataMap[route] || null;
}
