import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';

/**
 * MMKV storage instance for UI preferences persistence
 */
const mmkvStorage = new MMKV({
  id: 'ui-storage',
});

/**
 * Theme types
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * Language types
 */
export type Language = 'en' | 'hi' | 'es' | 'fr' | 'de';

/**
 * Currency types
 */
export type Currency = 'USD' | 'INR' | 'EUR' | 'GBP';

/**
 * Toast severity types
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * Toast message interface
 */
export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
}

/**
 * Loading state interface
 */
export interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

/**
 * UI store state interface
 */
interface UIState {
  theme: Theme;
  language: Language;
  currency: Currency;
  loading: LoadingState;
  toasts: Toast[];
  isOnboarded: boolean;
  showBottomSheet: boolean;
  bottomSheetContent: React.ReactNode | null;
  isOffline: boolean;
}

/**
 * UI store actions interface
 */
interface UIActions {
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  setCurrency: (currency: Currency) => void;
  setLoading: (loading: boolean, message?: string, progress?: number) => void;
  showToast: (
    type: ToastType,
    message: string,
    duration?: number,
    action?: Toast['action']
  ) => string;
  hideToast: (id: string) => void;
  clearToasts: () => void;
  setOnboarded: (onboarded: boolean) => void;
  showBottomSheetModal: (content: React.ReactNode) => void;
  hideBottomSheetModal: () => void;
  setOfflineStatus: (isOffline: boolean) => void;
}

/**
 * Complete UI store type
 */
export type UIStore = UIState & UIActions;

/**
 * MMKV storage adapter for Zustand
 */
const mmkvStorageAdapter = {
  getItem: (name: string): string | null => {
    const value = mmkvStorage.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string): void => {
    mmkvStorage.set(name, value);
  },
  removeItem: (name: string): void => {
    mmkvStorage.delete(name);
  },
};

/**
 * Currency symbols mapping
 */
export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  INR: '₹',
  EUR: '€',
  GBP: '£',
};

/**
 * Language names mapping
 */
export const LANGUAGE_NAMES: Record<Language, string> = {
  en: 'English',
  hi: 'हिंदी',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
};

/**
 * UI Store
 *
 * Manages global UI state including theme, language, currency,
 * loading states, toasts, and modal dialogs.
 * Persists user preferences to MMKV.
 *
 * @example
 * ```tsx
 * const { theme, setTheme, showToast, setLoading } = useUIStore();
 *
 * // Change theme
 * setTheme('dark');
 *
 * // Show toast
 * showToast('success', 'Item added to cart!', 3000);
 *
 * // Show loading
 * setLoading(true, 'Processing...');
 * ```
 */
export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      // Initial State
      theme: 'system',
      language: 'en',
      currency: 'USD',
      loading: {
        isLoading: false,
      },
      toasts: [],
      isOnboarded: false,
      showBottomSheet: false,
      bottomSheetContent: null,
      isOffline: false,

      // Actions

      /**
       * Set application theme
       * @param theme - Theme to apply ('light', 'dark', or 'system')
       */
      setTheme: (theme) => {
        set({ theme });
      },

      /**
       * Set application language
       * @param language - Language code
       */
      setLanguage: (language) => {
        set({ language });
      },

      /**
       * Set currency for prices
       * @param currency - Currency code
       */
      setCurrency: (currency) => {
        set({ currency });
      },

      /**
       * Set global loading state
       * @param isLoading - Loading state
       * @param message - Optional loading message
       * @param progress - Optional progress (0-100)
       */
      setLoading: (isLoading, message, progress) => {
        set({
          loading: {
            isLoading,
            message,
            progress,
          },
        });
      },

      /**
       * Show toast notification
       * @param type - Toast type ('success', 'error', 'warning', 'info')
       * @param message - Toast message
       * @param duration - Duration in milliseconds (default: 3000)
       * @param action - Optional action button
       * @returns Toast ID for manual dismissal
       */
      showToast: (type, message, duration = 3000, action) => {
        const id = `toast-${Date.now()}-${Math.random()}`;
        const toast: Toast = {
          id,
          type,
          message,
          duration,
          action,
        };

        const { toasts } = get();
        set({ toasts: [...toasts, toast] });

        // Auto-dismiss after duration
        if (duration > 0) {
          setTimeout(() => {
            get().hideToast(id);
          }, duration);
        }

        return id;
      },

      /**
       * Hide specific toast by ID
       * @param id - Toast ID to hide
       */
      hideToast: (id) => {
        const { toasts } = get();
        set({ toasts: toasts.filter((toast) => toast.id !== id) });
      },

      /**
       * Clear all toasts
       */
      clearToasts: () => {
        set({ toasts: [] });
      },

      /**
       * Mark user as onboarded
       * @param onboarded - Onboarding status
       */
      setOnboarded: (onboarded) => {
        set({ isOnboarded: onboarded });
      },

      /**
       * Show bottom sheet modal with custom content
       * @param content - React component to display
       */
      showBottomSheetModal: (content) => {
        set({
          showBottomSheet: true,
          bottomSheetContent: content,
        });
      },

      /**
       * Hide bottom sheet modal
       */
      hideBottomSheetModal: () => {
        set({
          showBottomSheet: false,
          bottomSheetContent: null,
        });
      },

      /**
       * Set offline status
       * @param isOffline - Offline state
       */
      setOfflineStatus: (isOffline) => {
        set({ isOffline });
      },
    }),
    {
      name: 'ui-storage',
      storage: createJSONStorage(() => mmkvStorageAdapter),
      // Only persist user preferences, not transient UI state
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        currency: state.currency,
        isOnboarded: state.isOnboarded,
      }),
    }
  )
);

/**
 * Selector hooks for optimized re-renders
 */
export const useTheme = () => useUIStore((state) => state.theme);
export const useLanguage = () => useUIStore((state) => state.language);
export const useCurrency = () => useUIStore((state) => state.currency);
export const useLoading = () => useUIStore((state) => state.loading);
export const useToasts = () => useUIStore((state) => state.toasts);
export const useIsOnboarded = () => useUIStore((state) => state.isOnboarded);
export const useIsOffline = () => useUIStore((state) => state.isOffline);

/**
 * Helper hook to get currency symbol
 */
export const useCurrencySymbol = () => {
  const currency = useCurrency();
  return CURRENCY_SYMBOLS[currency];
};

/**
 * Helper hook to get language name
 */
export const useLanguageName = () => {
  const language = useLanguage();
  return LANGUAGE_NAMES[language];
};
