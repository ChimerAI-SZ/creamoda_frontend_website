/**
 * Google Analytics 埋点工具库
 * 统一管理所有 GA4 事件追踪
 */

import type {
  PageViewParams,
  SignupClickParams,
  SignupSuccessParams,
  LoginClickParams,
  LoginSuccessParams,
  UploadImageParams,
  GenerateClickParams,
  GenerateResultParams,
  DownloadImageParams,
  PurchaseClickParams,
  PurchaseResultParams,
  GAEventName,
} from '@/types/analytics';
import { GA_EVENTS } from '@/types/analytics';
import { getTrackingContext, getSavedUTMParams, getDeviceInfo, getPageInfo } from '@/utils/utm';

// ============= 配置 =============

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const IS_BROWSER = typeof window !== 'undefined';
const GA_ENABLED = IS_BROWSER && process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// 是否在开发环境也发送数据（默认：仅生产环境发送）
const SEND_IN_DEV = process.env.NEXT_PUBLIC_GA_SEND_IN_DEV === 'true';

// 是否启用调试模式
const DEBUG_MODE = process.env.NEXT_PUBLIC_GA_DEBUG === 'true' || !IS_PRODUCTION;

// ============= 辅助函数 =============

/**
 * 发送事件到 GA4
 */
function sendEvent(eventName: GAEventName, params: Record<string, any>) {
  // 调试模式：打印事件信息
  if (DEBUG_MODE) {
    console.log(`[GA Event] ${eventName}`);
    console.log('Params:', params);
    console.log('Environment:', {
      production: IS_PRODUCTION,
      gaEnabled: GA_ENABLED,
      sendInDev: SEND_IN_DEV,
    });
  }

  // 检查是否应该发送事件
  const shouldSend = GA_ENABLED && (IS_PRODUCTION || SEND_IN_DEV);

  if (!shouldSend) {
    if (DEBUG_MODE) {
      console.log(`[GA] Event "${eventName}" not sent (dev mode)`);
    }
    return;
  }

  // 发送到 GA4
  if (IS_BROWSER && window.gtag) {
    window.gtag('event', eventName, params);
    if (DEBUG_MODE) {
      console.log(`[GA] Event "${eventName}" sent successfully`);
    }
  } else {
    console.warn('[GA] gtag not available');
  }
}

/**
 * 合并追踪上下文
 */
function mergeContext<T extends Record<string, any>>(params: T): T {
  const context = getTrackingContext();
  return { ...context, ...params };
}

/**
 * 设置用户 ID
 */
function setUserId(userId: string) {
  if (!IS_BROWSER || !window.gtag) return;

  window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '', {
    user_id: userId,
  });

  if (DEBUG_MODE) {
    console.log(`[GA] User ID set: ${userId}`);
  }
}

/**
 * 获取当前功能名称（根据路径）
 */
function getCurrentFeatureName(): string {
  if (!IS_BROWSER) return 'unknown';

  const path = window.location.pathname;
  
  if (path.includes('/fashion-design')) return 'fashion-design';
  if (path.includes('/virtual-try-on')) return 'virtual-try-on';
  if (path.includes('/magic-kit')) return 'magic-kit';
  
  return 'unknown';
}

// ============= 导出的埋点函数 =============

export const Analytics = {
  /**
   * 1. 页面浏览
   */
  trackPageView(customParams?: Partial<PageViewParams>) {
    const params = mergeContext<PageViewParams>({
      page_url: window.location.href,
      page_title: document.title,
      timestamp: new Date().toISOString(),
      ...customParams,
    });

    sendEvent(GA_EVENTS.PAGE_VIEW, params);
  },

  /**
   * 2. 注册按钮点击
   */
  trackSignupClick(buttonLocation?: string) {
    const params = mergeContext<SignupClickParams>({
      page_url: window.location.href,
      page_title: document.title,
      timestamp: new Date().toISOString(),
      button_location: buttonLocation,
    });

    sendEvent(GA_EVENTS.SIGNUP_CLICK, params);
  },

  /**
   * 3. 注册成功
   */
  trackSignupSuccess(userId: string, email: string, method: string = 'email') {
    // 设置用户 ID
    setUserId(userId);

    const params = mergeContext<SignupSuccessParams>({
      user_id: userId,
      email,
      method,
      page_url: window.location.href,
      page_title: document.title,
      timestamp: new Date().toISOString(),
    });

    sendEvent(GA_EVENTS.SIGNUP_SUCCESS, params);
  },

  /**
   * 4. 登录按钮点击
   */
  trackLoginClick(method: string, email?: string) {
    const params = mergeContext<LoginClickParams>({
      method,
      email,
      page_url: window.location.href,
      page_title: document.title,
      timestamp: new Date().toISOString(),
    });

    sendEvent(GA_EVENTS.LOGIN_CLICK, params);
  },

  /**
   * 5. 登录成功
   */
  trackLoginSuccess(userId: string, email: string, method: string) {
    // 设置用户 ID
    setUserId(userId);

    const params = mergeContext<LoginSuccessParams>({
      user_id: userId,
      email,
      method,
      page_url: window.location.href,
      page_title: document.title,
      timestamp: new Date().toISOString(),
    });

    sendEvent(GA_EVENTS.LOGIN_SUCCESS, params);
  },

  /**
   * 6. 上传图片
   */
  trackUploadImage(
    userId: string,
    featureName: string,
    status: 'success' | 'fail',
    options?: {
      fileType?: string;
      fileSize?: number;
      errorMessage?: string;
    }
  ) {
    const params: UploadImageParams = {
      user_id: userId,
      feature_name: featureName,
      status,
      file_type: options?.fileType,
      file_size: options?.fileSize,
      error_message: options?.errorMessage,
      page_url: window.location.href,
      page_title: document.title,
      timestamp: new Date().toISOString(),
    };

    sendEvent(GA_EVENTS.UPLOAD_IMAGE, params);
  },

  /**
   * 7. 生成按钮点击
   */
  trackGenerateClick(userId: string, featureName: string, requestId?: string) {
    const params: GenerateClickParams = {
      user_id: userId,
      feature_name: featureName,
      request_id: requestId,
      page_url: window.location.href,
      page_title: document.title,
      timestamp: new Date().toISOString(),
    };

    sendEvent(GA_EVENTS.GENERATE_CLICK, params);
  },

  /**
   * 8. 图片生成完成
   */
  trackGenerateResult(
    userId: string,
    featureName: string,
    status: 'success' | 'fail',
    options?: {
      requestId?: string;
      duration?: number;
      errorMessage?: string;
    }
  ) {
    const params: GenerateResultParams = {
      user_id: userId,
      feature_name: featureName,
      status,
      request_id: options?.requestId,
      duration: options?.duration,
      error_message: options?.errorMessage,
      page_url: window.location.href,
      page_title: document.title,
      timestamp: new Date().toISOString(),
    };

    sendEvent(GA_EVENTS.GENERATE_RESULT, params);
  },

  /**
   * 9. 下载图片
   */
  trackDownloadImage(
    userId: string,
    featureName: string,
    options?: {
      fileType?: string;
      fileSize?: number;
      imageId?: string;
    }
  ) {
    const params: DownloadImageParams = {
      user_id: userId,
      feature_name: featureName,
      file_type: options?.fileType,
      file_size: options?.fileSize,
      image_id: options?.imageId,
      page_url: window.location.href,
      page_title: document.title,
      timestamp: new Date().toISOString(),
    };

    sendEvent(GA_EVENTS.DOWNLOAD_IMAGE, params);
  },

  /**
   * 10. 付费按钮点击
   */
  trackPurchaseClick(
    userId: string,
    planType: 'subscribe' | 'one-time',
    planId: string,
    price: number,
    currency: string = 'USD'
  ) {
    const params: PurchaseClickParams = {
      user_id: userId,
      plan_type: planType,
      plan_id: planId,
      price,
      currency,
      page_url: window.location.href,
      page_title: document.title,
      timestamp: new Date().toISOString(),
    };

    sendEvent(GA_EVENTS.PURCHASE_CLICK, params);
  },

  /**
   * 11. 付费完成
   */
  trackPurchaseResult(
    userId: string,
    planType: 'subscribe' | 'one-time',
    planId: string,
    price: number,
    status: 'success' | 'fail',
    options?: {
      transactionId?: string;
      errorMessage?: string;
      currency?: string;
    }
  ) {
    const params: PurchaseResultParams = {
      user_id: userId,
      plan_type: planType,
      plan_id: planId,
      price,
      status,
      transaction_id: options?.transactionId,
      error_message: options?.errorMessage,
      currency: options?.currency || 'USD',
      page_url: window.location.href,
      page_title: document.title,
      timestamp: new Date().toISOString(),
    };

    sendEvent(GA_EVENTS.PURCHASE_RESULT, params);
  },

  // ============= 辅助方法 =============

  /**
   * 获取当前功能名称
   */
  getCurrentFeatureName,

  /**
   * 设置用户 ID
   */
  setUserId,
};

// ============= 全局类型扩展 =============

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}

