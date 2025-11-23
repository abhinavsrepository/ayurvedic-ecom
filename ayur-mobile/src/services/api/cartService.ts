/**
 * Cart Service
 * Handles all shopping cart-related API calls
 */

import apiClient, { ApiResponse } from './apiClient';
import { Cart, CartItem, Product } from '../../types';

/**
 * Cart response with additional metadata
 */
export interface CartResponse extends Cart {
  itemCount: number;
  appliedCoupon?: AppliedCoupon;
  discount?: number;
}

/**
 * Coupon information
 */
export interface AppliedCoupon {
  code: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  description?: string;
}

/**
 * Add to cart parameters
 */
export interface AddToCartParams {
  productId: string;
  quantity: number;
  variant?: string;
}

/**
 * Update cart item parameters
 */
export interface UpdateCartItemParams {
  quantity: number;
}

/**
 * Cart item with ID
 */
export interface CartItemWithId extends CartItem {
  id: string;
}

/**
 * Get user's shopping cart
 * @returns Cart with items and totals
 */
export const getCart = async (): Promise<CartResponse> => {
  try {
    const response = await apiClient.get<ApiResponse<CartResponse>>('/cart');

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to fetch cart');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch cart');
  }
};

/**
 * Add product to cart
 * @param productId - Product ID to add
 * @param quantity - Quantity to add (default: 1)
 * @param variant - Product variant (optional)
 * @returns Updated cart
 */
export const addToCart = async (
  productId: string,
  quantity: number = 1,
  variant?: string
): Promise<CartResponse> => {
  try {
    const response = await apiClient.post<ApiResponse<CartResponse>>('/cart/items', {
      productId,
      quantity,
      variant,
    });

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to add item to cart');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to add item to cart');
  }
};

/**
 * Update cart item quantity
 * @param itemId - Cart item ID
 * @param quantity - New quantity
 * @returns Updated cart
 */
export const updateCartItem = async (
  itemId: string,
  quantity: number
): Promise<CartResponse> => {
  try {
    const response = await apiClient.put<ApiResponse<CartResponse>>(
      `/cart/items/${itemId}`,
      { quantity }
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to update cart item');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update cart item');
  }
};

/**
 * Remove item from cart
 * @param itemId - Cart item ID to remove
 * @returns Updated cart
 */
export const removeFromCart = async (itemId: string): Promise<CartResponse> => {
  try {
    const response = await apiClient.delete<ApiResponse<CartResponse>>(`/cart/items/${itemId}`);

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to remove item from cart');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to remove item from cart');
  }
};

/**
 * Apply coupon code to cart
 * @param code - Coupon code
 * @returns Updated cart with applied discount
 */
export const applyCoupon = async (code: string): Promise<CartResponse> => {
  try {
    const response = await apiClient.post<ApiResponse<CartResponse>>('/cart/coupon', { code });

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to apply coupon');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to apply coupon');
  }
};

/**
 * Remove coupon from cart
 * @returns Updated cart without coupon
 */
export const removeCoupon = async (): Promise<CartResponse> => {
  try {
    const response = await apiClient.delete<ApiResponse<CartResponse>>('/cart/coupon');

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to remove coupon');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to remove coupon');
  }
};

/**
 * Clear all items from cart
 * @returns Empty cart
 */
export const clearCart = async (): Promise<CartResponse> => {
  try {
    const response = await apiClient.delete<ApiResponse<CartResponse>>('/cart');

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to clear cart');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to clear cart');
  }
};

/**
 * Validate cart items (check stock availability and prices)
 * @returns Validation result with any issues
 */
export const validateCart = async (): Promise<{
  valid: boolean;
  issues?: Array<{
    itemId: string;
    productId: string;
    issue: 'out_of_stock' | 'price_changed' | 'unavailable';
    message: string;
  }>;
}> => {
  try {
    const response = await apiClient.post<
      ApiResponse<{
        valid: boolean;
        issues?: Array<{
          itemId: string;
          productId: string;
          issue: 'out_of_stock' | 'price_changed' | 'unavailable';
          message: string;
        }>;
      }>
    >('/cart/validate');

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to validate cart');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to validate cart');
  }
};

/**
 * Get cart item count
 * @returns Total number of items in cart
 */
export const getCartItemCount = async (): Promise<number> => {
  try {
    const response = await apiClient.get<ApiResponse<{ count: number }>>('/cart/count');

    if (response.data.success && response.data.data) {
      return response.data.data.count;
    }

    return 0;
  } catch (error: any) {
    console.error('Failed to get cart count:', error);
    return 0;
  }
};

/**
 * Sync local cart with server cart
 * Used when user logs in to merge local cart items
 * @param localCartItems - Cart items from local storage
 * @returns Merged cart
 */
export const syncCart = async (localCartItems: CartItemWithId[]): Promise<CartResponse> => {
  try {
    const response = await apiClient.post<ApiResponse<CartResponse>>('/cart/sync', {
      items: localCartItems,
    });

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to sync cart');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sync cart');
  }
};

/**
 * Add multiple items to cart at once
 * @param items - Array of items to add
 * @returns Updated cart
 */
export const addMultipleToCart = async (
  items: AddToCartParams[]
): Promise<CartResponse> => {
  try {
    const response = await apiClient.post<ApiResponse<CartResponse>>('/cart/items/bulk', {
      items,
    });

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to add items to cart');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to add items to cart');
  }
};

/**
 * Update multiple cart items at once
 * @param updates - Array of item updates
 * @returns Updated cart
 */
export const updateMultipleCartItems = async (
  updates: Array<{ itemId: string; quantity: number }>
): Promise<CartResponse> => {
  try {
    const response = await apiClient.put<ApiResponse<CartResponse>>('/cart/items/bulk', {
      updates,
    });

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to update cart items');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update cart items');
  }
};

/**
 * Calculate shipping cost for cart
 * @param addressId - Shipping address ID
 * @returns Shipping cost
 */
export const calculateShipping = async (addressId: string): Promise<{ shipping: number }> => {
  try {
    const response = await apiClient.post<ApiResponse<{ shipping: number }>>(
      '/cart/calculate-shipping',
      { addressId }
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to calculate shipping');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to calculate shipping');
  }
};

/**
 * Get available coupons for cart
 * @returns List of applicable coupons
 */
export const getAvailableCoupons = async (): Promise<
  Array<{
    code: string;
    description: string;
    discount: number;
    discountType: 'percentage' | 'fixed';
    minPurchase?: number;
    maxDiscount?: number;
    expiryDate?: string;
  }>
> => {
  try {
    const response = await apiClient.get<
      ApiResponse<
        Array<{
          code: string;
          description: string;
          discount: number;
          discountType: 'percentage' | 'fixed';
          minPurchase?: number;
          maxDiscount?: number;
          expiryDate?: string;
        }>
      >
    >('/cart/coupons/available');

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    return [];
  } catch (error: any) {
    console.error('Failed to get available coupons:', error);
    return [];
  }
};

/**
 * Save cart for later (wishlist-like feature)
 * @returns Success status
 */
export const saveCartForLater = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.post<ApiResponse>('/cart/save-for-later');

    if (response.data.success) {
      return {
        success: true,
        message: response.data.message || 'Cart saved for later',
      };
    }

    throw new Error(response.data.message || 'Failed to save cart');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to save cart');
  }
};

/**
 * Restore previously saved cart
 * @returns Restored cart
 */
export const restoreSavedCart = async (): Promise<CartResponse> => {
  try {
    const response = await apiClient.post<ApiResponse<CartResponse>>('/cart/restore');

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to restore cart');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to restore cart');
  }
};

export default {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  applyCoupon,
  removeCoupon,
  clearCart,
  validateCart,
  getCartItemCount,
  syncCart,
  addMultipleToCart,
  updateMultipleCartItems,
  calculateShipping,
  getAvailableCoupons,
  saveCartForLater,
  restoreSavedCart,
};
