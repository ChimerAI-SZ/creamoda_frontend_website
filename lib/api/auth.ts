import { api } from '@/lib/axios';
import axios from 'axios';

/**
 * 用户注册
 * @param email 邮箱
 * @param password 密码
 * @param username 用户名（可选）
 */
export async function register(email: string, password: string, username?: string) {
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
}

/**
 * 用户登录
 * @param email 邮箱
 * @param password 密码
 */
export async function login(email: string, password: string) {
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

/**
 * 验证邮箱
 * @param verifyCode 验证码
 * @param email 邮箱
 */
export async function verifyEmail(verifyCode: string, email: string) {
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
}

/**
 * 重发验证码
 * @param email 邮箱
 */
export async function resendVerificationCode(email: string) {
  try {
    const response = await api.post('/api/v1/user/email/resend', {
      email
    });
    return response.data;
  } catch (error) {
    console.error('Resend verification code error:', error);
    throw error;
  }
}

/**
 * 获取 Google 授权 URL
 */
export async function getGoogleAuthUrl() {
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
}

/**
 * 获取 Google 回调
 * @param code 授权码
 */
export async function getGoogleCallback(code: string) {
  try {
    const response = await axios.get(`/api/v1/auth/callback`, {
      params: { code }
    });
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
}

/**
 * 获取用户信息
 */
export async function getUserInfo() {
  try {
    const response = await api.get('/api/v1/user/info');
    // More detailed error handling
    if (response.data.code === 0 && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.msg || 'Failed to get user info');
    }
  } catch (error: any) {
    // Handle specific auth errors more gracefully
    if (error?.message?.includes('Invalid or expired token')) {
      // Token expired - this is expected behavior, don't spam console
      console.warn('Authentication token expired, please login again');
    } else {
      // Other errors should be logged
      console.error('Error getting user info:', error);
    }
    throw error;
  }
}
