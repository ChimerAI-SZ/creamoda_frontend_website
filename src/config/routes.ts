// 路由路径到主题ID的映射
export const routeToThemeMap: Record<string, string> = {
  'image-background-remover': 'background_remove',
  'image-background-changer': 'background_change',
  'image-enhancer': 'image_enhance',
  'image-changer': 'partial_modify',
  'image-color-changer': 'color_change',
  'virtual-try-on': 'virtual_try',
  'outfit-generator': 'outfit_generator',
  'sketch-to-image': 'sketch_convert'
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
  'sketch_convert': 'sketch-to-image'
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
  'image-background-remover': 'https://create.creamoda.ai/magic-kit',
  'image-background-changer': 'https://create.creamoda.ai/magic-kit',
  'image-enhancer': 'https://create.creamoda.ai/magic-kit',
  'image-changer': 'https://create.creamoda.ai/magic-kit',
  'image-color-changer': 'https://create.creamoda.ai/magic-kit',
  'virtual-try-on': 'https://create.creamoda.ai/virtual-try-on',
  'outfit-generator': 'https://create.creamoda.ai/',
  'sketch-to-image': 'https://create.creamoda.ai/'
};

// 根据路由获取SaaS URL
export function getSaasUrlByRoute(route: string): string {
  return routeToSaasUrlMap[route] || 'https://create.creamoda.ai/magic-kit';
}

// 获取所有可用路由
export function getAllRoutes(): string[] {
  return Object.keys(routeToThemeMap);
} 