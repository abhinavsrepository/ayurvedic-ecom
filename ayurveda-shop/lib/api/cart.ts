/**
 * Cart API Module
 *
 * API methods for cart management.
 */

import { apiClient } from './client';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  variantId?: string;
  lineTotal: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  updatedAt: string;
}

export interface CartSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
  freeShippingThreshold: number;
  amountToFreeShipping: number;
}

export interface AddCartItemRequest {
  productId: string;
  quantity: number;
  variantId?: string;
}

// Helper to check if productId is a valid UUID format
// Backend requires UUID, but mock products use simple numeric IDs
export const isValidUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface MergeCartRequest {
  sessionId: string;
}

// Get or generate session ID for guest cart
export const getSessionId = (): string => {
  if (typeof window === 'undefined') return '';

  let sessionId = localStorage.getItem('cart_session_id');
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('cart_session_id', sessionId);
  }
  return sessionId;
};

export const cartApi = {
  /**
   * Get current cart
   */
  getCart: async (): Promise<Cart> => {
    const sessionId = getSessionId();
    return apiClient.get<Cart>('/api/cart', {
      headers: { 'x-session-id': sessionId },
    });
  },

  /**
   * Add item to cart
   */
  addItem: async (data: AddCartItemRequest): Promise<Cart> => {
    const sessionId = getSessionId();
    return apiClient.post<Cart>('/api/cart/items', data, {
      headers: { 'x-session-id': sessionId },
    });
  },

  /**
   * Update cart item quantity
   */
  updateItem: async (itemId: string, data: UpdateCartItemRequest): Promise<Cart> => {
    const sessionId = getSessionId();
    return apiClient.patch<Cart>(`/api/cart/items/${itemId}`, data, {
      headers: { 'x-session-id': sessionId },
    });
  },

  /**
   * Remove item from cart
   */
  removeItem: async (itemId: string): Promise<Cart> => {
    const sessionId = getSessionId();
    return apiClient.delete<Cart>(`/api/cart/items/${itemId}`, {
      headers: { 'x-session-id': sessionId },
    });
  },

  /**
   * Clear entire cart
   */
  clearCart: async (): Promise<Cart> => {
    const sessionId = getSessionId();
    return apiClient.delete<Cart>('/api/cart', {
      headers: { 'x-session-id': sessionId },
    });
  },

  /**
   * Merge guest cart into user cart after login
   */
  mergeCart: async (): Promise<Cart> => {
    const sessionId = getSessionId();
    return apiClient.post<Cart>('/api/cart/merge', { sessionId });
  },

  /**
   * Get cart summary with totals
   */
  getSummary: async (): Promise<CartSummary> => {
    const sessionId = getSessionId();
    return apiClient.get<CartSummary>('/api/cart/summary', {
      headers: { 'x-session-id': sessionId },
    });
  },
};

export default cartApi;
