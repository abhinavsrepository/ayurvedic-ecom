import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

// Check if we're in development mode
const isDev = process.env.NODE_ENV === 'development';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // Reduced timeout for faster fallback
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors and token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Handle network errors (backend not available)
        if (!error.response) {
          // Silently reject - don't log expected errors during development
          return Promise.reject(new Error('API_UNAVAILABLE'));
        }

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = this.getRefreshToken();
            if (refreshToken) {
              const { data } = await axios.post(`${API_BASE_URL}/api/auth/refresh`, null, {
                headers: {
                  'X-Refresh-Token': refreshToken,
                },
                timeout: 5000,
              });

              this.setTokens(data.accessToken, data.refreshToken);

              // Retry original request
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
              }
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, clear tokens and redirect to login
            this.clearTokens();
            if (typeof window !== 'undefined') {
              // Only redirect if on admin pages
              if (window.location.pathname.startsWith('/admin')) {
                window.location.href = '/admin/login';
              }
            }
            // Reject with original error
            return Promise.reject(error);
          }
        }

        // Return the error for the caller to handle
        return Promise.reject(error);
      }
    );
  }

  // Token management
  private getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('admin_access_token');
  }

  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('admin_refresh_token');
  }

  public setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('admin_access_token', accessToken);
    localStorage.setItem('admin_refresh_token', refreshToken);
  }

  public clearTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('admin_access_token');
    localStorage.removeItem('admin_refresh_token');
    localStorage.removeItem('admin_user');
  }

  // HTTP methods with better error handling
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.get<T>(url, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    console.log('[DEBUG API] POST', url, data);
    try {
      const response = await this.client.post<T>(url, data, config);
      console.log('[DEBUG API] Response:', response.data);
      return response.data;
    } catch (error) {
      console.log('[DEBUG API] Error:', (error as any)?.response?.status, (error as any)?.response?.data);
      this.handleError(error);
      throw error;
    }
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.patch<T>(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.delete<T>(url, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Centralized error handling - only logs in production or for unexpected errors
  private handleError(error: unknown): void {
    // Don't log expected errors during development
    if (isDev) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        // Suppress logs for expected errors
        if (!axiosError.response || axiosError.message === 'API_UNAVAILABLE') {
          return; // Silently ignore
        }
      }
    }

    // Only log unexpected errors
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      
      // Skip logging for expected errors
      if (axiosError.response?.status === 401) return;
      if (axiosError.response?.status === 404) return;
      if (axiosError.response?.status === 400) return;
      if (axiosError.response?.status === 409) return;
      if (!axiosError.response) return; // Network error - already handled

      console.error('API Error:', {
        status: axiosError.response?.status,
        url: axiosError.config?.url,
        method: axiosError.config?.method,
      });
    }
  }
}

export const apiClient = new ApiClient();
