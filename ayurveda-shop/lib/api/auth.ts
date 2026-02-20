import { apiClient } from './client';
import {
  LoginRequest,
  LoginResponse,
  UserProfileResponse,
  TwoFaEnableResponse,
  TwoFaVerifyRequest,
} from './types';

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>('/api/auth/login', credentials);
  },

  register: async (data: RegisterRequest): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>('/api/auth/register', data);
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post<void>('/api/auth/logout');
    } catch (error) {
      // Even if the API call fails (e.g., token expired), we still want to clear local tokens
      // This ensures the user can still "log out" locally
    } finally {
      apiClient.clearTokens();
    }
  },

  refreshToken: async (refreshToken: string): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>('/api/auth/refresh', null, {
      headers: {
        'X-Refresh-Token': refreshToken,
      },
    });
  },

  getCurrentUser: async (): Promise<UserProfileResponse> => {
    return apiClient.get<UserProfileResponse>('/api/auth/me');
  },

  getProfile: async (): Promise<UserProfileResponse> => {
    return apiClient.get<UserProfileResponse>('/api/auth/me');
  },

  enable2FA: async (): Promise<TwoFaEnableResponse> => {
    return apiClient.post<TwoFaEnableResponse>('/api/auth/2fa/enable');
  },

  verify2FA: async (request: TwoFaVerifyRequest): Promise<void> => {
    return apiClient.post<void>('/api/auth/2fa/verify', request);
  },

  disable2FA: async (): Promise<void> => {
    return apiClient.delete<void>('/api/auth/2fa/disable');
  },
};
