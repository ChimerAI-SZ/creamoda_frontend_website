import { api } from '@/lib/axios';

/**
 * 保存认证令牌
 * @param token 认证令牌
 */
export function saveAuthToken(token: string) {
  localStorage.setItem('auth_token', token);
  // 设置默认请求头，用于后续的 API 请求
  api.defaults.headers.common['Authorization'] = token;
}

/**
 * 获取认证令牌
 */
export function getAuthToken() {
  return localStorage.getItem('auth_token');
}

/**
 * 清除认证令牌
 */
export function clearAuthToken() {
  localStorage.removeItem('auth_token');
  delete api.defaults.headers.common['Authorization'];
}

/**
 * 检查用户是否已登录
 */
export function isAuthenticated() {
  return !!getAuthToken();
}
