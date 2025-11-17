/**
 * Cache Keys and TTL Constants
 *
 * Centralized cache key management for consistency and easy maintenance.
 */

// Cache TTL (Time To Live) in seconds
export const CACHE_TTL = {
  // Short-lived cache (5 minutes)
  SHORT: 300,

  // Medium cache (30 minutes)
  MEDIUM: 1800,

  // Long cache (1 hour)
  LONG: 3600,

  // Extra long cache (6 hours)
  EXTRA_LONG: 21600,

  // Daily cache (24 hours)
  DAILY: 86400,
};

// Cache key prefixes
export const CACHE_KEYS = {
  // Products
  PRODUCT_BY_ID: (id: string) => `product:id:${id}`,
  PRODUCT_BY_SLUG: (slug: string) => `product:slug:${slug}`,
  PRODUCTS_LIST: (page: number, size: number, filter: string = '') =>
    `products:list:${page}:${size}:${filter}`,
  PRODUCTS_FEATURED: 'products:featured',
  PRODUCTS_BESTSELLERS: 'products:bestsellers',
  PRODUCTS_NEW: 'products:new',
  PRODUCTS_BY_CATEGORY: (category: string, page: number, size: number) =>
    `products:category:${category}:${page}:${size}`,

  // Categories
  CATEGORY_BY_ID: (id: string) => `category:id:${id}`,
  CATEGORY_BY_SLUG: (slug: string) => `category:slug:${slug}`,
  CATEGORIES_LIST: 'categories:list',
  CATEGORIES_TREE: 'categories:tree',

  // Blog
  BLOG_POST_BY_ID: (id: string) => `blog:id:${id}`,
  BLOG_POST_BY_SLUG: (slug: string) => `blog:slug:${slug}`,
  BLOG_POSTS_LIST: (page: number, size: number) => `blog:list:${page}:${size}`,
  BLOG_POSTS_FEATURED: 'blog:featured',

  // Search
  SEARCH_QUERY: (query: string, page: number, size: number) =>
    `search:${query}:${page}:${size}`,
  SEARCH_SUGGESTIONS: (query: string) => `search:suggestions:${query}`,

  // ML/Recommendations
  ML_RECOMMENDATIONS_USER: (userId: string) => `ml:recommendations:user:${userId}`,
  ML_RECOMMENDATIONS_PRODUCT: (productId: string) =>
    `ml:recommendations:product:${productId}`,
  ML_SIMILAR_PRODUCTS: (productId: string) => `ml:similar:${productId}`,

  // Statistics
  STATS_POPULAR_PRODUCTS: 'stats:popular:products',
  STATS_TOP_CATEGORIES: 'stats:top:categories',
  STATS_TRENDING: 'stats:trending',

  // SEO
  SEO_SITEMAP: 'seo:sitemap',
  SEO_ROBOTS: 'seo:robots',

  // User/Session
  USER_CART: (userId: string) => `user:cart:${userId}`,
  USER_WISHLIST: (userId: string) => `user:wishlist:${userId}`,
  USER_PROFILE: (userId: string) => `user:profile:${userId}`,
};

// Patterns for bulk deletion
export const CACHE_PATTERNS = {
  ALL_PRODUCTS: 'products:*',
  ALL_CATEGORIES: 'categories:*',
  ALL_BLOG: 'blog:*',
  ALL_SEARCH: 'search:*',
  ALL_ML: 'ml:*',
  ALL_STATS: 'stats:*',
  USER_DATA: (userId: string) => `user:*:${userId}`,
};
