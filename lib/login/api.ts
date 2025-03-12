import axios from 'axios';
import { localAPI as api } from '@/lib/axios';

// 用户相关 API
export const authApi = {
  // 注册
  register: async (email: string, password: string, username?: string) => {
    try {
      const response = await api.post('/api/v1/user/register', {
        email,
        pwd: password,
        username: username || email // Use username if provided, otherwise fallback to email
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

  // 验证邮箱
  verifyEmail: async (verifyCode: string, email: string) => {
    try {
      const response = await api.post('/api/v1/user/email/verify', {
        verifyCode,
        email
      });
      return response.data;
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  },

  // 重发验证码
  resendVerificationCode: async (email: string) => {
    try {
      const response = await api.post('/api/v1/user/email/resend', {
        email
      });
      return response.data;
    } catch (error) {
      console.error('Resend verification code error:', error);
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

      if (response.data.auth_url) {
        return response.data.auth_url;
      } else {
        throw new Error(response.data.msg || 'Failed to get Google auth URL');
      }
    } catch (error) {
      console.error('Error getting Google auth URL:', error);
      throw error;
    }
  },

  // 获取 Google 回调
  getGoogleCallback: async (code: string) => {
    try {
      const response = await axios.get('https://google.creamoda.ai/api/v1/auth/callback', {
        params: {
          code
        }
      });
      // const response = await api.get('/api/v1/auth/callback', {
      //   params: {
      //     code
      //   }
      // });
      console.log('Google callback response:', response.data);

      if (response.data.code === 0) {
        return response.data;
      } else {
        throw new Error(response.data.msg || 'Failed to process Google authentication');
      }
    } catch (error) {
      console.error('Error processing Google callback:', error);
      throw error;
    }
  },

  // 获取用户信息
  getUserInfo: async () => {
    try {
      const response = await api.get('/api/v1/user/info');
      if (response.data.code === 0 && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.msg || 'Failed to get user info');
      }
    } catch (error) {
      console.error('Error getting user info:', error);
      throw error;
    }
  }
};

// 通用 API
export const commonApi = {
  // 获取变化类型列表
  getVariationTypeList: async () => {
    try {
      const response = await api.get('/api/v1/common/variationType/list');
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
    const API_URL = process.env.NEXT_LOCAL_API_URL || 'http://3.12.238.000';
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

// 换衣服生成
export const changeClothesGenerate = async (originalPicUrl: string, prompt: string) => {
  try {
    const token = getAuthToken();
    const response = await api.post(
      '/api/v1/img/change_clothes_generate',
      {
        originalPicUrl,
        prompt
      },
      {
        headers: {
          Authorization: token || ''
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error changing clothes generate:', error);
    throw error;
  }
};

export const copyStyleGenerate = async (originalPicUrl: string, prompt: string, fidelity: number) => {
  const token = getAuthToken();
  const response = await api.post(
    '/api/v1/img/copy_style_generate',
    {
      originalPicUrl,
      fidelity,
      prompt
    },
    {
      headers: {
        Authorization: token || ''
      }
    }
  );

  return response.data;
};
