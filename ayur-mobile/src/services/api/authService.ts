/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import apiClient, { ApiResponse, setTokens, clearTokens } from './apiClient';
import { User } from '../../types';

WebBrowser.maybeCompleteAuthSession();

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Registration data
 */
export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

/**
 * Authentication response
 */
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

/**
 * OTP verification data
 */
export interface OTPVerificationData {
  phone: string;
  code: string;
}

/**
 * Social auth provider types
 */
export type SocialProvider = 'google' | 'apple' | 'facebook';

/**
 * Two-factor authentication data
 */
export interface TwoFactorAuthData {
  secret?: string;
  qrCode?: string;
  backupCodes?: string[];
}

/**
 * Login with email and password
 * @param credentials - User login credentials
 * @returns Authentication response with user data and tokens
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);

    if (response.data.success && response.data.data) {
      const { accessToken, refreshToken, user } = response.data.data;
      await setTokens(accessToken, refreshToken);
      return response.data.data;
    }

    throw new Error(response.data.message || 'Login failed');
  } catch (error: any) {
    throw new Error(error.message || 'Login failed');
  }
};

/**
 * Register new user account
 * @param userData - User registration data
 * @returns Authentication response with user data and tokens
 */
export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', userData);

    if (response.data.success && response.data.data) {
      const { accessToken, refreshToken, user } = response.data.data;
      await setTokens(accessToken, refreshToken);
      return response.data.data;
    }

    throw new Error(response.data.message || 'Registration failed');
  } catch (error: any) {
    throw new Error(error.message || 'Registration failed');
  }
};

/**
 * Logout user and clear tokens
 * @returns Promise that resolves when logout is complete
 */
export const logout = async (): Promise<void> => {
  try {
    // Call logout endpoint to invalidate tokens on server
    await apiClient.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
    // Continue with logout even if API call fails
  } finally {
    // Clear tokens from secure storage
    await clearTokens();
  }
};

/**
 * Refresh access token
 * @param refreshToken - Refresh token
 * @returns New access token and refresh token
 */
export const refreshToken = async (
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    const response = await apiClient.post<
      ApiResponse<{ accessToken: string; refreshToken: string }>
    >('/auth/refresh', { refreshToken });

    if (response.data.success && response.data.data) {
      const { accessToken, refreshToken: newRefreshToken } = response.data.data;
      await setTokens(accessToken, newRefreshToken);
      return response.data.data;
    }

    throw new Error('Token refresh failed');
  } catch (error: any) {
    await clearTokens();
    throw new Error(error.message || 'Token refresh failed');
  }
};

/**
 * Send OTP to phone number
 * @param phone - Phone number to send OTP to
 * @returns Promise that resolves when OTP is sent
 */
export const sendOTP = async (phone: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.post<ApiResponse<{ message: string }>>('/auth/send-otp', {
      phone,
    });

    if (response.data.success) {
      return {
        success: true,
        message: response.data.message || 'OTP sent successfully',
      };
    }

    throw new Error(response.data.message || 'Failed to send OTP');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to send OTP');
  }
};

/**
 * Verify OTP code
 * @param data - Phone number and OTP code
 * @returns Authentication response with user data and tokens
 */
export const verifyOTP = async (data: OTPVerificationData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/verify-otp', data);

    if (response.data.success && response.data.data) {
      const { accessToken, refreshToken, user } = response.data.data;
      await setTokens(accessToken, refreshToken);
      return response.data.data;
    }

    throw new Error(response.data.message || 'OTP verification failed');
  } catch (error: any) {
    throw new Error(error.message || 'OTP verification failed');
  }
};

/**
 * Login with Google
 * Opens Google OAuth flow and handles authentication
 * @returns Authentication response with user data and tokens
 */
export const loginWithGoogle = async (): Promise<AuthResponse> => {
  try {
    const redirectUri = AuthSession.makeRedirectUri({
      scheme: 'ayurveda',
    });

    const discovery = {
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenEndpoint: 'https://oauth2.googleapis.com/token',
    };

    const request = new AuthSession.AuthRequest({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      scopes: ['openid', 'profile', 'email'],
      redirectUri,
    });

    const result = await request.promptAsync(discovery);

    if (result.type === 'success' && result.params.code) {
      // Exchange code for tokens with backend
      const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/google', {
        code: result.params.code,
        redirectUri,
      });

      if (response.data.success && response.data.data) {
        const { accessToken, refreshToken, user } = response.data.data;
        await setTokens(accessToken, refreshToken);
        return response.data.data;
      }

      throw new Error(response.data.message || 'Google login failed');
    }

    throw new Error('Google authentication was cancelled');
  } catch (error: any) {
    throw new Error(error.message || 'Google login failed');
  }
};

/**
 * Login with Apple
 * Opens Apple OAuth flow and handles authentication
 * @returns Authentication response with user data and tokens
 */
export const loginWithApple = async (): Promise<AuthResponse> => {
  try {
    const redirectUri = AuthSession.makeRedirectUri({
      scheme: 'ayurveda',
    });

    const discovery = {
      authorizationEndpoint: 'https://appleid.apple.com/auth/authorize',
      tokenEndpoint: 'https://appleid.apple.com/auth/token',
    };

    const request = new AuthSession.AuthRequest({
      clientId: process.env.APPLE_CLIENT_ID || '',
      scopes: ['name', 'email'],
      redirectUri,
    });

    const result = await request.promptAsync(discovery);

    if (result.type === 'success' && result.params.code) {
      // Exchange code for tokens with backend
      const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/apple', {
        code: result.params.code,
        redirectUri,
      });

      if (response.data.success && response.data.data) {
        const { accessToken, refreshToken, user } = response.data.data;
        await setTokens(accessToken, refreshToken);
        return response.data.data;
      }

      throw new Error(response.data.message || 'Apple login failed');
    }

    throw new Error('Apple authentication was cancelled');
  } catch (error: any) {
    throw new Error(error.message || 'Apple login failed');
  }
};

/**
 * Enable two-factor authentication for user
 * @returns 2FA setup data including secret and QR code
 */
export const enable2FA = async (): Promise<TwoFactorAuthData> => {
  try {
    const response = await apiClient.post<ApiResponse<TwoFactorAuthData>>('/auth/2fa/enable');

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to enable 2FA');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to enable 2FA');
  }
};

/**
 * Verify two-factor authentication code
 * @param code - 6-digit 2FA code
 * @returns Success status
 */
export const verify2FA = async (code: string): Promise<{ success: boolean; backupCodes?: string[] }> => {
  try {
    const response = await apiClient.post<ApiResponse<{ backupCodes?: string[] }>>(
      '/auth/2fa/verify',
      { code }
    );

    if (response.data.success) {
      return {
        success: true,
        backupCodes: response.data.data?.backupCodes,
      };
    }

    throw new Error(response.data.message || '2FA verification failed');
  } catch (error: any) {
    throw new Error(error.message || '2FA verification failed');
  }
};

/**
 * Disable two-factor authentication
 * @param code - 6-digit 2FA code for verification
 * @returns Success status
 */
export const disable2FA = async (code: string): Promise<{ success: boolean }> => {
  try {
    const response = await apiClient.post<ApiResponse>('/auth/2fa/disable', { code });

    if (response.data.success) {
      return { success: true };
    }

    throw new Error(response.data.message || 'Failed to disable 2FA');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to disable 2FA');
  }
};

/**
 * Request password reset email
 * @param email - User's email address
 * @returns Success status
 */
export const forgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.post<ApiResponse>('/auth/forgot-password', { email });

    if (response.data.success) {
      return {
        success: true,
        message: response.data.message || 'Password reset email sent',
      };
    }

    throw new Error(response.data.message || 'Failed to send reset email');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to send reset email');
  }
};

/**
 * Reset password with token
 * @param token - Password reset token from email
 * @param newPassword - New password
 * @returns Success status
 */
export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.post<ApiResponse>('/auth/reset-password', {
      token,
      password: newPassword,
    });

    if (response.data.success) {
      return {
        success: true,
        message: response.data.message || 'Password reset successfully',
      };
    }

    throw new Error(response.data.message || 'Failed to reset password');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to reset password');
  }
};

/**
 * Change user password (when authenticated)
 * @param currentPassword - Current password
 * @param newPassword - New password
 * @returns Success status
 */
export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.post<ApiResponse>('/auth/change-password', {
      currentPassword,
      newPassword,
    });

    if (response.data.success) {
      return {
        success: true,
        message: response.data.message || 'Password changed successfully',
      };
    }

    throw new Error(response.data.message || 'Failed to change password');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to change password');
  }
};

/**
 * Verify email address with token
 * @param token - Email verification token
 * @returns Success status
 */
export const verifyEmail = async (token: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.post<ApiResponse>('/auth/verify-email', { token });

    if (response.data.success) {
      return {
        success: true,
        message: response.data.message || 'Email verified successfully',
      };
    }

    throw new Error(response.data.message || 'Email verification failed');
  } catch (error: any) {
    throw new Error(error.message || 'Email verification failed');
  }
};

/**
 * Resend email verification
 * @returns Success status
 */
export const resendVerificationEmail = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.post<ApiResponse>('/auth/resend-verification');

    if (response.data.success) {
      return {
        success: true,
        message: response.data.message || 'Verification email sent',
      };
    }

    throw new Error(response.data.message || 'Failed to send verification email');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to send verification email');
  }
};

/**
 * Check if email is available for registration
 * @param email - Email to check
 * @returns Availability status
 */
export const checkEmailAvailability = async (email: string): Promise<boolean> => {
  try {
    const response = await apiClient.get<ApiResponse<{ available: boolean }>>(
      '/auth/check-email',
      { params: { email } }
    );

    return response.data.data?.available ?? false;
  } catch (error: any) {
    console.error('Error checking email availability:', error);
    return false;
  }
};

export default {
  login,
  register,
  logout,
  refreshToken,
  sendOTP,
  verifyOTP,
  loginWithGoogle,
  loginWithApple,
  enable2FA,
  verify2FA,
  disable2FA,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyEmail,
  resendVerificationEmail,
  checkEmailAvailability,
};
