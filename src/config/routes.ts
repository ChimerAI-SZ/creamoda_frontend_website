// 路由路径到主题ID的映射
export const routeToThemeMap: Record<string, string> = {
  'image-background-remover': 'background_remove',
  'image-background-changer': 'background_change',
  'image-enhancer': 'image_enhance',
  'image-changer': 'partial_modify',
  'image-color-changer': 'color_change',
  'virtual-try-on': 'virtual_try',
  'outfit-generator': 'outfit_generator',
  'sketch-to-image': 'sketch_convert',
  'free-nano-banana': 'free_nano_banana'
};

// 主题ID到路由路径的映射（反向映射）
export const themeToRouteMap: Record<string, string> = {
  'background_remove': 'image-background-remover',
  'background_change': 'image-background-changer',
  'image_enhance': 'image-enhancer',
  'partial_modify': 'image-changer',
  'color_change': 'image-color-changer',
  'virtual_try': 'virtual-try-on',
  'outfit_generator': 'outfit-generator',
  'sketch_convert': 'sketch-to-image',
  'free_nano_banana': 'free-nano-banana'
};

// 获取主题ID by 路由路径
export function getThemeByRoute(route: string): string {
  return routeToThemeMap[route] || 'background_remove';
}

// 获取路由路径 by 主题ID
export function getRouteByTheme(themeId: string): string {
  return themeToRouteMap[themeId] || 'image-background-remover';
}

// 路由到SaaS URL的映射
export const routeToSaasUrlMap: Record<string, string> = {
  'image-background-remover': 'https://www.creamoda.ai/magic-kit/create',
  'image-background-changer': 'https://www.creamoda.ai/magic-kit/create', 
  'image-enhancer': 'https://www.creamoda.ai/magic-kit/create',
  'image-changer': 'https://www.creamoda.ai/magic-kit/create',
  'image-color-changer': 'https://www.creamoda.ai/magic-kit/create',
  'virtual-try-on': 'https://www.creamoda.ai/virtual-try-on/create',
  'outfit-generator': 'https://www.creamoda.ai/fashion-design/create',
  'sketch-to-image': 'https://www.creamoda.ai/fashion-design/create',
  'free-nano-banana': 'https://www.creamoda.ai/magic-kit/create'
};

// 根据路由获取SaaS URL
export function getSaasUrlByRoute(route: string): string {
  return routeToSaasUrlMap[route] || 'https://www.creamoda.ai/fashion-design/create';
}

// 获取所有可用路由
export function getAllRoutes(): string[] {
  return Object.keys(routeToThemeMap);
} 