import axios from 'axios';

// 使用环境变量中的 API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://3.12.238.000';
// 使用 NEXT_PUBLIC_ 前缀的环境变量，确保客户端可以访问
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
// 修改重定向 URI 为本地开发环境的回调路径
const GOOGLE_REDIRECT_URI =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/google-callback'
    : process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || 'https://google.creamoda.ai/google-callback';

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
  },

  // Google 登录
  googleLogin: async (googleToken: string) => {
    try {
      const response = await api.post('/api/v1/user/google-login', {
        token: googleToken
      });
      return response.data;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  },

  // 获取 Google 授权 URL
  getGoogleAuthUrl: async () => {
    try {
      const response = await api.get('/api/v1/auth/google');
      console.log('Google auth URL response:', response.data);

      if (response.data.code === 0 && response.data.data && response.data.data.auth_url) {
        return response.data.data.auth_url;
      } else {
        throw new Error(response.data.msg || 'Failed to get Google auth URL');
      }
    } catch (error) {
      console.error('Error getting Google auth URL:', error);
      throw error;
    }
  }
};

// 通用 API
export const commonApi = {
  // 获取变化类型列表
  getVariationTypeList: async () => {
    try {
      const response = await api.get('/api/v1/common/variation_type/list');
      if (response.data.code === 0 && response.data.data && response.data.data.list) {
        return response.data.data.list;
      } else {
        throw new Error(response.data.msg || 'Failed to get variation type list');
      }
    } catch (error) {
      console.error('Error getting variation type list:', error);
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

// 上传图片
export const uploadImage = async (file: File) => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://3.12.238.000';
    const token = getAuthToken();

    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`/api/v1/common/img/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: token || ''
      }
    });

    if (response.data.code === 0 && response.data.data && response.data.data.url) {
      return response.data.data.url;
    } else {
      throw new Error(response.data.msg || 'Failed to upload image');
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
