/**
 * Reviews API Module
 *
 * API methods for product reviews and ratings.
 */

import { apiClient } from './client';

export interface ReviewAuthor {
  id: string;
  name: string;
}

export interface Review {
  id: string;
  rating: number;
  title?: string;
  comment?: string;
  isVerified: boolean;
  helpfulCount: number;
  createdAt: string;
  author: ReviewAuthor;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface ReviewsResponse {
  reviews: Review[];
  stats: ReviewStats;
  pagination: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateReviewRequest {
  productId: string;
  rating: number;
  title?: string;
  comment?: string;
}

export interface UpdateReviewRequest {
  rating?: number;
  title?: string;
  comment?: string;
}

export interface QueryReviewParams {
  page?: number;
  size?: number;
  rating?: number;
  sortBy?: 'recent' | 'helpful' | 'rating_high' | 'rating_low';
}

export interface UserReview {
  id: string;
  rating: number;
  title?: string;
  comment?: string;
  isVerified: boolean;
  helpfulCount: number;
  status: string;
  createdAt: string;
  product: {
    id: string;
    name: string;
    slug: string;
    image: string;
  };
}

export const reviewsApi = {
  /**
   * Get reviews for a product
   */
  getProductReviews: async (
    productId: string,
    params?: QueryReviewParams,
  ): Promise<ReviewsResponse> => {
    return apiClient.get<ReviewsResponse>(`/api/reviews/product/${productId}`, {
      params,
    });
  },

  /**
   * Get rating statistics for a product
   */
  getProductRatingStats: async (productId: string): Promise<ReviewStats> => {
    return apiClient.get<ReviewStats>(`/api/reviews/product/${productId}/stats`);
  },

  /**
   * Submit a review
   */
  create: async (data: CreateReviewRequest): Promise<Review> => {
    return apiClient.post<Review>('/api/reviews', data);
  },

  /**
   * Update a review
   */
  update: async (reviewId: string, data: UpdateReviewRequest): Promise<Review> => {
    return apiClient.patch<Review>(`/api/reviews/${reviewId}`, data);
  },

  /**
   * Delete a review
   */
  delete: async (reviewId: string): Promise<{ message: string }> => {
    return apiClient.delete(`/api/reviews/${reviewId}`);
  },

  /**
   * Mark review as helpful (toggle)
   */
  markHelpful: async (
    reviewId: string,
  ): Promise<{ helpful: boolean; helpfulCount: number }> => {
    return apiClient.post(`/api/reviews/${reviewId}/helpful`);
  },

  /**
   * Get user's reviews
   */
  getUserReviews: async (): Promise<UserReview[]> => {
    return apiClient.get<UserReview[]>('/api/reviews/user');
  },
};

export default reviewsApi;
