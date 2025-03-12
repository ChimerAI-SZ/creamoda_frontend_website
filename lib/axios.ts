import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
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

// 修改拦截器返回类型
api.interceptors.response.use(
  response => response.data,
  error => Promise.reject(error?.response?.data || error.message)
);

// 为 api 添加类型
export type ApiResponse<T> = Promise<T>;
