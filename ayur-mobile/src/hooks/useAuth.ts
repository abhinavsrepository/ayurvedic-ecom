/**
 * Authentication React Query Hooks
 *
 * Provides hooks for all authentication operations including:
 * - Login, Register, Logout
 * - OTP verification
 * - Token refresh
 * - Current user data
 *
 * Integrates with authService and authStore for seamless state management.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { authKeys, userKeys } from '../lib/constants/queryKeys';
import * as authService from '../services/api/authService';
import { User } from '../types';

/**
 * Hook for logging in with email and password
 *
 * @example
 * ```tsx
 * const { mutate: login, isPending } = useLogin();
 *
 * login({ email: 'user@example.com', password: 'password' }, {
 *   onSuccess: (data) => console.log('Logged in:', data.user),
 *   onError: (error) => console.error('Login failed:', error)
 * });
 * ```
 */
export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setUser, setTokens } = useAuthStore();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // Update auth store
      setUser(data.user);
      setTokens(data.accessToken, data.refreshToken);

      // Set query cache
      queryClient.setQueryData(authKeys.user(), data.user);
      queryClient.setQueryData(userKeys.profile(), data.user);
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });
};

/**
 * Hook for registering a new user account
 *
 * @example
 * ```tsx
 * const { mutate: register, isPending } = useRegister();
 *
 * register({
 *   email: 'user@example.com',
 *   password: 'password',
 *   name: 'John Doe'
 * });
 * ```
 */
export const useRegister = () => {
  const queryClient = useQueryClient();
  const { setUser, setTokens } = useAuthStore();

  return useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      // Update auth store
      setUser(data.user);
      setTokens(data.accessToken, data.refreshToken);

      // Set query cache
      queryClient.setQueryData(authKeys.user(), data.user);
      queryClient.setQueryData(userKeys.profile(), data.user);
    },
    onError: (error) => {
      console.error('Registration error:', error);
    },
  });
};

/**
 * Hook for logging out current user
 * Clears all cached data and resets auth state
 *
 * @example
 * ```tsx
 * const { mutate: logout } = useLogout();
 *
 * logout();
 * ```
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  const { logout: logoutStore } = useAuthStore();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: async () => {
      // Clear auth store
      await logoutStore();

      // Clear all query cache
      queryClient.clear();
    },
    onError: (error) => {
      console.error('Logout error:', error);
      // Still logout locally even if API call fails
      logoutStore();
      queryClient.clear();
    },
  });
};

/**
 * Hook for refreshing access token
 *
 * @example
 * ```tsx
 * const { mutate: refresh } = useRefreshToken();
 *
 * refresh(currentRefreshToken);
 * ```
 */
export const useRefreshToken = () => {
  const { setTokens } = useAuthStore();

  return useMutation({
    mutationFn: authService.refreshToken,
    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken);
    },
    onError: async (error) => {
      console.error('Token refresh error:', error);
      // If refresh fails, logout user
      const { logout } = useAuthStore.getState();
      await logout();
    },
  });
};

/**
 * Hook for sending OTP to phone number
 *
 * @example
 * ```tsx
 * const { mutate: sendOTP, isPending } = useSendOTP();
 *
 * sendOTP('+1234567890', {
 *   onSuccess: () => console.log('OTP sent')
 * });
 * ```
 */
export const useSendOTP = () => {
  return useMutation({
    mutationFn: authService.sendOTP,
    onError: (error) => {
      console.error('Send OTP error:', error);
    },
  });
};

/**
 * Hook for verifying OTP code
 *
 * @example
 * ```tsx
 * const { mutate: verifyOTP } = useVerifyOTP();
 *
 * verifyOTP({ phone: '+1234567890', code: '123456' });
 * ```
 */
export const useVerifyOTP = () => {
  const queryClient = useQueryClient();
  const { setUser, setTokens } = useAuthStore();

  return useMutation({
    mutationFn: authService.verifyOTP,
    onSuccess: (data) => {
      // Update auth store
      setUser(data.user);
      setTokens(data.accessToken, data.refreshToken);

      // Set query cache
      queryClient.setQueryData(authKeys.user(), data.user);
      queryClient.setQueryData(userKeys.profile(), data.user);
    },
    onError: (error) => {
      console.error('OTP verification error:', error);
    },
  });
};

/**
 * Hook for getting current user data
 * Returns cached user from auth store, with option to refetch
 *
 * @param options - Query options
 * @example
 * ```tsx
 * const { data: user, isLoading, refetch } = useCurrentUser();
 *
 * if (user) {
 *   console.log('Current user:', user.name);
 * }
 * ```
 */
export const useCurrentUser = (options?: {
  enabled?: boolean;
  refetchOnMount?: boolean;
}) => {
  const { user, isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async () => {
      // Return user from store as initial data
      return user as User;
    },
    enabled: isAuthenticated && (options?.enabled ?? true),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    refetchOnMount: options?.refetchOnMount ?? false,
    initialData: user || undefined,
  });
};

/**
 * Hook for changing user password
 *
 * @example
 * ```tsx
 * const { mutate: changePassword } = useChangePassword();
 *
 * changePassword({
 *   currentPassword: 'old',
 *   newPassword: 'new'
 * });
 * ```
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: {
      currentPassword: string;
      newPassword: string;
    }) => authService.changePassword(currentPassword, newPassword),
    onError: (error) => {
      console.error('Change password error:', error);
    },
  });
};

/**
 * Hook for requesting password reset
 *
 * @example
 * ```tsx
 * const { mutate: forgotPassword } = useForgotPassword();
 *
 * forgotPassword('user@example.com');
 * ```
 */
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: authService.forgotPassword,
    onError: (error) => {
      console.error('Forgot password error:', error);
    },
  });
};

/**
 * Hook for resetting password with token
 *
 * @example
 * ```tsx
 * const { mutate: resetPassword } = useResetPassword();
 *
 * resetPassword({
 *   token: 'reset-token',
 *   newPassword: 'newpassword'
 * });
 * ```
 */
export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, newPassword }: {
      token: string;
      newPassword: string;
    }) => authService.resetPassword(token, newPassword),
    onError: (error) => {
      console.error('Reset password error:', error);
    },
  });
};

/**
 * Hook for verifying email with token
 *
 * @example
 * ```tsx
 * const { mutate: verifyEmail } = useVerifyEmail();
 *
 * verifyEmail('verification-token');
 * ```
 */
export const useVerifyEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.verifyEmail,
    onSuccess: () => {
      // Invalidate user data to refetch updated email verification status
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
    },
    onError: (error) => {
      console.error('Email verification error:', error);
    },
  });
};

/**
 * Hook for checking email availability
 *
 * @param email - Email to check
 * @example
 * ```tsx
 * const { data: isAvailable } = useCheckEmailAvailability('user@example.com');
 * ```
 */
export const useCheckEmailAvailability = (email: string) => {
  return useQuery({
    queryKey: [...authKeys.all, 'email-availability', email],
    queryFn: () => authService.checkEmailAvailability(email),
    enabled: !!email && email.includes('@'),
    staleTime: 30 * 1000, // 30 seconds
  });
};

/**
 * Hook for logging in with Google
 *
 * @example
 * ```tsx
 * const { mutate: loginWithGoogle } = useLoginWithGoogle();
 *
 * loginWithGoogle();
 * ```
 */
export const useLoginWithGoogle = () => {
  const queryClient = useQueryClient();
  const { setUser, setTokens } = useAuthStore();

  return useMutation({
    mutationFn: authService.loginWithGoogle,
    onSuccess: (data) => {
      setUser(data.user);
      setTokens(data.accessToken, data.refreshToken);
      queryClient.setQueryData(authKeys.user(), data.user);
      queryClient.setQueryData(userKeys.profile(), data.user);
    },
    onError: (error) => {
      console.error('Google login error:', error);
    },
  });
};

/**
 * Hook for logging in with Apple
 *
 * @example
 * ```tsx
 * const { mutate: loginWithApple } = useLoginWithApple();
 *
 * loginWithApple();
 * ```
 */
export const useLoginWithApple = () => {
  const queryClient = useQueryClient();
  const { setUser, setTokens } = useAuthStore();

  return useMutation({
    mutationFn: authService.loginWithApple,
    onSuccess: (data) => {
      setUser(data.user);
      setTokens(data.accessToken, data.refreshToken);
      queryClient.setQueryData(authKeys.user(), data.user);
      queryClient.setQueryData(userKeys.profile(), data.user);
    },
    onError: (error) => {
      console.error('Apple login error:', error);
    },
  });
};
