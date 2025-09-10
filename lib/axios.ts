import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { eventBus } from '@/utils/events';
// Create a function to get token, safely handling localStorage
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

// Create a function to handle unauthorized responses
const handleUnauthorized = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    eventBus.emit('auth:login', { isOpen: true });
  }
};

// Configure response interceptor for an axios instance
const configureResponseInterceptor = (instance: AxiosInstance): void => {
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // Handle cases where API returns 200 but the response body contains code: 401
      if (response.data?.code === 401) {
        handleUnauthorized();
        return Promise.resolve(response);
      }
      return response;
    },
    (error: AxiosError) => {
      // Handle unauthorized errors (401)
      if (error.response?.status === 401) {
        handleUnauthorized();
      }

      // 创建更详细的错误对象
      const errorData = error.response?.data;
      const errorMessage = typeof errorData === 'object' && errorData !== null
        ? (errorData as any)?.msg || (errorData as any)?.message || JSON.stringify(errorData)
        : errorData || error.message || 'An unknown error occurred';

      // 创建带有完整错误信息的错误对象
      const enhancedError = new Error(errorMessage);
      (enhancedError as any).response = error.response;
      (enhancedError as any).status = error.response?.status;
      (enhancedError as any).data = errorData;

      return Promise.reject(enhancedError);
    }
  );
};

// Configure request interceptor for an axios instance
const configureRequestInterceptor = (instance: AxiosInstance): void => {
  instance.interceptors.request.use(config => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  });
};

// Create and configure API instances
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

// Configure interceptors for all instances
configureRequestInterceptor(api);
configureRequestInterceptor(localAPI);

configureResponseInterceptor(api);
configureResponseInterceptor(mockAPI);
configureResponseInterceptor(localAPI);

// Export type for API responses
export type ApiResponse<T> = Promise<T>;
