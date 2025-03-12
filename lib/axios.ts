import axios from 'axios';

// 创建获取token的函数，安全地处理localStorage
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('auth_token')}`
  }
});

// 添加请求拦截器动态设置token
api.interceptors.request.use(config => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const mockAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_MOCK_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const localAPI = axios.create({
  baseURL: process.env.NEXT_LOCAL_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 为localAPI添加请求拦截器动态设置token
localAPI.interceptors.request.use(config => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  return config;
});

// 修改拦截器返回类型
api.interceptors.response.use(
  response => response.data,
  error => Promise.reject(error?.response?.data || error.message)
);

// 为 api 添加类型
export type ApiResponse<T> = Promise<T>;
