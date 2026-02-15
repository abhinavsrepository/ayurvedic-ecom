/**
 * Blog API Module
 *
 * API methods for blog posts and content.
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
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
}

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
    const queryParams = new URLSearchParams();
    if (params?.page !== undefined) queryParams.append('page', String(params.page));
    // Backend has max size of 50, so we limit it
    const size = params?.size ? Math.min(params.size, 50) : 10;
    queryParams.append('size', String(size));
    if (params?.category) queryParams.append('category', params.category);
    if (params?.tag) queryParams.append('tag', params.tag);
    if (params?.search) queryParams.append('search', params.search);
    
    const url = `${API_BASE}/api/blog/posts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return fetchJson<BlogPostsResponse>(url);
  },

  /**
   * Get a single blog post by slug
   */
  getPostBySlug: async (slug: string): Promise<BlogPost> => {
    return fetchJson<BlogPost>(`${API_BASE}/api/blog/posts/${slug}`);
  },

  /**
   * Get all blog categories
   */
  getCategories: async (): Promise<BlogCategory[]> => {
    return fetchJson<BlogCategory[]>(`${API_BASE}/api/blog/categories`);
  },

  /**
   * Get all blog tags
   */
  getTags: async (): Promise<BlogTag[]> => {
    return fetchJson<BlogTag[]>(`${API_BASE}/api/blog/tags`);
  },

  // Admin endpoints

  /**
   * Get all posts (Admin)
   */
  getAdminPosts: async (params?: QueryBlogParams): Promise<BlogPostsResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page !== undefined) queryParams.append('page', String(params.page));
    if (params?.size !== undefined) queryParams.append('size', String(params.size));
    
    const url = `${API_BASE}/api/blog/admin/posts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return fetchJson<BlogPostsResponse>(url);
  },

  /**
   * Get post by ID (Admin)
   */
  getPostById: async (id: string): Promise<BlogPost> => {
    return fetchJson<BlogPost>(`${API_BASE}/api/blog/admin/posts/${id}`);
  },

  /**
   * Create a blog post (Admin)
   */
  create: async (data: CreateBlogPostRequest): Promise<BlogPost> => {
    return fetchJson<BlogPost>(`${API_BASE}/api/blog/posts`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update a blog post (Admin)
   */
  update: async (id: string, data: UpdateBlogPostRequest): Promise<BlogPost> => {
    return fetchJson<BlogPost>(`${API_BASE}/api/blog/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete a blog post (Admin)
   */
  delete: async (id: string): Promise<{ message: string }> => {
    return fetchJson<{ message: string }>(`${API_BASE}/api/blog/posts/${id}`, {
      method: 'DELETE',
    });
  },
};

export default blogApi;
