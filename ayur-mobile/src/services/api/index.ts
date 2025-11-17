/**
 * API Services Index
 * Central export point for all API services
 */

// Export API client and utilities
export { default as apiClient, handleApiError, setDefaultHeader, removeDefaultHeader } from './apiClient';
export type { ApiResponse, ApiError } from './apiClient';

// Export auth service
export { default as authService } from './authService';
export type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  OTPVerificationData,
  SocialProvider,
  TwoFactorAuthData,
} from './authService';

// Export product service
export { default as productService } from './productService';
export type {
  PaginationParams,
  PaginatedResponse,
  ProductQueryParams,
  CategoryWithCount,
  RecommendationParams,
} from './productService';

// Export cart service
export { default as cartService } from './cartService';
export type {
  CartResponse,
  AppliedCoupon,
  AddToCartParams,
  UpdateCartItemParams,
  CartItemWithId,
} from './cartService';

// Export order service
export { default as orderService } from './orderService';
export type {
  CreateOrderData,
  OrderDetails,
  OrderTracking,
  PaymentIntent,
  OrderFilters,
  OrderQueryParams,
  Invoice,
} from './orderService';

// Export user service
export { default as userService } from './userService';
export type {
  UpdateProfileData,
  UserPreferences,
  UserActivity,
  UserNotification,
  DoshaQuizResult,
} from './userService';

/**
 * Convenience object with all services
 */
export const apiServices = {
  auth: authService,
  products: productService,
  cart: cartService,
  orders: orderService,
  user: userService,
};

export default apiServices;
