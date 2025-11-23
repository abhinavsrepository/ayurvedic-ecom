/**
 * ML Recommendations React Query Hooks
 *
 * Provides hooks for ML-powered product recommendations including:
 * - User-based recommendations
 * - Similar product recommendations
 * - Dosha-based recommendations
 *
 * Integrates with product service and ML recommendation endpoints.
 */

import { useQuery } from '@tanstack/react-query';
import { recommendationKeys, productKeys } from '../lib/constants/queryKeys';
import * as productService from '../services/api/productService';
import { DoshaType } from '../types';

/**
 * Hook for fetching personalized user recommendations
 * Uses collaborative filtering and user behavior
 *
 * @param userId - User ID (optional, uses guest recommendations if not provided)
 * @example
 * ```tsx
 * const { data: recommendations } = useUserRecommendations('user-123');
 * ```
 */
export const useUserRecommendations = (userId?: string) => {
  return useQuery({
    queryKey: recommendationKeys.personalized(userId),
    queryFn: () =>
      productService.getRecommendedProducts({
        limit: 10,
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook for fetching similar products
 * Uses content-based filtering based on product attributes
 *
 * @param productId - Product ID to find similar products for
 * @param limit - Maximum number of recommendations
 * @example
 * ```tsx
 * const { data: similar } = useSimilarProducts('prod-123', 6);
 * ```
 */
export const useSimilarProducts = (productId: string, limit: number = 6) => {
  return useQuery({
    queryKey: recommendationKeys.similar(productId),
    queryFn: () =>
      productService.getRecommendedProducts({
        productId,
        limit,
      }),
    enabled: !!productId,
    staleTime: 10 * 60 * 1000, // 10 minutes - similar products don't change often
  });
};

/**
 * Hook for fetching dosha-based recommendations
 * Recommends products based on Ayurvedic dosha type
 *
 * @param doshaType - Dosha type (Vata, Pitta, Kapha, Tridosha)
 * @param limit - Maximum number of recommendations
 * @example
 * ```tsx
 * const { data: doshaProducts } = useDoshaRecommendations('Vata', 10);
 * ```
 */
export const useDoshaRecommendations = (
  doshaType: DoshaType,
  limit: number = 10
) => {
  return useQuery({
    queryKey: recommendationKeys.doshaBased(doshaType),
    queryFn: () =>
      productService.getProductsByDosha(doshaType, {
        limit,
      }),
    enabled: !!doshaType,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

/**
 * Hook for fetching content-based recommendations
 * Uses product features and attributes for recommendations
 *
 * @param productId - Product ID
 * @example
 * ```tsx
 * const { data: contentBased } = useContentBasedRecommendations('prod-123');
 * ```
 */
export const useContentBasedRecommendations = (productId: string) => {
  return useQuery({
    queryKey: recommendationKeys.contentBased(productId),
    queryFn: () => productService.getRelatedProducts(productId, 6),
    enabled: !!productId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook for fetching collaborative filtering recommendations
 * Recommends based on what similar users liked
 *
 * @example
 * ```tsx
 * const { data: collaborative } = useCollaborativeRecommendations();
 * ```
 */
export const useCollaborativeRecommendations = () => {
  return useQuery({
    queryKey: recommendationKeys.collaborative(),
    queryFn: () =>
      productService.getRecommendedProducts({
        limit: 10,
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for fetching hybrid recommendations
 * Combines collaborative and content-based filtering
 *
 * @example
 * ```tsx
 * const { data: hybrid } = useHybridRecommendations();
 * ```
 */
export const useHybridRecommendations = () => {
  return useQuery({
    queryKey: recommendationKeys.hybrid(),
    queryFn: () =>
      productService.getRecommendedProducts({
        limit: 12,
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for fetching trending products
 * Shows currently popular products based on views and sales
 *
 * @param limit - Maximum number of trending products
 * @example
 * ```tsx
 * const { data: trending } = useTrendingProducts(10);
 * ```
 */
export const useTrendingProducts = (limit: number = 10) => {
  return useQuery({
    queryKey: recommendationKeys.trending(),
    queryFn: () => productService.getBestSellers(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook for fetching "For You" personalized recommendations
 * Combines multiple recommendation strategies for best results
 *
 * @example
 * ```tsx
 * const { data: forYou } = useForYouRecommendations();
 * ```
 */
export const useForYouRecommendations = () => {
  return useQuery({
    queryKey: recommendationKeys.forYou(),
    queryFn: () =>
      productService.getRecommendedProducts({
        limit: 15,
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for fetching recommendations based on user's recent views
 * Tracks viewing history and suggests related products
 *
 * @param recentlyViewedIds - Array of recently viewed product IDs
 * @example
 * ```tsx
 * const { data: recommendations } = useRecentlyViewedRecommendations([
 *   'prod-1',
 *   'prod-2'
 * ]);
 * ```
 */
export const useRecentlyViewedRecommendations = (recentlyViewedIds: string[]) => {
  return useQuery({
    queryKey: [...recommendationKeys.all, 'recently-viewed', recentlyViewedIds],
    queryFn: async () => {
      if (recentlyViewedIds.length === 0) return [];

      // Get recommendations based on most recently viewed product
      const latestProductId = recentlyViewedIds[0];
      return productService.getRelatedProducts(latestProductId, 6);
    },
    enabled: recentlyViewedIds.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for fetching recommendations based on cart items
 * Suggests complementary products based on what's in the cart
 *
 * @param cartProductIds - Array of product IDs in cart
 * @example
 * ```tsx
 * const { data: recommendations } = useCartBasedRecommendations([
 *   'prod-1',
 *   'prod-2'
 * ]);
 * ```
 */
export const useCartBasedRecommendations = (cartProductIds: string[]) => {
  return useQuery({
    queryKey: [...recommendationKeys.all, 'cart-based', cartProductIds],
    queryFn: async () => {
      if (cartProductIds.length === 0) return [];

      // Get complementary products for items in cart
      const recommendations = await Promise.all(
        cartProductIds.slice(0, 2).map((id) => productService.getRelatedProducts(id, 3))
      );

      // Flatten and deduplicate
      const allRecommendations = recommendations.flat();
      const uniqueRecommendations = allRecommendations.filter(
        (product, index, self) =>
          index === self.findIndex((p) => p.id === product.id) &&
          !cartProductIds.includes(product.id)
      );

      return uniqueRecommendations.slice(0, 6);
    },
    enabled: cartProductIds.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
