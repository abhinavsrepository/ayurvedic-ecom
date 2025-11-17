import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';

/**
 * MMKV storage instance for cart persistence
 */
const mmkvStorage = new MMKV({
  id: 'cart-storage',
});

/**
 * Cart item interface
 */
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  maxQuantity?: number;
  variant?: {
    id: string;
    name: string;
    value: string;
  };
  doshaType?: 'Vata' | 'Pitta' | 'Kapha';
  attributes?: {
    weight?: string;
    size?: string;
    [key: string]: any;
  };
}

/**
 * Coupon interface
 */
export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  appliedDiscount: number;
}

/**
 * Cart store state interface
 */
interface CartState {
  items: CartItem[];
  total: number;
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  itemCount: number;
  coupon: Coupon | null;
  taxRate: number;
  shippingRate: number;
}

/**
 * Cart store actions interface
 */
interface CartActions {
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: Omit<Coupon, 'appliedDiscount'>) => boolean;
  removeCoupon: () => void;
  setTaxRate: (rate: number) => void;
  setShippingRate: (rate: number) => void;
  getItemQuantity: (itemId: string) => number;
  isInCart: (itemId: string) => boolean;
}

/**
 * Complete cart store type
 */
export type CartStore = CartState & CartActions;

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
 * Calculate totals helper function
 */
const calculateTotals = (
  items: CartItem[],
  coupon: Coupon | null,
  taxRate: number,
  shippingRate: number
) => {
  // Calculate subtotal
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Calculate discount
  let discount = 0;
  let appliedCoupon = coupon;

  if (coupon) {
    if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
      // Coupon not applicable
      appliedCoupon = null;
    } else {
      if (coupon.discountType === 'percentage') {
        discount = (subtotal * coupon.discountValue) / 100;
        if (coupon.maxDiscount) {
          discount = Math.min(discount, coupon.maxDiscount);
        }
      } else {
        discount = coupon.discountValue;
      }
      discount = Math.min(discount, subtotal);
    }
  }

  // Calculate tax on discounted amount
  const taxableAmount = subtotal - discount;
  const tax = (taxableAmount * taxRate) / 100;

  // Calculate shipping
  const shipping = items.length > 0 ? shippingRate : 0;

  // Calculate total
  const total = taxableAmount + tax + shipping;

  // Item count
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    shipping: Math.round(shipping * 100) / 100,
    total: Math.round(total * 100) / 100,
    itemCount,
    coupon: appliedCoupon
      ? { ...appliedCoupon, appliedDiscount: discount }
      : null,
  };
};

/**
 * Cart Store
 *
 * Manages shopping cart items, quantities, and totals.
 * Automatically calculates subtotal, discounts, tax, and shipping.
 * Persists to MMKV for fast access and offline support.
 *
 * @example
 * ```tsx
 * const { items, total, addItem, removeItem } = useCartStore();
 *
 * // Add item
 * addItem({
 *   id: '1',
 *   productId: 'prod-123',
 *   name: 'Ashwagandha',
 *   price: 29.99,
 *   image: 'https://...',
 *   quantity: 2
 * });
 *
 * // Remove item
 * removeItem('1');
 * ```
 */
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Initial State
      items: [],
      total: 0,
      subtotal: 0,
      discount: 0,
      tax: 0,
      shipping: 0,
      itemCount: 0,
      coupon: null,
      taxRate: 8, // Default 8% tax
      shippingRate: 5, // Default $5 shipping

      // Actions

      /**
       * Add item to cart or increase quantity if exists
       * @param item - Cart item to add
       */
      addItem: (item) => {
        const { items, coupon, taxRate, shippingRate } = get();
        const existingItemIndex = items.findIndex(
          (i) =>
            i.productId === item.productId &&
            i.variant?.id === item.variant?.id
        );

        let newItems: CartItem[];

        if (existingItemIndex > -1) {
          // Item exists, increase quantity
          newItems = [...items];
          const existingItem = newItems[existingItemIndex];
          const newQuantity = existingItem.quantity + (item.quantity || 1);

          // Check max quantity
          if (
            existingItem.maxQuantity &&
            newQuantity > existingItem.maxQuantity
          ) {
            console.warn('Maximum quantity reached');
            return;
          }

          newItems[existingItemIndex] = {
            ...existingItem,
            quantity: newQuantity,
          };
        } else {
          // New item
          newItems = [
            ...items,
            {
              ...item,
              quantity: item.quantity || 1,
            } as CartItem,
          ];
        }

        const totals = calculateTotals(newItems, coupon, taxRate, shippingRate);
        set({ items: newItems, ...totals });
      },

      /**
       * Remove item from cart
       * @param itemId - Cart item ID to remove
       */
      removeItem: (itemId) => {
        const { items, coupon, taxRate, shippingRate } = get();
        const newItems = items.filter((item) => item.id !== itemId);
        const totals = calculateTotals(newItems, coupon, taxRate, shippingRate);
        set({ items: newItems, ...totals });
      },

      /**
       * Update item quantity
       * @param itemId - Cart item ID
       * @param quantity - New quantity (must be > 0)
       */
      updateQuantity: (itemId, quantity) => {
        if (quantity < 1) {
          get().removeItem(itemId);
          return;
        }

        const { items, coupon, taxRate, shippingRate } = get();
        const newItems = items.map((item) => {
          if (item.id === itemId) {
            // Check max quantity
            if (item.maxQuantity && quantity > item.maxQuantity) {
              console.warn('Maximum quantity reached');
              return item;
            }
            return { ...item, quantity };
          }
          return item;
        });

        const totals = calculateTotals(newItems, coupon, taxRate, shippingRate);
        set({ items: newItems, ...totals });
      },

      /**
       * Clear all items from cart
       */
      clearCart: () => {
        set({
          items: [],
          total: 0,
          subtotal: 0,
          discount: 0,
          tax: 0,
          shipping: 0,
          itemCount: 0,
          coupon: null,
        });
      },

      /**
       * Apply coupon code to cart
       * @param coupon - Coupon to apply
       * @returns true if coupon was applied successfully
       */
      applyCoupon: (coupon) => {
        const { items, taxRate, shippingRate } = get();
        const fullCoupon = { ...coupon, appliedDiscount: 0 };
        const totals = calculateTotals(items, fullCoupon, taxRate, shippingRate);

        if (totals.coupon) {
          set({ ...totals });
          return true;
        }

        return false;
      },

      /**
       * Remove applied coupon
       */
      removeCoupon: () => {
        const { items, taxRate, shippingRate } = get();
        const totals = calculateTotals(items, null, taxRate, shippingRate);
        set({ ...totals });
      },

      /**
       * Set tax rate
       * @param rate - Tax rate percentage (e.g., 8 for 8%)
       */
      setTaxRate: (rate) => {
        const { items, coupon, shippingRate } = get();
        const totals = calculateTotals(items, coupon, rate, shippingRate);
        set({ taxRate: rate, ...totals });
      },

      /**
       * Set shipping rate
       * @param rate - Shipping cost
       */
      setShippingRate: (rate) => {
        const { items, coupon, taxRate } = get();
        const totals = calculateTotals(items, coupon, taxRate, rate);
        set({ shippingRate: rate, ...totals });
      },

      /**
       * Get quantity of specific item in cart
       * @param itemId - Cart item ID
       * @returns Quantity or 0 if not in cart
       */
      getItemQuantity: (itemId) => {
        const { items } = get();
        const item = items.find((i) => i.id === itemId);
        return item?.quantity || 0;
      },

      /**
       * Check if item is in cart
       * @param itemId - Cart item ID
       * @returns true if item is in cart
       */
      isInCart: (itemId) => {
        const { items } = get();
        return items.some((item) => item.id === itemId);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => mmkvStorageAdapter),
    }
  )
);

/**
 * Selector hooks for optimized re-renders
 */
export const useCartItems = () => useCartStore((state) => state.items);
export const useCartTotal = () => useCartStore((state) => state.total);
export const useCartItemCount = () => useCartStore((state) => state.itemCount);
export const useCartCoupon = () => useCartStore((state) => state.coupon);
