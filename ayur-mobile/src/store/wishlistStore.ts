import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';

/**
 * MMKV storage instance for wishlist persistence
 */
const mmkvStorage = new MMKV({
  id: 'wishlist-storage',
});

/**
 * Wishlist item interface
 */
export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  inStock: boolean;
  doshaType?: 'Vata' | 'Pitta' | 'Kapha';
  category?: string;
  addedAt: string;
}

/**
 * Wishlist store state interface
 */
interface WishlistState {
  items: WishlistItem[];
  itemCount: number;
}

/**
 * Wishlist store actions interface
 */
interface WishlistActions {
  addToWishlist: (item: Omit<WishlistItem, 'addedAt'>) => void;
  removeFromWishlist: (itemId: string) => void;
  isInWishlist: (itemId: string) => boolean;
  clearWishlist: () => void;
  updateItem: (itemId: string, updates: Partial<WishlistItem>) => void;
  toggleWishlist: (item: Omit<WishlistItem, 'addedAt'>) => void;
}

/**
 * Complete wishlist store type
 */
export type WishlistStore = WishlistState & WishlistActions;

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
 * Wishlist Store
 *
 * Manages user's wishlist/favorites items.
 * Persists to MMKV for fast access and offline support.
 * Automatically tracks item count and provides helper methods.
 *
 * @example
 * ```tsx
 * const { items, addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
 *
 * // Add to wishlist
 * addToWishlist({
 *   id: '1',
 *   productId: 'prod-123',
 *   name: 'Ashwagandha',
 *   price: 29.99,
 *   image: 'https://...',
 *   inStock: true
 * });
 *
 * // Check if in wishlist
 * const isFavorite = isInWishlist('1');
 *
 * // Toggle wishlist
 * toggleWishlist(item);
 * ```
 */
export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      // Initial State
      items: [],
      itemCount: 0,

      // Actions

      /**
       * Add item to wishlist
       * @param item - Wishlist item to add (without addedAt)
       */
      addToWishlist: (item) => {
        const { items } = get();

        // Check if item already exists
        const exists = items.some((i) => i.id === item.id);
        if (exists) {
          console.warn('Item already in wishlist');
          return;
        }

        const newItem: WishlistItem = {
          ...item,
          addedAt: new Date().toISOString(),
        };

        const newItems = [newItem, ...items];
        set({
          items: newItems,
          itemCount: newItems.length,
        });
      },

      /**
       * Remove item from wishlist
       * @param itemId - Wishlist item ID to remove
       */
      removeFromWishlist: (itemId) => {
        const { items } = get();
        const newItems = items.filter((item) => item.id !== itemId);
        set({
          items: newItems,
          itemCount: newItems.length,
        });
      },

      /**
       * Check if item is in wishlist
       * @param itemId - Wishlist item ID to check
       * @returns true if item is in wishlist
       */
      isInWishlist: (itemId) => {
        const { items } = get();
        return items.some((item) => item.id === itemId);
      },

      /**
       * Clear all items from wishlist
       */
      clearWishlist: () => {
        set({
          items: [],
          itemCount: 0,
        });
      },

      /**
       * Update wishlist item
       * @param itemId - Wishlist item ID to update
       * @param updates - Partial item data to merge
       */
      updateItem: (itemId, updates) => {
        const { items } = get();
        const newItems = items.map((item) =>
          item.id === itemId ? { ...item, ...updates } : item
        );
        set({ items: newItems });
      },

      /**
       * Toggle item in wishlist (add if not present, remove if present)
       * @param item - Wishlist item to toggle
       */
      toggleWishlist: (item) => {
        const { isInWishlist, addToWishlist, removeFromWishlist } = get();
        if (isInWishlist(item.id)) {
          removeFromWishlist(item.id);
        } else {
          addToWishlist(item);
        }
      },
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => mmkvStorageAdapter),
    }
  )
);

/**
 * Selector hooks for optimized re-renders
 */
export const useWishlistItems = () => useWishlistStore((state) => state.items);
export const useWishlistItemCount = () =>
  useWishlistStore((state) => state.itemCount);
export const useIsInWishlist = (itemId: string) =>
  useWishlistStore((state) => state.isInWishlist(itemId));
