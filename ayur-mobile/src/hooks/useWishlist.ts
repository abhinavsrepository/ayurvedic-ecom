/**
 * Wishlist React Query Hooks
 *
 * Provides hooks for all wishlist operations including:
 * - Fetching wishlist
 * - Adding/Removing items
 * - Clearing wishlist
 *
 * Integrates with userService and wishlistStore for seamless state management.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useWishlistStore } from '../store/wishlistStore';
import { wishlistKeys, productKeys } from '../lib/constants/queryKeys';
import * as userService from '../services/api/userService';

/**
 * Hook for fetching wishlist items
 *
 * @example
 * ```tsx
 * const { data: wishlist, isLoading } = useWishlist();
 * ```
 */
export const useWishlist = () => {
  return useQuery({
    queryKey: wishlistKeys.items(),
    queryFn: userService.getWishlist,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook for adding item to wishlist
 * Includes optimistic updates
 *
 * @example
 * ```tsx
 * const { mutate: addToWishlist } = useAddToWishlist();
 *
 * addToWishlist('prod-123');
 * ```
 */
export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  const { addToWishlist: addToStore } = useWishlistStore();

  return useMutation({
    mutationFn: (productId: string) => userService.addToWishlist(productId),
    onMutate: async (productId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: wishlistKeys.items() });

      // Snapshot previous value
      const previousWishlist = queryClient.getQueryData(wishlistKeys.items());

      // Optimistically update
      const product = queryClient.getQueryData(productKeys.detail(productId));
      if (product) {
        addToStore({
          id: productId,
          productId,
          name: (product as any).name,
          image: (product as any).thumbnail,
          price: (product as any).price,
          inStock: (product as any).inStock,
        });
      }

      return { previousWishlist };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousWishlist) {
        queryClient.setQueryData(wishlistKeys.items(), context.previousWishlist);
      }
    },
    onSuccess: () => {
      // Invalidate wishlist queries
      queryClient.invalidateQueries({ queryKey: wishlistKeys.items() });
      queryClient.invalidateQueries({ queryKey: wishlistKeys.count() });
    },
  });
};

/**
 * Hook for removing item from wishlist
 * Includes optimistic updates
 *
 * @example
 * ```tsx
 * const { mutate: removeFromWishlist } = useRemoveFromWishlist();
 *
 * removeFromWishlist('prod-123');
 * ```
 */
export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  const { removeFromWishlist: removeFromStore } = useWishlistStore();

  return useMutation({
    mutationFn: (productId: string) => userService.removeFromWishlist(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: wishlistKeys.items() });
      const previousWishlist = queryClient.getQueryData(wishlistKeys.items());

      // Optimistically remove
      removeFromStore(productId);

      return { previousWishlist };
    },
    onError: (error, variables, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData(wishlistKeys.items(), context.previousWishlist);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.items() });
      queryClient.invalidateQueries({ queryKey: wishlistKeys.count() });
    },
  });
};

/**
 * Hook for toggling item in wishlist
 * Adds if not present, removes if present
 *
 * @example
 * ```tsx
 * const { mutate: toggleWishlist } = useToggleWishlist();
 *
 * toggleWishlist('prod-123');
 * ```
 */
export const useToggleWishlist = () => {
  const { isInWishlist } = useWishlistStore();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  return {
    mutate: (productId: string) => {
      if (isInWishlist(productId)) {
        removeFromWishlist.mutate(productId);
      } else {
        addToWishlist.mutate(productId);
      }
    },
    isPending: addToWishlist.isPending || removeFromWishlist.isPending,
  };
};

/**
 * Hook for clearing entire wishlist
 *
 * @example
 * ```tsx
 * const { mutate: clearWishlist } = useClearWishlist();
 *
 * clearWishlist();
 * ```
 */
export const useClearWishlist = () => {
  const queryClient = useQueryClient();
  const { clearWishlist: clearStore } = useWishlistStore();

  return useMutation({
    mutationFn: userService.clearWishlist,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: wishlistKeys.items() });
      const previousWishlist = queryClient.getQueryData(wishlistKeys.items());

      // Optimistically clear
      clearStore();

      return { previousWishlist };
    },
    onError: (error, variables, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData(wishlistKeys.items(), context.previousWishlist);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.items() });
      queryClient.invalidateQueries({ queryKey: wishlistKeys.count() });
    },
  });
};

/**
 * Hook for checking if product is in wishlist
 *
 * @param productId - Product ID to check
 * @example
 * ```tsx
 * const { data: isInWishlist } = useIsInWishlist('prod-123');
 * ```
 */
export const useIsInWishlist = (productId: string) => {
  return useQuery({
    queryKey: wishlistKeys.contains(productId),
    queryFn: () => userService.isInWishlist(productId),
    enabled: !!productId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

/**
 * Hook for getting wishlist count
 *
 * @example
 * ```tsx
 * const { data: count } = useWishlistCount();
 * ```
 */
export const useWishlistCount = () => {
  const { itemCount } = useWishlistStore();

  return useQuery({
    queryKey: wishlistKeys.count(),
    queryFn: async () => {
      // Return count from store
      return itemCount;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    initialData: itemCount,
  });
};
