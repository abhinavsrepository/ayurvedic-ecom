import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';

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
}

/**
 * Complete authentication store type
 */
export type AuthStore = AuthState & AuthActions;

/**
 * Secure storage implementation for encrypted persistence
 * Uses expo-secure-store for sensitive authentication data
 */
const secureStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      const value = await SecureStore.getItemAsync(name);
      return value;
    } catch (error) {
      console.error('Error reading from secure storage:', error);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(name, value);
    } catch (error) {
      console.error('Error writing to secure storage:', error);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(name);
    } catch (error) {
      console.error('Error removing from secure storage:', error);
    }
  },
};

/**
 * Authentication Store
 *
 * Manages user authentication state, tokens, and biometric settings.
 * All data is persisted to encrypted secure storage for security.
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

        // Clear secure storage
        try {
          await SecureStore.deleteItemAsync('auth-storage');
        } catch (error) {
          console.error('Error clearing secure storage:', error);
        }
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
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => secureStorage),
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
