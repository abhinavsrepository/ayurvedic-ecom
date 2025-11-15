import { apiClient } from './client';
import {
  LoginRequest,
  LoginResponse,
  UserProfileResponse,
  TwoFaEnableResponse,
  TwoFaVerifyRequest,
} from './types';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>('/api/auth/login', credentials);
  },

  logout: async (): Promise<void> => {
    await apiClient.post<void>('/api/auth/logout');
    apiClient.clearTokens();
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
