/**
 * Zustand Store Index
 *
 * Central export point for all application stores.
 * Import stores from here to maintain consistency across the app.
 *
 * @example
 * ```tsx
 * import { useAuthStore, useCartStore, useUIStore } from '@/store';
 * ```
 */

// Auth Store
export {
  useAuthStore,
  useAuthUser,
  useIsAuthenticated,
  useAuthLoading,
  useAccessToken,
} from './authStore';
export type { User, AuthStore } from './authStore';

// Cart Store
export {
  useCartStore,
  useCartItems,
  useCartTotal,
  useCartItemCount,
  useCartCoupon,
} from './cartStore';
export type { CartItem, Coupon, CartStore } from './cartStore';

// Wishlist Store
export {
  useWishlistStore,
  useWishlistItems,
  useWishlistItemCount,
  useIsInWishlist,
} from './wishlistStore';
export type { WishlistItem, WishlistStore } from './wishlistStore';

// Dosha Store
export {
  useDoshaStore,
  useDoshaQuiz,
  useDoshaResult,
  useDoshaHistory,
  useCurrentQuestion,
} from './doshaStore';
export type {
  DoshaType,
  DoshaQuestion,
  DoshaAnswer,
  DoshaResult,
  QuizState,
  DoshaStore,
} from './doshaStore';

// UI Store
export {
  useUIStore,
  useTheme,
  useLanguage,
  useCurrency,
  useLoading,
  useToasts,
  useIsOnboarded,
  useIsOffline,
  useCurrencySymbol,
  useLanguageName,
  CURRENCY_SYMBOLS,
  LANGUAGE_NAMES,
} from './uiStore';
export type { Theme, Language, Currency, ToastType, Toast, UIStore } from './uiStore';

// Sync Store
export {
  useSyncStore,
  useSyncQueue,
  useIsSyncing,
  useSyncProgress,
  useLastSyncTime,
  usePendingCount,
  useFailedCount,
} from './syncStore';
export type {
  SyncOperationType,
  SyncStatus,
  SyncQueueItem,
  SyncResult,
  SyncStore,
} from './syncStore';

/**
 * Store initialization and cleanup utilities
 */

/**
 * Reset all stores to initial state
 * Useful for logout or testing scenarios
 */
export const resetAllStores = async () => {
  const { useAuthStore } = await import('./authStore');
  const { useCartStore } = await import('./cartStore');
  const { useWishlistStore } = await import('./wishlistStore');
  const { useDoshaStore } = await import('./doshaStore');
  const { useUIStore } = await import('./uiStore');
  const { useSyncStore } = await import('./syncStore');

  // Reset auth (includes clearing secure storage)
  await useAuthStore.getState().logout();

  // Reset cart
  useCartStore.getState().clearCart();

  // Reset wishlist
  useWishlistStore.getState().clearWishlist();

  // Reset dosha
  useDoshaStore.getState().resetQuiz();
  useDoshaStore.getState().clearHistory();

  // Reset UI (except preferences)
  useUIStore.getState().clearToasts();
  useUIStore.getState().setLoading(false);

  // Reset sync
  useSyncStore.getState().clearQueue();
};

/**
 * Get all store states (for debugging)
 * @returns Object containing all store states
 */
export const getAllStoreStates = () => {
  const { useAuthStore } = require('./authStore');
  const { useCartStore } = require('./cartStore');
  const { useWishlistStore } = require('./wishlistStore');
  const { useDoshaStore } = require('./doshaStore');
  const { useUIStore } = require('./uiStore');
  const { useSyncStore } = require('./syncStore');

  return {
    auth: useAuthStore.getState(),
    cart: useCartStore.getState(),
    wishlist: useWishlistStore.getState(),
    dosha: useDoshaStore.getState(),
    ui: useUIStore.getState(),
    sync: useSyncStore.getState(),
  };
};

/**
 * Subscribe to store changes (for debugging)
 * @param callback - Function to call on any store change
 * @returns Unsubscribe function
 */
export const subscribeToAllStores = (callback: () => void) => {
  const { useAuthStore } = require('./authStore');
  const { useCartStore } = require('./cartStore');
  const { useWishlistStore } = require('./wishlistStore');
  const { useDoshaStore } = require('./doshaStore');
  const { useUIStore } = require('./uiStore');
  const { useSyncStore } = require('./syncStore');

  const unsubscribers = [
    useAuthStore.subscribe(callback),
    useCartStore.subscribe(callback),
    useWishlistStore.subscribe(callback),
    useDoshaStore.subscribe(callback),
    useUIStore.subscribe(callback),
    useSyncStore.subscribe(callback),
  ];

  return () => {
    unsubscribers.forEach((unsubscribe) => unsubscribe());
  };
};
