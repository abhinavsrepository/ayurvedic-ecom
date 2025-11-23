/**
 * API Client Configuration
 * Axios instance with interceptors for authentication, error handling, and token refresh
 */

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import * as SecureStore from 'expo-secure-store';
import NetInfo from '@react-native-community/netinfo';
import Config from '../../lib/constants/config';

/**
 * API Response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

/**
 * API Error structure
 */
export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

/**
 * Token storage keys
 */
const TOKEN_KEYS = {
  ACCESS_TOKEN: Config.ACCESS_TOKEN_KEY,
  REFRESH_TOKEN: Config.REFRESH_TOKEN_KEY,
};

/**
 * Create axios instance with default configuration
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: Config.API_URL,
  timeout: Config.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-App-Version': Config.APP_VERSION,
    'X-Platform': 'mobile',
  },
});

/**
 * Flag to prevent multiple token refresh requests
 */
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

/**
 * Process queued requests after token refresh
 */
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Get stored access token
 */
export const getAccessToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEYS.ACCESS_TOKEN);
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
};

/**
 * Get stored refresh token
 */
export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
};

/**
 * Store authentication tokens
 */
export const setTokens = async (accessToken: string, refreshToken: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
    await SecureStore.setItemAsync(TOKEN_KEYS.REFRESH_TOKEN, refreshToken);
  } catch (error) {
    console.error('Error storing tokens:', error);
    throw error;
  }
};

/**
 * Clear stored tokens
 */
export const clearTokens = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEYS.ACCESS_TOKEN);
    await SecureStore.deleteItemAsync(TOKEN_KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error('Error clearing tokens:', error);
  }
};

/**
 * Refresh access token using refresh token
 */
const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await axios.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
      `${Config.API_URL}/auth/refresh`,
      { refreshToken },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.success && response.data.data) {
      const { accessToken, refreshToken: newRefreshToken } = response.data.data;
      await setTokens(accessToken, newRefreshToken);
      return accessToken;
    }

    throw new Error('Token refresh failed');
  } catch (error) {
    await clearTokens();
    throw error;
  }
};

/**
 * Check network connectivity
 */
const checkNetworkConnectivity = async (): Promise<boolean> => {
  const netInfo = await NetInfo.fetch();
  return netInfo.isConnected ?? false;
};

/**
 * Request Interceptor
 * Adds authentication token and checks network connectivity
 */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Check network connectivity
    const isConnected = await checkNetworkConnectivity();
    if (!isConnected) {
      return Promise.reject(new Error('No internet connection'));
    }

    // Add authentication token if available
    const token = await getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development mode
    if (Config.LOG_LEVEL === 'debug') {
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        params: config.params,
        data: config.data,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles token refresh and error responses
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // Log response in development mode
    if (Config.LOG_LEVEL === 'debug') {
      console.log('API Response:', {
        url: response.config.url,
        status: response.status,
        data: response.data,
      });
    }

    return response;
  },
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Log error in development mode
    if (Config.LOG_LEVEL === 'debug' || Config.LOG_LEVEL === 'info') {
      console.error('API Error:', {
        url: originalRequest?.url,
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
    }

    // Handle 401 Unauthorized - Token refresh
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request while token is being refreshed
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        processQueue(null, newToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        await clearTokens();
        // You can emit an event here to navigate to login screen
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle network errors
    if (error.message === 'Network Error' || error.code === 'ECONNABORTED') {
      return Promise.reject({
        message: 'Network error. Please check your internet connection.',
        statusCode: 0,
      } as ApiError);
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      return Promise.reject({
        message: 'Request timeout. Please try again.',
        statusCode: 408,
      } as ApiError);
    }

    // Handle other errors
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      statusCode: error.response?.status,
      errors: error.response?.data?.errors,
    };

    return Promise.reject(apiError);
  }
);

/**
 * Helper function to handle API errors consistently
 */
export const handleApiError = (error: any): ApiError => {
  if (error.message && error.statusCode !== undefined) {
    return error as ApiError;
  }

  return {
    message: error?.message || 'An unexpected error occurred',
    statusCode: 500,
  };
};

/**
 * Set custom header for all requests
 */
export const setDefaultHeader = (key: string, value: string): void => {
  apiClient.defaults.headers.common[key] = value;
};

/**
 * Remove custom header
 */
export const removeDefaultHeader = (key: string): void => {
  delete apiClient.defaults.headers.common[key];
};

export default apiClient;
