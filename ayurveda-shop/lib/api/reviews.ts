/**
 * Reviews API Module
 *
 * API methods for product reviews and ratings.
 */

// Use relative URLs for client-side calls to go through Next.js API routes
const API_BASE = '';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `API error: ${response.status}`);
  }
  
  return response.json();
}

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
    const queryParams = new URLSearchParams();
    if (params?.page !== undefined) queryParams.append('page', String(params.page));
    if (params?.size !== undefined) queryParams.append('size', String(params.size));
    if (params?.rating) queryParams.append('rating', String(params.rating));
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    
    const url = `${API_BASE}/api/reviews/product/${productId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return fetchJson<ReviewsResponse>(url);
  },

  /**
   * Get rating statistics for a product
   */
  getProductRatingStats: async (productId: string): Promise<ReviewStats> => {
    return fetchJson<ReviewStats>(`${API_BASE}/api/reviews/product/${productId}/stats`);
  },

  /**
   * Submit a review
   */
  create: async (data: CreateReviewRequest): Promise<Review> => {
    return fetchJson<Review>(`${API_BASE}/api/reviews`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update a review
   */
  update: async (reviewId: string, data: UpdateReviewRequest): Promise<Review> => {
    return fetchJson<Review>(`${API_BASE}/api/reviews/${reviewId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete a review
   */
  delete: async (reviewId: string): Promise<{ message: string }> => {
    return fetchJson<{ message: string }>(`${API_BASE}/api/reviews/${reviewId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Mark review as helpful (toggle)
   */
  markHelpful: async (
    reviewId: string,
  ): Promise<{ helpful: boolean; helpfulCount: number }> => {
    return fetchJson<{ helpful: boolean; helpfulCount: number }>(`${API_BASE}/api/reviews/${reviewId}/helpful`, {
      method: 'POST',
    });
  },

  /**
   * Get user's reviews
   */
  getUserReviews: async (): Promise<UserReview[]> => {
    return fetchJson<UserReview[]>(`${API_BASE}/api/reviews/user`);
  },
};

export default reviewsApi;
