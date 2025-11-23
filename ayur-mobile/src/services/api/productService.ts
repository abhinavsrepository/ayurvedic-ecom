/**
 * Product Service
 * Handles all product-related API calls
 */

import apiClient, { ApiResponse } from './apiClient';
import { Product, ProductFilters, ProductReview, CategoryType, DoshaType } from '../../types';

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Product query parameters
 */
export interface ProductQueryParams extends PaginationParams {
  category?: CategoryType;
  doshaType?: DoshaType;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  sortBy?: 'price-low' | 'price-high' | 'rating' | 'popular' | 'newest';
  search?: string;
  tags?: string[];
  featured?: boolean;
  bestSeller?: boolean;
}

/**
 * Category with product count
 */
export interface CategoryWithCount {
  name: CategoryType;
  count: number;
  icon?: string;
  description?: string;
}

/**
 * Product recommendation params
 */
export interface RecommendationParams {
  productId?: string;
  doshaType?: DoshaType;
  limit?: number;
}

/**
 * Get products with filters and pagination
 * @param params - Query parameters including filters and pagination
 * @returns Paginated list of products
 */
export const getProducts = async (
  params?: ProductQueryParams
): Promise<PaginatedResponse<Product>> => {
  try {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Product>>>('/products', {
      params,
    });

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to fetch products');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch products');
  }
};

/**
 * Get single product by ID
 * @param id - Product ID
 * @returns Product details
 */
export const getProduct = async (id: string): Promise<Product> => {
  try {
    const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to fetch product');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch product');
  }
};

/**
 * Get product by slug
 * @param slug - Product slug
 * @returns Product details
 */
export const getProductBySlug = async (slug: string): Promise<Product> => {
  try {
    const response = await apiClient.get<ApiResponse<Product>>(`/products/slug/${slug}`);

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to fetch product');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch product');
  }
};

/**
 * Search products
 * @param query - Search query string
 * @param params - Additional query parameters
 * @returns Paginated list of products matching search
 */
export const searchProducts = async (
  query: string,
  params?: PaginationParams
): Promise<PaginatedResponse<Product>> => {
  try {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Product>>>(
      '/products/search',
      {
        params: {
          q: query,
          ...params,
        },
      }
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Search failed');
  } catch (error: any) {
    throw new Error(error.message || 'Search failed');
  }
};

/**
 * Get all product categories with counts
 * @returns List of categories with product counts
 */
export const getCategories = async (): Promise<CategoryWithCount[]> => {
  try {
    const response = await apiClient.get<ApiResponse<CategoryWithCount[]>>('/products/categories');

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to fetch categories');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch categories');
  }
};

/**
 * Get featured products
 * @param limit - Maximum number of products to return
 * @returns List of featured products
 */
export const getFeaturedProducts = async (limit: number = 10): Promise<Product[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Product[]>>('/products/featured', {
      params: { limit },
    });

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to fetch featured products');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch featured products');
  }
};

/**
 * Get best seller products
 * @param limit - Maximum number of products to return
 * @returns List of best selling products
 */
export const getBestSellers = async (limit: number = 10): Promise<Product[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Product[]>>('/products/best-sellers', {
      params: { limit },
    });

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to fetch best sellers');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch best sellers');
  }
};

/**
 * Get new arrivals
 * @param limit - Maximum number of products to return
 * @returns List of new products
 */
export const getNewArrivals = async (limit: number = 10): Promise<Product[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Product[]>>('/products/new-arrivals', {
      params: { limit },
    });

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to fetch new arrivals');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch new arrivals');
  }
};

/**
 * Get products by dosha type
 * @param doshaType - Dosha type (Vata, Pitta, Kapha, Tridosha)
 * @param params - Additional query parameters
 * @returns Paginated list of products for dosha type
 */
export const getProductsByDosha = async (
  doshaType: DoshaType,
  params?: PaginationParams
): Promise<PaginatedResponse<Product>> => {
  try {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Product>>>(
      `/products/dosha/${doshaType}`,
      { params }
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to fetch products by dosha');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch products by dosha');
  }
};

/**
 * Get related products
 * @param productId - Product ID to get related products for
 * @param limit - Maximum number of products to return
 * @returns List of related products
 */
export const getRelatedProducts = async (productId: string, limit: number = 6): Promise<Product[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Product[]>>(
      `/products/${productId}/related`,
      { params: { limit } }
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to fetch related products');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch related products');
  }
};

/**
 * Get product recommendations (ML-powered)
 * @param params - Recommendation parameters
 * @returns List of recommended products
 */
export const getRecommendedProducts = async (
  params?: RecommendationParams
): Promise<Product[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Product[]>>('/products/recommendations', {
      params,
    });

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to fetch recommendations');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch recommendations');
  }
};

/**
 * Get product reviews
 * @param productId - Product ID
 * @param params - Pagination parameters
 * @returns Paginated list of product reviews
 */
export const getProductReviews = async (
  productId: string,
  params?: PaginationParams
): Promise<PaginatedResponse<ProductReview>> => {
  try {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<ProductReview>>>(
      `/products/${productId}/reviews`,
      { params }
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to fetch reviews');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch reviews');
  }
};

/**
 * Add product review
 * @param productId - Product ID
 * @param rating - Rating (1-5)
 * @param comment - Review comment
 * @returns Created review
 */
export const addProductReview = async (
  productId: string,
  rating: number,
  comment: string
): Promise<ProductReview> => {
  try {
    const response = await apiClient.post<ApiResponse<ProductReview>>(
      `/products/${productId}/reviews`,
      { rating, comment }
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to add review');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to add review');
  }
};

/**
 * Update product review
 * @param productId - Product ID
 * @param reviewId - Review ID
 * @param rating - Updated rating
 * @param comment - Updated comment
 * @returns Updated review
 */
export const updateProductReview = async (
  productId: string,
  reviewId: string,
  rating: number,
  comment: string
): Promise<ProductReview> => {
  try {
    const response = await apiClient.put<ApiResponse<ProductReview>>(
      `/products/${productId}/reviews/${reviewId}`,
      { rating, comment }
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to update review');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update review');
  }
};

/**
 * Delete product review
 * @param productId - Product ID
 * @param reviewId - Review ID
 * @returns Success status
 */
export const deleteProductReview = async (
  productId: string,
  reviewId: string
): Promise<{ success: boolean }> => {
  try {
    const response = await apiClient.delete<ApiResponse>(
      `/products/${productId}/reviews/${reviewId}`
    );

    if (response.data.success) {
      return { success: true };
    }

    throw new Error(response.data.message || 'Failed to delete review');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to delete review');
  }
};

/**
 * Mark review as helpful
 * @param productId - Product ID
 * @param reviewId - Review ID
 * @returns Success status
 */
export const markReviewHelpful = async (
  productId: string,
  reviewId: string
): Promise<{ success: boolean }> => {
  try {
    const response = await apiClient.post<ApiResponse>(
      `/products/${productId}/reviews/${reviewId}/helpful`
    );

    if (response.data.success) {
      return { success: true };
    }

    throw new Error(response.data.message || 'Failed to mark review as helpful');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to mark review as helpful');
  }
};

/**
 * Get product stock availability
 * @param productId - Product ID
 * @returns Stock availability information
 */
export const checkProductStock = async (
  productId: string
): Promise<{ inStock: boolean; quantity: number }> => {
  try {
    const response = await apiClient.get<ApiResponse<{ inStock: boolean; quantity: number }>>(
      `/products/${productId}/stock`
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to check stock');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to check stock');
  }
};

export default {
  getProducts,
  getProduct,
  getProductBySlug,
  searchProducts,
  getCategories,
  getFeaturedProducts,
  getBestSellers,
  getNewArrivals,
  getProductsByDosha,
  getRelatedProducts,
  getRecommendedProducts,
  getProductReviews,
  addProductReview,
  updateProductReview,
  deleteProductReview,
  markReviewHelpful,
  checkProductStock,
};
