/**
 * Cart React Query Hooks
 *
 * Provides hooks for all cart operations including:
 * - Get cart
 * - Add/Update/Remove items
 * - Apply/Remove coupons
 * - Cart validation
 *
 * Integrates with cartService and cartStore for seamless state management.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCartStore } from '../store/cartStore';
import { cartKeys, productKeys } from '../lib/constants/queryKeys';
import * as cartService from '../services/api/cartService';

/**
 * Hook for getting current cart
 *
 * @example
 * ```tsx
 * const { data: cart, isLoading } = useCart();
 * ```
 */
export const useCart = () => {
  return useQuery({
    queryKey: cartKeys.current(),
    queryFn: cartService.getCart,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for getting cart item count
 *
 * @example
 * ```tsx
 * const { data: count } = useCartCount();
 * ```
 */
export const useCartCount = () => {
  return useQuery({
    queryKey: cartKeys.count(),
    queryFn: cartService.getCartItemCount,
    staleTime: 30 * 1000, // 30 seconds
  });
};

/**
 * Hook for adding item to cart
 * Includes optimistic updates for better UX
 *
 * @example
 * ```tsx
 * const { mutate: addToCart } = useAddToCart();
 *
 * addToCart({
 *   productId: 'prod-123',
 *   quantity: 2
 * });
 * ```
 */
export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const { addItem } = useCartStore();

  return useMutation({
    mutationFn: ({
      productId,
      quantity = 1,
      variant,
    }: {
      productId: string;
      quantity?: number;
      variant?: string;
    }) => cartService.addToCart(productId, quantity, variant),
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: cartKeys.current() });

      // Snapshot previous value
      const previousCart = queryClient.getQueryData(cartKeys.current());

      // Optimistically update cart in store
      const product = queryClient.getQueryData(productKeys.detail(variables.productId));
      if (product) {
        addItem({
          id: variables.productId,
          productId: variables.productId,
          name: (product as any).name,
          image: (product as any).thumbnail,
          price: (product as any).price,
          quantity: variables.quantity,
        });
      }

      return { previousCart };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.current(), context.previousCart);
      }
    },
    onSuccess: (data) => {
      // Update query cache with server response
      queryClient.setQueryData(cartKeys.current(), data);
      queryClient.invalidateQueries({ queryKey: cartKeys.count() });
    },
    onSettled: () => {
      // Always refetch after mutation
      queryClient.invalidateQueries({ queryKey: cartKeys.current() });
    },
  });
};

/**
 * Hook for updating cart item quantity
 *
 * @example
 * ```tsx
 * const { mutate: updateItem } = useUpdateCartItem();
 *
 * updateItem({ itemId: 'item-123', quantity: 3 });
 * ```
 */
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  const { updateQuantity } = useCartStore();

  return useMutation({
    mutationFn: ({
      itemId,
      quantity,
    }: {
      itemId: string;
      quantity: number;
    }) => cartService.updateCartItem(itemId, quantity),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.current() });
      const previousCart = queryClient.getQueryData(cartKeys.current());

      // Optimistically update
      updateQuantity(variables.itemId, variables.quantity);

      return { previousCart };
    },
    onError: (error, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.current(), context.previousCart);
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(cartKeys.current(), data);
      queryClient.invalidateQueries({ queryKey: cartKeys.count() });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.current() });
    },
  });
};

/**
 * Hook for removing item from cart
 *
 * @example
 * ```tsx
 * const { mutate: removeItem } = useRemoveFromCart();
 *
 * removeItem('item-123');
 * ```
 */
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  const { removeItem } = useCartStore();

  return useMutation({
    mutationFn: (itemId: string) => cartService.removeFromCart(itemId),
    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.current() });
      const previousCart = queryClient.getQueryData(cartKeys.current());

      // Optimistically remove
      removeItem(itemId);

      return { previousCart };
    },
    onError: (error, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.current(), context.previousCart);
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(cartKeys.current(), data);
      queryClient.invalidateQueries({ queryKey: cartKeys.count() });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.current() });
    },
  });
};

/**
 * Hook for applying coupon code to cart
 *
 * @example
 * ```tsx
 * const { mutate: applyCoupon } = useApplyCoupon();
 *
 * applyCoupon('SAVE20');
 * ```
 */
export const useApplyCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) => cartService.applyCoupon(code),
    onSuccess: (data) => {
      queryClient.setQueryData(cartKeys.current(), data);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.current() });
    },
  });
};

/**
 * Hook for removing coupon from cart
 *
 * @example
 * ```tsx
 * const { mutate: removeCoupon } = useRemoveCoupon();
 *
 * removeCoupon();
 * ```
 */
export const useRemoveCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartService.removeCoupon,
    onSuccess: (data) => {
      queryClient.setQueryData(cartKeys.current(), data);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.current() });
    },
  });
};

/**
 * Hook for clearing entire cart
 *
 * @example
 * ```tsx
 * const { mutate: clearCart } = useClearCart();
 *
 * clearCart();
 * ```
 */
export const useClearCart = () => {
  const queryClient = useQueryClient();
  const { clearCart: clearStoreCart } = useCartStore();

  return useMutation({
    mutationFn: cartService.clearCart,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: cartKeys.current() });
      const previousCart = queryClient.getQueryData(cartKeys.current());

      // Optimistically clear
      clearStoreCart();

      return { previousCart };
    },
    onError: (error, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.current(), context.previousCart);
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(cartKeys.current(), data);
      queryClient.invalidateQueries({ queryKey: cartKeys.count() });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.current() });
      queryClient.invalidateQueries({ queryKey: cartKeys.count() });
    },
  });
};

/**
 * Hook for validating cart items (stock, pricing)
 *
 * @example
 * ```tsx
 * const { data: validation } = useValidateCart();
 *
 * if (!validation?.valid) {
 *   console.log('Cart has issues:', validation?.issues);
 * }
 * ```
 */
export const useValidateCart = () => {
  return useQuery({
    queryKey: cartKeys.validation(),
    queryFn: cartService.validateCart,
    staleTime: 30 * 1000, // 30 seconds
    enabled: false, // Manual trigger only
  });
};

/**
 * Hook for getting available coupons
 *
 * @example
 * ```tsx
 * const { data: coupons } = useAvailableCoupons();
 * ```
 */
export const useAvailableCoupons = () => {
  return useQuery({
    queryKey: [...cartKeys.all, 'available-coupons'],
    queryFn: cartService.getAvailableCoupons,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for syncing local cart with server
 * Used when user logs in
 *
 * @example
 * ```tsx
 * const { mutate: syncCart } = useSyncCart();
 *
 * syncCart(localCartItems);
 * ```
 */
export const useSyncCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (localCartItems: cartService.CartItemWithId[]) =>
      cartService.syncCart(localCartItems),
    onSuccess: (data) => {
      queryClient.setQueryData(cartKeys.current(), data);
      queryClient.invalidateQueries({ queryKey: cartKeys.count() });
    },
  });
};

/**
 * Hook for calculating shipping cost
 *
 * @param addressId - Shipping address ID
 * @example
 * ```tsx
 * const { data: shipping } = useCalculateShipping('address-123');
 * ```
 */
export const useCalculateShipping = (addressId: string) => {
  return useQuery({
    queryKey: [...cartKeys.all, 'shipping', addressId],
    queryFn: () => cartService.calculateShipping(addressId),
    enabled: !!addressId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
