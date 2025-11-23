/**
 * React Query Key Factory
 *
 * This file contains all React Query keys organized in a hierarchical structure.
 * Following the "Query Key Factory" pattern for better type safety and maintainability.
 *
 * @see https://tkdodo.eu/blog/effective-react-query-keys
 */

/**
 * Authentication Query Keys
 */
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
  session: () => [...authKeys.all, 'session'] as const,
  tokens: () => [...authKeys.all, 'tokens'] as const,
} as const;

/**
 * User Query Keys
 */
export const userKeys = {
  all: ['user'] as const,
  profile: () => [...userKeys.all, 'profile'] as const,
  addresses: () => [...userKeys.all, 'addresses'] as const,
  address: (id: string) => [...userKeys.addresses(), id] as const,
  preferences: () => [...userKeys.all, 'preferences'] as const,
  doshaProfile: () => [...userKeys.all, 'dosha-profile'] as const,
  healthProfile: () => [...userKeys.all, 'health-profile'] as const,
} as const;

/**
 * Product Query Keys
 */
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  search: (query: string) => [...productKeys.all, 'search', query] as const,
  featured: () => [...productKeys.all, 'featured'] as const,
  trending: () => [...productKeys.all, 'trending'] as const,
  newArrivals: () => [...productKeys.all, 'new-arrivals'] as const,
  bestSellers: () => [...productKeys.all, 'best-sellers'] as const,
  byCategory: (categoryId: string) =>
    [...productKeys.all, 'category', categoryId] as const,
  byDosha: (doshaType: string) => [...productKeys.all, 'dosha', doshaType] as const,
  reviews: (productId: string) => [...productKeys.detail(productId), 'reviews'] as const,
  relatedProducts: (productId: string) =>
    [...productKeys.detail(productId), 'related'] as const,
} as const;

/**
 * Category Query Keys
 */
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: () => [...categoryKeys.lists()] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
  tree: () => [...categoryKeys.all, 'tree'] as const,
  featured: () => [...categoryKeys.all, 'featured'] as const,
} as const;

/**
 * Cart Query Keys
 */
export const cartKeys = {
  all: ['cart'] as const,
  current: () => [...cartKeys.all, 'current'] as const,
  items: () => [...cartKeys.all, 'items'] as const,
  count: () => [...cartKeys.all, 'count'] as const,
  total: () => [...cartKeys.all, 'total'] as const,
  validation: () => [...cartKeys.all, 'validation'] as const,
} as const;

/**
 * Order Query Keys
 */
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...orderKeys.lists(), { filters }] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
  tracking: (id: string) => [...orderKeys.detail(id), 'tracking'] as const,
  invoice: (id: string) => [...orderKeys.detail(id), 'invoice'] as const,
  returns: () => [...orderKeys.all, 'returns'] as const,
  return: (orderId: string, returnId: string) =>
    [...orderKeys.detail(orderId), 'return', returnId] as const,
} as const;

/**
 * Payment Query Keys
 */
export const paymentKeys = {
  all: ['payments'] as const,
  methods: () => [...paymentKeys.all, 'methods'] as const,
  method: (id: string) => [...paymentKeys.methods(), id] as const,
  history: () => [...paymentKeys.all, 'history'] as const,
  intent: (id: string) => [...paymentKeys.all, 'intent', id] as const,
} as const;

/**
 * Wishlist Query Keys
 */
export const wishlistKeys = {
  all: ['wishlist'] as const,
  items: () => [...wishlistKeys.all, 'items'] as const,
  count: () => [...wishlistKeys.all, 'count'] as const,
  contains: (productId: string) =>
    [...wishlistKeys.all, 'contains', productId] as const,
} as const;

/**
 * Blog Query Keys
 */
export const blogKeys = {
  all: ['blog'] as const,
  posts: () => [...blogKeys.all, 'posts'] as const,
  post: (id: string) => [...blogKeys.posts(), id] as const,
  byCategory: (categoryId: string) =>
    [...blogKeys.posts(), 'category', categoryId] as const,
  featured: () => [...blogKeys.posts(), 'featured'] as const,
  categories: () => [...blogKeys.all, 'categories'] as const,
  search: (query: string) => [...blogKeys.posts(), 'search', query] as const,
  related: (postId: string) => [...blogKeys.post(postId), 'related'] as const,
} as const;

/**
 * Consultation Query Keys
 */
export const consultationKeys = {
  all: ['consultations'] as const,
  lists: () => [...consultationKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) =>
    [...consultationKeys.lists(), { filters }] as const,
  details: () => [...consultationKeys.all, 'detail'] as const,
  detail: (id: string) => [...consultationKeys.details(), id] as const,
  practitioners: () => [...consultationKeys.all, 'practitioners'] as const,
  practitioner: (id: string) => [...consultationKeys.practitioners(), id] as const,
  availableSlots: (practitionerId: string, date?: string) =>
    [...consultationKeys.practitioner(practitionerId), 'slots', date ?? 'all'] as const,
  upcoming: () => [...consultationKeys.all, 'upcoming'] as const,
  past: () => [...consultationKeys.all, 'past'] as const,
} as const;

/**
 * Notification Query Keys
 */
export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) =>
    [...notificationKeys.lists(), { filters }] as const,
  unreadCount: () => [...notificationKeys.all, 'unread-count'] as const,
  preferences: () => [...notificationKeys.all, 'preferences'] as const,
} as const;

/**
 * Support Query Keys
 */
export const supportKeys = {
  all: ['support'] as const,
  tickets: () => [...supportKeys.all, 'tickets'] as const,
  ticket: (id: string) => [...supportKeys.tickets(), id] as const,
  faq: () => [...supportKeys.all, 'faq'] as const,
  faqCategories: () => [...supportKeys.all, 'faq-categories'] as const,
  faqByCategory: (categoryId: string) =>
    [...supportKeys.faq(), 'category', categoryId] as const,
} as const;

/**
 * ML Recommendation Query Keys
 */
export const recommendationKeys = {
  all: ['recommendations'] as const,
  personalized: (userId?: string) =>
    [...recommendationKeys.all, 'personalized', userId ?? 'guest'] as const,
  similar: (productId: string) =>
    [...recommendationKeys.all, 'similar', productId] as const,
  trending: () => [...recommendationKeys.all, 'trending'] as const,
  forYou: () => [...recommendationKeys.all, 'for-you'] as const,
  collaborative: () => [...recommendationKeys.all, 'collaborative'] as const,
  contentBased: (productId: string) =>
    [...recommendationKeys.all, 'content-based', productId] as const,
  hybrid: () => [...recommendationKeys.all, 'hybrid'] as const,
  doshaBased: (doshaType: string) =>
    [...recommendationKeys.all, 'dosha-based', doshaType] as const,
} as const;

/**
 * ML Search Query Keys
 */
export const searchKeys = {
  all: ['search'] as const,
  semantic: (query: string) => [...searchKeys.all, 'semantic', query] as const,
  vector: (query: string) => [...searchKeys.all, 'vector', query] as const,
  hybrid: (query: string) => [...searchKeys.all, 'hybrid', query] as const,
  autocomplete: (query: string) => [...searchKeys.all, 'autocomplete', query] as const,
  suggestions: (query: string) => [...searchKeys.all, 'suggestions', query] as const,
  relatedQueries: (query: string) =>
    [...searchKeys.all, 'related-queries', query] as const,
  history: () => [...searchKeys.all, 'history'] as const,
} as const;

/**
 * ML Dosha Analysis Query Keys
 */
export const doshaKeys = {
  all: ['dosha'] as const,
  analysis: () => [...doshaKeys.all, 'analysis'] as const,
  quiz: () => [...doshaKeys.all, 'quiz'] as const,
  profile: () => [...doshaKeys.all, 'profile'] as const,
  recommendations: (doshaType: string) =>
    [...doshaKeys.all, 'recommendations', doshaType] as const,
  balancingTips: (doshaType: string) =>
    [...doshaKeys.all, 'balancing-tips', doshaType] as const,
  seasonalGuidance: (doshaType: string, season?: string) =>
    [...doshaKeys.all, 'seasonal-guidance', doshaType, season ?? 'current'] as const,
} as const;

/**
 * Analytics Query Keys
 */
export const analyticsKeys = {
  all: ['analytics'] as const,
  userBehavior: () => [...analyticsKeys.all, 'user-behavior'] as const,
  productViews: () => [...analyticsKeys.all, 'product-views'] as const,
  searchHistory: () => [...analyticsKeys.all, 'search-history'] as const,
  purchaseHistory: () => [...analyticsKeys.all, 'purchase-history'] as const,
} as const;

/**
 * Combined Query Keys Factory
 *
 * Export all query keys in a single object for easy import and usage.
 */
export const queryKeys = {
  auth: authKeys,
  user: userKeys,
  products: productKeys,
  categories: categoryKeys,
  cart: cartKeys,
  orders: orderKeys,
  payments: paymentKeys,
  wishlist: wishlistKeys,
  blog: blogKeys,
  consultations: consultationKeys,
  notifications: notificationKeys,
  support: supportKeys,
  recommendations: recommendationKeys,
  search: searchKeys,
  dosha: doshaKeys,
  analytics: analyticsKeys,
} as const;

/**
 * Type helpers for query keys
 */
export type QueryKeyFactory = typeof queryKeys;
export type AuthQueryKeys = typeof authKeys;
export type UserQueryKeys = typeof userKeys;
export type ProductQueryKeys = typeof productKeys;
export type CategoryQueryKeys = typeof categoryKeys;
export type CartQueryKeys = typeof cartKeys;
export type OrderQueryKeys = typeof orderKeys;
export type PaymentQueryKeys = typeof paymentKeys;
export type WishlistQueryKeys = typeof wishlistKeys;
export type BlogQueryKeys = typeof blogKeys;
export type ConsultationQueryKeys = typeof consultationKeys;
export type NotificationQueryKeys = typeof notificationKeys;
export type SupportQueryKeys = typeof supportKeys;
export type RecommendationQueryKeys = typeof recommendationKeys;
export type SearchQueryKeys = typeof searchKeys;
export type DoshaQueryKeys = typeof doshaKeys;
export type AnalyticsQueryKeys = typeof analyticsKeys;
