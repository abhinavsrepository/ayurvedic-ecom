/**
 * API Services Index
 * Central export point for all API services
 */

// Import services for re-export and convenience object
import authServiceDefault from './authService';
import productServiceDefault from './productService';
import cartServiceDefault from './cartService';
import orderServiceDefault from './orderService';
import userServiceDefault from './userService';

// Export API client and utilities
export {
  default as apiClient,
  handleApiError,
  setDefaultHeader,
  removeDefaultHeader,
} from './apiClient';
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
  auth: authServiceDefault,
  products: productServiceDefault,
  cart: cartServiceDefault,
  orders: orderServiceDefault,
  user: userServiceDefault,
};

export default apiServices;
