/**
 * Google Analytics 埋点事件类型定义
 * 基于 V1.4.5 GA 埋点需求
 */

// ============= 通用参数类型 =============

/** UTM 参数 */
export interface UTMParams {
  utm_source?: string;      // 流量来源
  utm_medium?: string;       // 流量媒介
  utm_campaign?: string;     // 营销活动
  utm_content?: string;      // 广告内容
  utm_term?: string;         // 搜索词
}

/** 设备信息 */
export interface DeviceInfo {
  device?: string;           // 设备类型：desktop/mobile/tablet
  country?: string;          // 国家
  gclid?: string;           // Google Click ID
  fbclid?: string;          // Facebook Click ID
}

/** 页面信息 */
export interface PageInfo {
  page_url: string;          // 页面 URL
  page_title?: string;       // 页面标题
  timestamp?: string;        // 时间戳
}

// ============= 具体事件参数类型 =============

/** 1. 页面浏览事件 */
export interface PageViewParams extends UTMParams, DeviceInfo, PageInfo {}

/** 2. 注册按钮点击事件 */
export interface SignupClickParams extends UTMParams, DeviceInfo, PageInfo {
  button_location?: string;  // 按钮位置
}

/** 3. 注册成功事件 */
export interface SignupSuccessParams extends UTMParams, DeviceInfo, PageInfo {
  user_id: string;           // 用户ID
  email: string;             // 邮箱
  method?: string;           // 注册方式：email/google
}

/** 4. 登录按钮点击事件 */
export interface LoginClickParams extends UTMParams, DeviceInfo, PageInfo {
  method: string;            // 登录方式：google/email
  email?: string;            // 邮箱（可选）
}

/** 5. 登录成功事件 */
export interface LoginSuccessParams extends UTMParams, DeviceInfo, PageInfo {
  user_id: string;           // 用户ID
  email: string;             // 邮箱
  method: string;            // 登录方式：google/email
}

/** 6. 上传图片事件 */
export interface UploadImageParams extends PageInfo {
  user_id: string;           // 用户ID
  feature_name: string;      // 功能名称：fashion-design/virtual-try-on/magic-kit
  file_type?: string;        // 文件类型：jpg/png
  file_size?: number;        // 文件大小（KB）
  status: 'success' | 'fail'; // 上传状态
  error_message?: string;    // 失败原因
}

/** 7. 生成按钮点击事件 */
export interface GenerateClickParams extends PageInfo {
  user_id: string;           // 用户ID
  feature_name: string;      // 功能名称
  request_id?: string;       // 请求ID（可选）
}

/** 8. 图片生成完成事件 */
export interface GenerateResultParams extends PageInfo {
  user_id: string;           // 用户ID
  feature_name: string;      // 功能名称
  request_id?: string;       // 请求ID
  status: 'success' | 'fail'; // 生成状态
  duration?: number;         // 生成时长（秒）
  error_message?: string;    // 失败原因
}

/** 9. 下载图片事件 */
export interface DownloadImageParams extends PageInfo {
  user_id: string;           // 用户ID
  feature_name: string;      // 功能名称
  file_type?: string;        // 文件类型
  file_size?: number;        // 文件大小（KB）
  image_id?: string;         // 图片ID（可选）
}

/** 10. 付费按钮点击事件 */
export interface PurchaseClickParams extends PageInfo {
  user_id: string;           // 用户ID
  plan_type: 'subscribe' | 'one-time'; // 套餐类型
  plan_id: string;           // 套餐ID
  price: number;             // 价格
  currency?: string;         // 货币：USD/CNY
}

/** 11. 付费完成事件 */
export interface PurchaseResultParams extends PageInfo {
  user_id: string;           // 用户ID
  plan_type: 'subscribe' | 'one-time'; // 套餐类型
  plan_id: string;           // 套餐ID
  price: number;             // 价格
  currency?: string;         // 货币
  status: 'success' | 'fail'; // 支付状态
  transaction_id?: string;   // 交易ID
  error_message?: string;    // 失败原因
}

// ============= 事件名称类型 =============

export type GAEventName =
  | 'page_view'
  | 'signup_click'
  | 'signup_success'
  | 'login_click'
  | 'login_success'
  | 'upload_image'
  | 'generate_click'
  | 'generate_result'
  | 'download_image'
  | 'purchase_click'
  | 'purchase_result';

// ============= 事件名称常量 =============

export const GA_EVENTS = {
  PAGE_VIEW: 'page_view',
  SIGNUP_CLICK: 'signup_click',
  SIGNUP_SUCCESS: 'signup_success',
  LOGIN_CLICK: 'login_click',
  LOGIN_SUCCESS: 'login_success',
  UPLOAD_IMAGE: 'upload_image',
  GENERATE_CLICK: 'generate_click',
  GENERATE_RESULT: 'generate_result',
  DOWNLOAD_IMAGE: 'download_image',
  PURCHASE_CLICK: 'purchase_click',
  PURCHASE_RESULT: 'purchase_result',
} as const;

