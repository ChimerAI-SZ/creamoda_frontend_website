/**
 * 认证工具函数
 */

// 检查用户是否已登录
export const isUserLoggedIn = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('auth_token');
  return !!token;
};

// 获取认证token
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  return localStorage.getItem('auth_token');
};

// 清除认证信息
export const clearAuthData = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('auth_token');
  // 可以添加其他需要清除的认证数据
};

// 处理认证错误的通用函数
export const handleAuthError = (error: any): boolean => {
  const isAuthError = 
    error?.status === 401 ||
    error?.code === 401 ||
    error?.message?.includes('Invalid or expired token') ||
    error?.message?.includes('Unauthorized');
    
  if (isAuthError) {
    console.warn('Authentication required. Please login to continue.');
    clearAuthData();
    return true;
  }
  
  return false;
};

// 获取友好的错误消息
export const getAuthErrorMessage = (error: any): string => {
  if (handleAuthError(error)) {
    return 'Please login to access this feature';
  }
  
  return error?.message || 'An error occurred';
};
