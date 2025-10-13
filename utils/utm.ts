/**
 * UTM 参数提取和管理工具
 */

import type { UTMParams, DeviceInfo, PageInfo } from '@/types/analytics';

/**
 * 从 URL 中提取 UTM 参数
 */
export function extractUTMParams(url?: string): UTMParams {
  if (typeof window === 'undefined') return {};
  
  const urlToUse = url || window.location.href;
  const searchParams = new URL(urlToUse).searchParams;
  
  return {
    utm_source: searchParams.get('utm_source') || undefined,
    utm_medium: searchParams.get('utm_medium') || undefined,
    utm_campaign: searchParams.get('utm_campaign') || undefined,
    utm_content: searchParams.get('utm_content') || undefined,
    utm_term: searchParams.get('utm_term') || undefined,
  };
}

/**
 * 从 URL 中提取 Click ID（gclid, fbclid）
 */
export function extractClickIds(url?: string): Partial<Pick<DeviceInfo, 'gclid' | 'fbclid'>> {
  if (typeof window === 'undefined') return {};
  
  const urlToUse = url || window.location.href;
  const searchParams = new URL(urlToUse).searchParams;
  
  return {
    gclid: searchParams.get('gclid') || undefined,
    fbclid: searchParams.get('fbclid') || undefined,
  };
}

/**
 * 保存 UTM 参数到 sessionStorage（页面加载时调用）
 */
export function saveUTMParams(url?: string): void {
  if (typeof window === 'undefined') return;
  
  const utmParams = extractUTMParams(url);
  const clickIds = extractClickIds(url);
  
  // 如果当前 URL 有 UTM 参数，保存到 sessionStorage
  if (Object.keys(utmParams).length > 0 || Object.keys(clickIds).length > 0) {
    const dataToSave = { ...utmParams, ...clickIds };
    sessionStorage.setItem('utm_params', JSON.stringify(dataToSave));
  }
}

/**
 * 从 sessionStorage 中获取保存的 UTM 参数
 */
export function getSavedUTMParams(): Partial<UTMParams & Pick<DeviceInfo, 'gclid' | 'fbclid'>> {
  if (typeof window === 'undefined') return {};
  
  try {
    const saved = sessionStorage.getItem('utm_params');
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

/**
 * 清除保存的 UTM 参数（登出时调用）
 */
export function clearSavedUTMParams(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem('utm_params');
}

/**
 * 获取设备类型
 */
export function getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
  if (typeof window === 'undefined') return 'desktop';
  
  const ua = navigator.userAgent.toLowerCase();
  
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  
  if (/mobile|iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(ua)) {
    return 'mobile';
  }
  
  return 'desktop';
}

/**
 * 获取国家代码（从浏览器语言推测）
 */
export function getCountryCode(): string {
  if (typeof window === 'undefined') return 'US';
  
  const language = navigator.language || 'en-US';
  const countryCode = language.split('-')[1] || 'US';
  
  return countryCode.toUpperCase();
}

/**
 * 获取设备信息
 */
export function getDeviceInfo(): DeviceInfo {
  const savedParams = getSavedUTMParams();
  
  return {
    device: getDeviceType(),
    country: getCountryCode(),
    gclid: savedParams.gclid,
    fbclid: savedParams.fbclid,
  };
}

/**
 * 获取页面信息
 */
export function getPageInfo(): PageInfo {
  if (typeof window === 'undefined') {
    return {
      page_url: '',
      page_title: '',
      timestamp: new Date().toISOString(),
    };
  }
  
  return {
    page_url: window.location.href,
    page_title: document.title,
    timestamp: new Date().toISOString(),
  };
}

/**
 * 获取完整的追踪上下文（UTM + 设备 + 页面）
 */
export function getTrackingContext(): UTMParams & DeviceInfo & PageInfo {
  return {
    ...getSavedUTMParams(),
    ...getDeviceInfo(),
    ...getPageInfo(),
  };
}

