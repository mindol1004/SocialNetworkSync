import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse } from '@/server/infra/response/ApiResponse';
import { AppError } from '@/shared/error/AppError';

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  }
});

interface ApiOptions extends AxiosRequestConfig {
  params?: Record<string, string | number | boolean | undefined>;
}

// 응답 핸들러
function handleResponse<T>(response: AxiosResponse<ApiResponse<T>>): T {
  const data = response.data;

  if (!data.success) {
    const error = data.error || { code: 'UNKNOWN_ERROR', message: 'Unknown error occurred' };
    throw new AppError(error.message, response.status, error.code);
  }

  return data.data;
}

// 에러 핸들러
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const errorMessage = error.response?.data?.error?.message || error.message || 'Network error occurred';
      const errorCode = error.response?.data?.error?.code || 'NETWORK_ERROR';

      throw new AppError(errorMessage, status, errorCode);
    }
    throw error;
  }
);

async function callApi<T>(method: string, url: string, data?: any, options: ApiOptions = {}): Promise<T> {
  try {
    const response = await axiosInstance({
      method,
      url,
      data,
      ...options
    });

    return handleResponse<T>(response);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
    throw new AppError(
      errorMessage,
      500,
      'NETWORK_ERROR'
    );
  }
}

// 편의 함수들
export const api = {
  get: <T>(url: string, options: ApiOptions = {}): Promise<T> => 
    callApi<T>('get', url, undefined, options),

  post: <T>(url: string, data?: any, options: ApiOptions = {}): Promise<T> => 
    callApi<T>('post', url, data, options),

  put: <T>(url: string, data?: any, options: ApiOptions = {}): Promise<T> => 
    callApi<T>('put', url, data, options),

  patch: <T>(url: string, data?: any, options: ApiOptions = {}): Promise<T> => 
    callApi<T>('patch', url, data, options),

  delete: <T>(url: string, options: ApiOptions = {}): Promise<T> => 
    callApi<T>('delete', url, undefined, options),
};