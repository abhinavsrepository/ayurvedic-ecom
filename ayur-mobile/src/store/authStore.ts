import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEV_USER_CONFIG } from '../config/dev.config';

/**
 * User interface representing authenticated user data
 */
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  doshaProfile?: {
    primary: 'Vata' | 'Pitta' | 'Kapha';
    secondary?: 'Vata' | 'Pitta' | 'Kapha';
    score: {
      vata: number;
      pitta: number;
      kapha: number;
    };
  };
  preferences?: {
    language: string;
    currency: string;
    notifications: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Authentication store state interface
 */
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  biometricEnabled: boolean;
  accessToken: string | null;
  refreshToken: string | null;
}

/**
 * Authentication store actions interface
 */
interface AuthActions {
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => Promise<void>;
  enableBiometric: () => Promise<void>;
  disableBiometric: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  updateUser: (updates: Partial<User>) => void;
  devBypassLogin: () => Promise<void>;
}

/**
 * Complete authentication store type
 */
export type AuthStore = AuthState & AuthActions;

/**
 * Authentication Store
 *
 * Manages user authentication state, tokens, and biometric settings.
 * Uses AsyncStorage for persistence (works on both web and native).
 *
 * @example
 * ```tsx
 * const { user, isAuthenticated, setUser, logout } = useAuthStore();
 *
 * // Login
 * setUser(userData);
 * setTokens(accessToken, refreshToken);
 *
 * // Logout
 * await logout();
 * ```
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      biometricEnabled: false,
      accessToken: null,
      refreshToken: null,

      // Actions

      /**
       * Set user data and mark as authenticated
       * @param user - User object or null to clear
       */
      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        });
      },

      /**
       * Set authentication tokens
       * @param accessToken - JWT access token
       * @param refreshToken - JWT refresh token
       */
      setTokens: (accessToken, refreshToken) => {
        set({ accessToken, refreshToken });
      },

      /**
       * Logout user and clear all authentication data
       */
      logout: async () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          accessToken: null,
          refreshToken: null,
        });
      },

      /**
       * Enable biometric authentication
       */
      enableBiometric: async () => {
        set({ biometricEnabled: true });
      },

      /**
       * Disable biometric authentication
       */
      disableBiometric: async () => {
        set({ biometricEnabled: false });
      },

      /**
       * Set loading state
       * @param loading - Loading state
       */
      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      /**
       * Update user data partially
       * @param updates - Partial user object to merge
       */
      updateUser: (updates) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              ...updates,
              updatedAt: new Date().toISOString(),
            },
          });
        }
      },

      /**
       * Dev bypass login - auto-login with mock dev user
       * Only works in development mode (__DEV__)
       */
      devBypassLogin: async () => {
        if (typeof __DEV__ === 'undefined' || !__DEV__) {
          console.warn('Dev bypass login is only available in development mode');
          return;
        }

        const now = new Date().toISOString();
        const devUser: User = {
          ...DEV_USER_CONFIG,
          createdAt: now,
          updatedAt: now,
        };

        const devAccessToken = 'dev_access_token_' + Date.now();
        const devRefreshToken = 'dev_refresh_token_' + Date.now();

        set({
          user: devUser,
          isAuthenticated: true,
          isLoading: false,
          accessToken: devAccessToken,
          refreshToken: devRefreshToken,
        });

        console.log('[DEV] Bypass login successful');
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist essential data
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        biometricEnabled: state.biometricEnabled,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);

/**
 * Selector hooks for optimized re-renders
 */
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAccessToken = () => useAuthStore((state) => state.accessToken);
