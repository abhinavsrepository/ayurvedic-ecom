/**
 * API Endpoints Configuration
 *
 * This file contains all API endpoint configurations for the Ayurveda mobile app.
 * Endpoints are organized by service type (NestJS backend, ML service).
 */

import { Platform } from 'react-native';

// Base URLs for different environments
const NESTJS_BASE_URL = __DEV__
  ? Platform.OS === 'android'
    ? 'http://10.0.2.2:3000/api/v1'
    : 'http://localhost:3000/api/v1'
  : 'https://api.ayurveda.com/api/v1';

const ML_SERVICE_BASE_URL = __DEV__
  ? Platform.OS === 'android'
    ? 'http://10.0.2.2:5000/api'
    : 'http://localhost:5000/api'
  : 'https://ml.ayurveda.com/api';

/**
 * Authentication Endpoints
 */
export const AUTH_ENDPOINTS = {
  baseUrl: `${NESTJS_BASE_URL}/auth`,
  login: `${NESTJS_BASE_URL}/auth/login`,
  register: `${NESTJS_BASE_URL}/auth/register`,
  logout: `${NESTJS_BASE_URL}/auth/logout`,
  refreshToken: `${NESTJS_BASE_URL}/auth/refresh`,
  forgotPassword: `${NESTJS_BASE_URL}/auth/forgot-password`,
  resetPassword: `${NESTJS_BASE_URL}/auth/reset-password`,
  verifyEmail: `${NESTJS_BASE_URL}/auth/verify-email`,
  resendVerification: `${NESTJS_BASE_URL}/auth/resend-verification`,
  changePassword: `${NESTJS_BASE_URL}/auth/change-password`,
  googleAuth: `${NESTJS_BASE_URL}/auth/google`,
  appleAuth: `${NESTJS_BASE_URL}/auth/apple`,
} as const;

/**
 * User Endpoints
 */
export const USER_ENDPOINTS = {
  baseUrl: `${NESTJS_BASE_URL}/users`,
  profile: `${NESTJS_BASE_URL}/users/profile`,
  updateProfile: `${NESTJS_BASE_URL}/users/profile`,
  uploadAvatar: `${NESTJS_BASE_URL}/users/avatar`,
  deleteAvatar: `${NESTJS_BASE_URL}/users/avatar`,
  addresses: `${NESTJS_BASE_URL}/users/addresses`,
  addressById: (id: string) => `${NESTJS_BASE_URL}/users/addresses/${id}`,
  preferences: `${NESTJS_BASE_URL}/users/preferences`,
  doshaProfile: `${NESTJS_BASE_URL}/users/dosha-profile`,
  healthProfile: `${NESTJS_BASE_URL}/users/health-profile`,
  deleteAccount: `${NESTJS_BASE_URL}/users/account`,
} as const;

/**
 * Product Endpoints
 */
export const PRODUCT_ENDPOINTS = {
  baseUrl: `${NESTJS_BASE_URL}/products`,
  list: `${NESTJS_BASE_URL}/products`,
  search: `${NESTJS_BASE_URL}/products/search`,
  byId: (id: string) => `${NESTJS_BASE_URL}/products/${id}`,
  featured: `${NESTJS_BASE_URL}/products/featured`,
  trending: `${NESTJS_BASE_URL}/products/trending`,
  newArrivals: `${NESTJS_BASE_URL}/products/new-arrivals`,
  bestSellers: `${NESTJS_BASE_URL}/products/best-sellers`,
  byCategory: (categoryId: string) => `${NESTJS_BASE_URL}/products/category/${categoryId}`,
  byDosha: (doshaType: string) => `${NESTJS_BASE_URL}/products/dosha/${doshaType}`,
  reviews: (productId: string) => `${NESTJS_BASE_URL}/products/${productId}/reviews`,
  addReview: (productId: string) => `${NESTJS_BASE_URL}/products/${productId}/reviews`,
  updateReview: (productId: string, reviewId: string) =>
    `${NESTJS_BASE_URL}/products/${productId}/reviews/${reviewId}`,
  deleteReview: (productId: string, reviewId: string) =>
    `${NESTJS_BASE_URL}/products/${productId}/reviews/${reviewId}`,
  relatedProducts: (productId: string) => `${NESTJS_BASE_URL}/products/${productId}/related`,
} as const;

/**
 * Category Endpoints
 */
export const CATEGORY_ENDPOINTS = {
  baseUrl: `${NESTJS_BASE_URL}/categories`,
  list: `${NESTJS_BASE_URL}/categories`,
  byId: (id: string) => `${NESTJS_BASE_URL}/categories/${id}`,
  tree: `${NESTJS_BASE_URL}/categories/tree`,
  featured: `${NESTJS_BASE_URL}/categories/featured`,
} as const;

/**
 * Cart Endpoints
 */
export const CART_ENDPOINTS = {
  baseUrl: `${NESTJS_BASE_URL}/cart`,
  get: `${NESTJS_BASE_URL}/cart`,
  add: `${NESTJS_BASE_URL}/cart/items`,
  update: (itemId: string) => `${NESTJS_BASE_URL}/cart/items/${itemId}`,
  remove: (itemId: string) => `${NESTJS_BASE_URL}/cart/items/${itemId}`,
  clear: `${NESTJS_BASE_URL}/cart/clear`,
  applyCoupon: `${NESTJS_BASE_URL}/cart/coupon`,
  removeCoupon: `${NESTJS_BASE_URL}/cart/coupon`,
  validateCart: `${NESTJS_BASE_URL}/cart/validate`,
} as const;

/**
 * Order Endpoints
 */
export const ORDER_ENDPOINTS = {
  baseUrl: `${NESTJS_BASE_URL}/orders`,
  list: `${NESTJS_BASE_URL}/orders`,
  create: `${NESTJS_BASE_URL}/orders`,
  byId: (id: string) => `${NESTJS_BASE_URL}/orders/${id}`,
  cancel: (id: string) => `${NESTJS_BASE_URL}/orders/${id}/cancel`,
  track: (id: string) => `${NESTJS_BASE_URL}/orders/${id}/track`,
  invoice: (id: string) => `${NESTJS_BASE_URL}/orders/${id}/invoice`,
  reorder: (id: string) => `${NESTJS_BASE_URL}/orders/${id}/reorder`,
  return: (id: string) => `${NESTJS_BASE_URL}/orders/${id}/return`,
  returnStatus: (orderId: string, returnId: string) =>
    `${NESTJS_BASE_URL}/orders/${orderId}/returns/${returnId}`,
} as const;

/**
 * Payment Endpoints
 */
export const PAYMENT_ENDPOINTS = {
  baseUrl: `${NESTJS_BASE_URL}/payments`,
  methods: `${NESTJS_BASE_URL}/payments/methods`,
  addMethod: `${NESTJS_BASE_URL}/payments/methods`,
  deleteMethod: (id: string) => `${NESTJS_BASE_URL}/payments/methods/${id}`,
  setDefault: (id: string) => `${NESTJS_BASE_URL}/payments/methods/${id}/default`,
  createIntent: `${NESTJS_BASE_URL}/payments/intent`,
  confirm: (id: string) => `${NESTJS_BASE_URL}/payments/${id}/confirm`,
  refund: (id: string) => `${NESTJS_BASE_URL}/payments/${id}/refund`,
  history: `${NESTJS_BASE_URL}/payments/history`,
} as const;

/**
 * Wishlist Endpoints
 */
export const WISHLIST_ENDPOINTS = {
  baseUrl: `${NESTJS_BASE_URL}/wishlist`,
  get: `${NESTJS_BASE_URL}/wishlist`,
  add: `${NESTJS_BASE_URL}/wishlist/items`,
  remove: (productId: string) => `${NESTJS_BASE_URL}/wishlist/items/${productId}`,
  clear: `${NESTJS_BASE_URL}/wishlist/clear`,
  moveToCart: (productId: string) => `${NESTJS_BASE_URL}/wishlist/items/${productId}/move-to-cart`,
} as const;

/**
 * Blog Endpoints
 */
export const BLOG_ENDPOINTS = {
  baseUrl: `${NESTJS_BASE_URL}/blog`,
  list: `${NESTJS_BASE_URL}/blog/posts`,
  byId: (id: string) => `${NESTJS_BASE_URL}/blog/posts/${id}`,
  byCategory: (categoryId: string) => `${NESTJS_BASE_URL}/blog/posts/category/${categoryId}`,
  featured: `${NESTJS_BASE_URL}/blog/posts/featured`,
  categories: `${NESTJS_BASE_URL}/blog/categories`,
  search: `${NESTJS_BASE_URL}/blog/posts/search`,
  related: (postId: string) => `${NESTJS_BASE_URL}/blog/posts/${postId}/related`,
} as const;

/**
 * Consultation Endpoints
 */
export const CONSULTATION_ENDPOINTS = {
  baseUrl: `${NESTJS_BASE_URL}/consultations`,
  list: `${NESTJS_BASE_URL}/consultations`,
  book: `${NESTJS_BASE_URL}/consultations`,
  byId: (id: string) => `${NESTJS_BASE_URL}/consultations/${id}`,
  cancel: (id: string) => `${NESTJS_BASE_URL}/consultations/${id}/cancel`,
  reschedule: (id: string) => `${NESTJS_BASE_URL}/consultations/${id}/reschedule`,
  practitioners: `${NESTJS_BASE_URL}/consultations/practitioners`,
  practitionerById: (id: string) => `${NESTJS_BASE_URL}/consultations/practitioners/${id}`,
  availableSlots: (practitionerId: string) =>
    `${NESTJS_BASE_URL}/consultations/practitioners/${practitionerId}/slots`,
  feedback: (id: string) => `${NESTJS_BASE_URL}/consultations/${id}/feedback`,
} as const;

/**
 * Notification Endpoints
 */
export const NOTIFICATION_ENDPOINTS = {
  baseUrl: `${NESTJS_BASE_URL}/notifications`,
  list: `${NESTJS_BASE_URL}/notifications`,
  markAsRead: (id: string) => `${NESTJS_BASE_URL}/notifications/${id}/read`,
  markAllAsRead: `${NESTJS_BASE_URL}/notifications/read-all`,
  delete: (id: string) => `${NESTJS_BASE_URL}/notifications/${id}`,
  deleteAll: `${NESTJS_BASE_URL}/notifications/clear`,
  preferences: `${NESTJS_BASE_URL}/notifications/preferences`,
  updatePreferences: `${NESTJS_BASE_URL}/notifications/preferences`,
  registerDevice: `${NESTJS_BASE_URL}/notifications/devices`,
  unregisterDevice: (deviceId: string) => `${NESTJS_BASE_URL}/notifications/devices/${deviceId}`,
} as const;

/**
 * Support Endpoints
 */
export const SUPPORT_ENDPOINTS = {
  baseUrl: `${NESTJS_BASE_URL}/support`,
  tickets: `${NESTJS_BASE_URL}/support/tickets`,
  createTicket: `${NESTJS_BASE_URL}/support/tickets`,
  ticketById: (id: string) => `${NESTJS_BASE_URL}/support/tickets/${id}`,
  addMessage: (ticketId: string) => `${NESTJS_BASE_URL}/support/tickets/${ticketId}/messages`,
  closeTicket: (id: string) => `${NESTJS_BASE_URL}/support/tickets/${id}/close`,
  faq: `${NESTJS_BASE_URL}/support/faq`,
  faqCategories: `${NESTJS_BASE_URL}/support/faq/categories`,
} as const;

/**
 * ML Service - Recommendation Endpoints
 */
export const ML_RECOMMENDATION_ENDPOINTS = {
  baseUrl: `${ML_SERVICE_BASE_URL}/recommendations`,
  personalized: `${ML_SERVICE_BASE_URL}/recommendations/personalized`,
  similar: (productId: string) => `${ML_SERVICE_BASE_URL}/recommendations/similar/${productId}`,
  trending: `${ML_SERVICE_BASE_URL}/recommendations/trending`,
  forYou: `${ML_SERVICE_BASE_URL}/recommendations/for-you`,
  collaborative: `${ML_SERVICE_BASE_URL}/recommendations/collaborative`,
  contentBased: `${ML_SERVICE_BASE_URL}/recommendations/content-based`,
  hybrid: `${ML_SERVICE_BASE_URL}/recommendations/hybrid`,
  doshaBasedRecommendations: `${ML_SERVICE_BASE_URL}/recommendations/dosha-based`,
} as const;

/**
 * ML Service - Search Endpoints
 */
export const ML_SEARCH_ENDPOINTS = {
  baseUrl: `${ML_SERVICE_BASE_URL}/search`,
  semantic: `${ML_SERVICE_BASE_URL}/search/semantic`,
  vector: `${ML_SERVICE_BASE_URL}/search/vector`,
  hybrid: `${ML_SERVICE_BASE_URL}/search/hybrid`,
  autocomplete: `${ML_SERVICE_BASE_URL}/search/autocomplete`,
  suggestions: `${ML_SERVICE_BASE_URL}/search/suggestions`,
  relatedQueries: `${ML_SERVICE_BASE_URL}/search/related-queries`,
} as const;

/**
 * ML Service - Dosha Analysis Endpoints
 */
export const ML_DOSHA_ENDPOINTS = {
  baseUrl: `${ML_SERVICE_BASE_URL}/dosha`,
  analyze: `${ML_SERVICE_BASE_URL}/dosha/analyze`,
  quiz: `${ML_SERVICE_BASE_URL}/dosha/quiz`,
  profile: `${ML_SERVICE_BASE_URL}/dosha/profile`,
  updateProfile: `${ML_SERVICE_BASE_URL}/dosha/profile/update`,
  recommendations: `${ML_SERVICE_BASE_URL}/dosha/recommendations`,
  balancingTips: `${ML_SERVICE_BASE_URL}/dosha/balancing-tips`,
  seasonalGuidance: `${ML_SERVICE_BASE_URL}/dosha/seasonal-guidance`,
} as const;

/**
 * ML Service - Image Analysis Endpoints
 */
export const ML_IMAGE_ENDPOINTS = {
  baseUrl: `${ML_SERVICE_BASE_URL}/image`,
  analyze: `${ML_SERVICE_BASE_URL}/image/analyze`,
  classify: `${ML_SERVICE_BASE_URL}/image/classify`,
  detectIngredients: `${ML_SERVICE_BASE_URL}/image/detect-ingredients`,
  skinAnalysis: `${ML_SERVICE_BASE_URL}/image/skin-analysis`,
} as const;

/**
 * ML Service - NLP Endpoints
 */
export const ML_NLP_ENDPOINTS = {
  baseUrl: `${ML_SERVICE_BASE_URL}/nlp`,
  sentiment: `${ML_SERVICE_BASE_URL}/nlp/sentiment`,
  extractKeywords: `${ML_SERVICE_BASE_URL}/nlp/keywords`,
  categorize: `${ML_SERVICE_BASE_URL}/nlp/categorize`,
  healthConcerns: `${ML_SERVICE_BASE_URL}/nlp/health-concerns`,
  chatbot: `${ML_SERVICE_BASE_URL}/nlp/chatbot`,
} as const;

/**
 * Analytics Endpoints
 */
export const ANALYTICS_ENDPOINTS = {
  baseUrl: `${NESTJS_BASE_URL}/analytics`,
  trackEvent: `${NESTJS_BASE_URL}/analytics/events`,
  trackPageView: `${NESTJS_BASE_URL}/analytics/pageviews`,
  trackProductView: `${NESTJS_BASE_URL}/analytics/product-views`,
  trackSearch: `${NESTJS_BASE_URL}/analytics/searches`,
  trackPurchase: `${NESTJS_BASE_URL}/analytics/purchases`,
  userBehavior: `${NESTJS_BASE_URL}/analytics/user-behavior`,
} as const;

/**
 * Combined endpoints export
 */
export const API_ENDPOINTS = {
  auth: AUTH_ENDPOINTS,
  user: USER_ENDPOINTS,
  products: PRODUCT_ENDPOINTS,
  categories: CATEGORY_ENDPOINTS,
  cart: CART_ENDPOINTS,
  orders: ORDER_ENDPOINTS,
  payments: PAYMENT_ENDPOINTS,
  wishlist: WISHLIST_ENDPOINTS,
  blog: BLOG_ENDPOINTS,
  consultations: CONSULTATION_ENDPOINTS,
  notifications: NOTIFICATION_ENDPOINTS,
  support: SUPPORT_ENDPOINTS,
  ml: {
    recommendations: ML_RECOMMENDATION_ENDPOINTS,
    search: ML_SEARCH_ENDPOINTS,
    dosha: ML_DOSHA_ENDPOINTS,
    image: ML_IMAGE_ENDPOINTS,
    nlp: ML_NLP_ENDPOINTS,
  },
  analytics: ANALYTICS_ENDPOINTS,
} as const;

/**
 * API Configuration
 */
export const API_CONFIG = {
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
} as const;

// Export base URLs for direct use if needed
export { NESTJS_BASE_URL, ML_SERVICE_BASE_URL };
