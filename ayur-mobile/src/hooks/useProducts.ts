/**
 * Products React Query Hooks
 *
 * Provides hooks for all product-related operations including:
 * - Product listing with filters and pagination
 * - Single product details
 * - Product search
 * - Featured and best seller products
 * - Product reviews
 *
 * Integrates with productService for API calls and proper caching.
 */

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { productKeys } from '../lib/constants/queryKeys';
import * as productService from '../services/api/productService';
import { Product, ProductFilters, DoshaType } from '../types';

/**
 * Hook for fetching products with filters and pagination
 *
 * @param params - Query parameters including filters
 * @example
 * ```tsx
 * const { data, isLoading } = useProducts({ category: 'Oils', page: 1 });
 * ```
 */
export const useProducts = (params?: productService.ProductQueryParams) => {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productService.getProducts(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for fetching single product by ID
 *
 * @param id - Product ID
 * @param options - Query options
 * @example
 * ```tsx
 * const { data: product } = useProduct('prod-123');
 * ```
 */
export const useProduct = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.getProduct(id),
    enabled: !!id && (options?.enabled ?? true),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook for fetching product by slug
 *
 * @param slug - Product slug
 * @example
 * ```tsx
 * const { data: product } = useProductBySlug('ashwagandha-powder');
 * ```
 */
export const useProductBySlug = (slug: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: [...productKeys.all, 'slug', slug],
    queryFn: () => productService.getProductBySlug(slug),
    enabled: !!slug && (options?.enabled ?? true),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for searching products
 *
 * @param query - Search query string
 * @param params - Additional parameters
 * @example
 * ```tsx
 * const { data: results } = useSearchProducts('ashwagandha');
 * ```
 */
export const useSearchProducts = (
  query: string,
  params?: productService.PaginationParams,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: productKeys.search(query),
    queryFn: () => productService.searchProducts(query, params),
    enabled: !!query && query.length >= 2 && (options?.enabled ?? true),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

/**
 * Hook for fetching featured products
 *
 * @param limit - Maximum number of products
 * @example
 * ```tsx
 * const { data: featured } = useFeaturedProducts(10);
 * ```
 */
export const useFeaturedProducts = (limit: number = 10) => {
  return useQuery({
    queryKey: productKeys.featured(),
    queryFn: () => productService.getFeaturedProducts(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for fetching best seller products
 *
 * @param limit - Maximum number of products
 * @example
 * ```tsx
 * const { data: bestSellers } = useBestSellers(10);
 * ```
 */
export const useBestSellers = (limit: number = 10) => {
  return useQuery({
    queryKey: productKeys.bestSellers(),
    queryFn: () => productService.getBestSellers(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for fetching new arrival products
 *
 * @param limit - Maximum number of products
 * @example
 * ```tsx
 * const { data: newArrivals } = useNewArrivals(10);
 * ```
 */
export const useNewArrivals = (limit: number = 10) => {
  return useQuery({
    queryKey: productKeys.newArrivals(),
    queryFn: () => productService.getNewArrivals(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for fetching products by dosha type
 *
 * @param doshaType - Dosha type filter
 * @param params - Additional parameters
 * @example
 * ```tsx
 * const { data } = useProductsByDosha('Vata');
 * ```
 */
export const useProductsByDosha = (
  doshaType: DoshaType,
  params?: productService.PaginationParams
) => {
  return useQuery({
    queryKey: productKeys.byDosha(doshaType),
    queryFn: () => productService.getProductsByDosha(doshaType, params),
    enabled: !!doshaType,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for fetching related products
 *
 * @param productId - Product ID
 * @param limit - Maximum number of products
 * @example
 * ```tsx
 * const { data: related } = useRelatedProducts('prod-123');
 * ```
 */
export const useRelatedProducts = (productId: string, limit: number = 6) => {
  return useQuery({
    queryKey: productKeys.relatedProducts(productId),
    queryFn: () => productService.getRelatedProducts(productId, limit),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for fetching product categories
 *
 * @example
 * ```tsx
 * const { data: categories } = useCategories();
 * ```
 */
export const useCategories = () => {
  return useQuery({
    queryKey: [...productKeys.all, 'categories'],
    queryFn: productService.getCategories,
    staleTime: 30 * 60 * 1000, // 30 minutes - categories change rarely
  });
};

/**
 * Hook for fetching product reviews
 *
 * @param productId - Product ID
 * @param params - Pagination parameters
 * @example
 * ```tsx
 * const { data: reviews } = useProductReviews('prod-123');
 * ```
 */
export const useProductReviews = (
  productId: string,
  params?: productService.PaginationParams
) => {
  return useQuery({
    queryKey: productKeys.reviews(productId),
    queryFn: () => productService.getProductReviews(productId, params),
    enabled: !!productId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook for adding a product review
 *
 * @example
 * ```tsx
 * const { mutate: addReview } = useAddProductReview();
 *
 * addReview({
 *   productId: 'prod-123',
 *   rating: 5,
 *   comment: 'Great product!'
 * });
 * ```
 */
export const useAddProductReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      rating,
      comment,
    }: {
      productId: string;
      rating: number;
      comment: string;
    }) => productService.addProductReview(productId, rating, comment),
    onSuccess: (data, variables) => {
      // Invalidate product reviews to refetch
      queryClient.invalidateQueries({
        queryKey: productKeys.reviews(variables.productId),
      });
      // Invalidate product details to update rating
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(variables.productId),
      });
    },
  });
};

/**
 * Hook for updating a product review
 *
 * @example
 * ```tsx
 * const { mutate: updateReview } = useUpdateProductReview();
 *
 * updateReview({
 *   productId: 'prod-123',
 *   reviewId: 'review-456',
 *   rating: 4,
 *   comment: 'Updated review'
 * });
 * ```
 */
export const useUpdateProductReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      reviewId,
      rating,
      comment,
    }: {
      productId: string;
      reviewId: string;
      rating: number;
      comment: string;
    }) => productService.updateProductReview(productId, reviewId, rating, comment),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: productKeys.reviews(variables.productId),
      });
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(variables.productId),
      });
    },
  });
};

/**
 * Hook for deleting a product review
 *
 * @example
 * ```tsx
 * const { mutate: deleteReview } = useDeleteProductReview();
 *
 * deleteReview({ productId: 'prod-123', reviewId: 'review-456' });
 * ```
 */
export const useDeleteProductReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      reviewId,
    }: {
      productId: string;
      reviewId: string;
    }) => productService.deleteProductReview(productId, reviewId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: productKeys.reviews(variables.productId),
      });
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(variables.productId),
      });
    },
  });
};

/**
 * Hook for marking review as helpful
 *
 * @example
 * ```tsx
 * const { mutate: markHelpful } = useMarkReviewHelpful();
 *
 * markHelpful({ productId: 'prod-123', reviewId: 'review-456' });
 * ```
 */
export const useMarkReviewHelpful = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      reviewId,
    }: {
      productId: string;
      reviewId: string;
    }) => productService.markReviewHelpful(productId, reviewId),
    onSuccess: (data, variables) => {
      // Optimistically update the review
      queryClient.invalidateQueries({
        queryKey: productKeys.reviews(variables.productId),
      });
    },
  });
};

/**
 * Hook for checking product stock
 *
 * @param productId - Product ID
 * @example
 * ```tsx
 * const { data: stock } = useCheckProductStock('prod-123');
 * ```
 */
export const useCheckProductStock = (productId: string) => {
  return useQuery({
    queryKey: [...productKeys.detail(productId), 'stock'],
    queryFn: () => productService.checkProductStock(productId),
    enabled: !!productId,
    staleTime: 1 * 60 * 1000, // 1 minute - stock changes frequently
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

/**
 * Hook for infinite scrolling product list
 *
 * @param params - Query parameters
 * @example
 * ```tsx
 * const {
 *   data,
 *   fetchNextPage,
 *   hasNextPage,
 *   isFetchingNextPage
 * } = useInfiniteProducts({ category: 'Oils' });
 * ```
 */
export const useInfiniteProducts = (params?: Omit<productService.ProductQueryParams, 'page'>) => {
  return useInfiniteQuery({
    queryKey: [...productKeys.lists(), 'infinite', params],
    queryFn: ({ pageParam = 1 }) =>
      productService.getProducts({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.hasNext) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
