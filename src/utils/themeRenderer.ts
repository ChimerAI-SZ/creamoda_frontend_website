import { getTheme } from '../config/themes';
import { getSaasUrlByRoute } from '../config/routes';
import type { ThemeConfig } from '../types/theme';

/**
 * 服务端主题渲染工具函数
 */

/**
 * 根据路由获取主题配置（服务端安全）
 */
export function getThemeForRoute(slug: string): ThemeConfig {
  // 路由到主题ID的映射
  const routeToThemeMap: Record<string, string> = {
    'image-background-remover': 'background_remove',
    'image-background-changer': 'background_change', 
    'image-enhancer': 'image_enhance',
    'image-changer': 'partial_modify',
    'image-color-changer': 'color_change',
    'virtual-try-on': 'virtual_try',
    'outfit-generator': 'outfit_generator',
    'sketch-to-image': 'sketch_convert',
    'free-nano-banana': 'free_nano_banana',
    'design': 'design_page',
  };

  const themeId = routeToThemeMap[slug] || 'background_remove';
  return getTheme(themeId);
}

/**
 * 获取路由对应的SaaS URL（服务端安全）
 */
export function getSaasUrlForRoute(slug: string): string {
  return getSaasUrlByRoute(slug);
}

/**
 * 获取主题的SEO优化内容
 */
export function getThemeSEOContent(theme: ThemeConfig) {
  return {
    title: theme.heroMain.title,
    subtitle: theme.heroMain.subtitle,
    uploadText: theme.heroMain.uploadText,
    uploadSubText: theme.heroMain.uploadSubText,
    demoImages: theme.heroMain.demoImages,
    
    // 结构化的内容用于SEO
    features: {
      fusionGuide: theme.fusionGuide,
      whyChoose: theme.whyChoose,
      offerMore: theme.offerMore,
      faq: theme.faq
    }
  };
}

/**
 * 检查是否为首页
 */
export function isHomepageRoute(pathname: string): boolean {
  return pathname === '/' || pathname === '';
}

/**
 * 生成面包屑导航数据
 */
export function generateBreadcrumbs(slug: string, theme: ThemeConfig) {
  return [
    { name: 'Home', url: '/' },
    { name: theme.heroMain.title, url: `/${slug}`, current: true }
  ];
}
