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
    'Content-Type': 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJyaWNrLnlsaXVAZm94bWFpbC5jb20iLCJleHAiOjE3NDIyMDM4MTB9.4VDi1Zz7KlhtEDMSG0g_Rf4D2tG27ZuLSKx4acu9U6o'
  }
});

// 修改拦截器返回类型
api.interceptors.response.use(
  response => response.data,
  error => Promise.reject(error?.response?.data || error.message)
);

// 为 api 添加类型
export type ApiResponse<T> = Promise<T>;
