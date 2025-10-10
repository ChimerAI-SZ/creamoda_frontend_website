/**
 * 统一的路由跳转工具函数
 * 如果在iframe中，则跳转父窗口的URL；否则使用正常路由
 */

import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

/**
 * 检测是否在iframe中
 */
export function isInIframe(): boolean {
  try {
    return window.self !== window.top;
  } catch (e) {
    // 如果跨域访问被阻止，说明在iframe中
    return true;
  }
}

/**
 * 获取主域名URL
 * 根据当前环境返回对应的主域名
 */
export function getMainDomainUrl(): string {
  // 根据当前环境判断主域名
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    
    // 如果是本地开发环境
    if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
      return 'http://localhost:3000';
    }
    
    // 如果是测试环境（包括所有 test 相关的子域名）
    if (hostname.includes('test-mvp.creamoda.ai')) {
      return 'https://test-mvp.creamoda.ai';
    }
    
    if (hostname.includes('test-official.creamoda.ai')) {
      return 'https://test-official.creamoda.ai';
    }
    
    // 如果是其他 test 开头的域名
    if (hostname.startsWith('test') && hostname.includes('creamoda.ai')) {
      return `${protocol}//${hostname}`;
    }
    
    // 如果是vercel预览环境，根据域名判断
    if (hostname.includes('vercel.app')) {
      // 如果是test相关的vercel部署，使用当前域名
      if (hostname.includes('test')) {
        return `${protocol}//${hostname}`;
      }
      return 'https://creamoda.ai'; // 生产环境主域名
    }
    
    // 生产环境
    if (hostname.includes('creamoda.ai') && !hostname.includes('test')) {
      return 'https://creamoda.ai';
    }
    
    // 默认返回当前域名（兜底方案）
    return `${protocol}//${hostname}`;
  }
  
  return 'https://creamoda.ai';
}

/**
 * 智能路由跳转函数
 * @param route - 要跳转的路由路径（如：'image-background-remover'）
 * @param router - Next.js路由实例（可选，如果在iframe中不会使用）
 */
export function navigateToRoute(route: string, router?: AppRouterInstance): void {
  const targetPath = `/${route}`;
  console.log('Navigating to:', targetPath, 'isInIframe:', isInIframe());
  
  if (isInIframe()) {
    // 在iframe中，跳转父窗口
    const mainDomainUrl = getMainDomainUrl();
    const targetUrl = `${mainDomainUrl}${targetPath}`;
    console.log('iframe navigation to:', targetUrl);
    
    try {
      // 尝试直接修改父窗口location
      window.top!.location.href = targetUrl;
    } catch (e) {
      console.log('Cross-origin restriction, using postMessage');
      // 如果跨域限制，使用postMessage通知父窗口
      window.parent.postMessage(
        {
          type: 'NAVIGATE_TO_ROUTE',
          route: targetPath,
          url: targetUrl
        },
        '*'
      );
    }
  } else {
    // 不在iframe中，使用正常路由跳转
    console.log('Normal navigation');
    if (router) {
      router.push(targetPath);
    } else {
      window.location.href = targetPath;
    }
  }
}

/**
 * 处理导航链接点击事件
 * @param route - 要跳转的路由路径
 * @param router - Next.js路由实例
 * @param event - 点击事件（可选）
 */
export function handleNavigation(
  route: string, 
  router?: AppRouterInstance,
  event?: React.MouseEvent
): void {
  if (event) {
    event.preventDefault();
  }
  
  navigateToRoute(route, router);
}
