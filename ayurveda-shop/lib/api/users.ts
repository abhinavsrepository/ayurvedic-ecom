/**
 * Users API Module
 *
 * API methods for user profile management.
 */

import { apiClient } from './client';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  enabled: boolean;
  twoFaEnabled: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  roles: string[];
}

export interface UpdateProfileRequest {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  avatarUrl?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const usersApi = {
  /**
   * Get current user profile
   */
  getProfile: async (): Promise<UserProfile> => {
    return apiClient.get<UserProfile>('/api/users/me');
  },

  /**
   * Update current user profile
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<UserProfile> => {
    return apiClient.patch<UserProfile>('/api/users/me', data);
  },

  /**
   * Change password
   */
  changePassword: async (
    data: ChangePasswordRequest,
  ): Promise<{ message: string }> => {
    return apiClient.post('/api/users/me/password', data);
  },

  /**
   * Update avatar URL
   */
  updateAvatar: async (
    avatarUrl: string,
  ): Promise<{ message: string; avatarUrl: string }> => {
    return apiClient.post('/api/users/me/avatar', { avatarUrl });
  },

  /**
   * Delete user account
   */
  deleteAccount: async (password: string): Promise<{ message: string }> => {
    return apiClient.delete('/api/users/me/account', {
      data: { password },
    });
  },
};

export default usersApi;
