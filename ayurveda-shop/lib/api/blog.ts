/**
 * Blog API Module
 *
 * API methods for blog posts and content.
 */

import { apiClient } from './client';

export interface BlogAuthor {
  id: string;
  name: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  featuredImage?: string;
  category?: string;
  status: string;
  viewCount: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  author: BlogAuthor;
  tags: string[];
  seo: {
    title?: string;
    description?: string;
  };
}

export interface BlogPostsResponse {
  content: BlogPost[];
  pagination: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
  };
}

export interface BlogCategory {
  name: string;
  count: number;
}

export interface BlogTag {
  name: string;
  count: number;
}

export interface QueryBlogParams {
  page?: number;
  size?: number;
  category?: string;
  tag?: string;
  search?: string;
}

export interface CreateBlogPostRequest {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  category?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface UpdateBlogPostRequest {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  featuredImage?: string;
  category?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
}

export const blogApi = {
  /**
   * Get all blog posts
   */
  getPosts: async (params?: QueryBlogParams): Promise<BlogPostsResponse> => {
    return apiClient.get<BlogPostsResponse>('/api/blog/posts', { params });
  },

  /**
   * Get a single blog post by slug
   */
  getPostBySlug: async (slug: string): Promise<BlogPost> => {
    return apiClient.get<BlogPost>(`/api/blog/posts/${slug}`);
  },

  /**
   * Get all blog categories
   */
  getCategories: async (): Promise<BlogCategory[]> => {
    return apiClient.get<BlogCategory[]>('/api/blog/categories');
  },

  /**
   * Get all blog tags
   */
  getTags: async (): Promise<BlogTag[]> => {
    return apiClient.get<BlogTag[]>('/api/blog/tags');
  },

  // Admin endpoints

  /**
   * Get all posts (Admin)
   */
  getAdminPosts: async (params?: QueryBlogParams): Promise<BlogPostsResponse> => {
    return apiClient.get<BlogPostsResponse>('/api/blog/admin/posts', { params });
  },

  /**
   * Get post by ID (Admin)
   */
  getPostById: async (id: string): Promise<BlogPost> => {
    return apiClient.get<BlogPost>(`/api/blog/admin/posts/${id}`);
  },

  /**
   * Create a blog post (Admin)
   */
  create: async (data: CreateBlogPostRequest): Promise<BlogPost> => {
    return apiClient.post<BlogPost>('/api/blog/posts', data);
  },

  /**
   * Update a blog post (Admin)
   */
  update: async (id: string, data: UpdateBlogPostRequest): Promise<BlogPost> => {
    return apiClient.put<BlogPost>(`/api/blog/posts/${id}`, data);
  },

  /**
   * Delete a blog post (Admin)
   */
  delete: async (id: string): Promise<{ message: string }> => {
    return apiClient.delete(`/api/blog/posts/${id}`);
  },
};

export default blogApi;
