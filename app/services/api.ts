import axios from 'axios';

// 使用环境变量中的 API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://3.12.238.000';

// 创建 axios 实例
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 用户相关 API
export const authApi = {
  // 注册
  register: async (email: string, password: string) => {
    try {
      const response = await api.post('/api/v1/user/register', {
        email,
        pwd: password
      });
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // 登录
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/api/v1/user/login', {
        email,
        pwd: password
      });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
};

// 保存认证令牌
export const saveAuthToken = (token: string) => {
  localStorage.setItem('auth_token', token);
  // 设置默认请求头，用于后续的 API 请求
  api.defaults.headers.common['Authorization'] = token;
};

// 获取认证令牌
export const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

// 清除认证令牌
export const clearAuthToken = () => {
  localStorage.removeItem('auth_token');
  delete api.defaults.headers.common['Authorization'];
};

// 检查用户是否已登录
export const isAuthenticated = () => {
  return !!getAuthToken();
};
