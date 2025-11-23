# API Services Documentation

Complete production-ready API service layer for the Ayurveda Haven mobile app.

## Overview

This directory contains all API service modules that handle communication with the backend API. All services use a centralized Axios instance with built-in authentication, error handling, and token refresh capabilities.

## Files Created

### 1. **apiClient.ts** (327 lines)
Core Axios instance with production-ready features:
- **Request Interceptor**: Automatically adds auth tokens, checks network connectivity
- **Response Interceptor**: Handles 401 errors, automatic token refresh, error normalization
- **Token Management**: Secure storage using Expo SecureStore
- **Network Detection**: Checks connectivity before requests
- **Error Handling**: Consistent error structure across all services
- **TypeScript**: Fully typed with `ApiResponse<T>` and `ApiError` interfaces

**Key Features**:
- Automatic token refresh on 401 errors
- Request queuing during token refresh
- Network connectivity checks
- Development logging
- Timeout handling
- Standardized error responses

### 2. **authService.ts** (506 lines)
Complete authentication service:

**Methods**:
- `login(email, password)` - Email/password login
- `register(userData)` - User registration
- `logout()` - Logout and clear tokens
- `refreshToken(token)` - Refresh access token
- `sendOTP(phone)` - Send OTP to phone
- `verifyOTP(phone, code)` - Verify OTP code
- `loginWithGoogle()` - Google OAuth flow
- `loginWithApple()` - Apple OAuth flow
- `enable2FA()` - Enable two-factor authentication
- `verify2FA(code)` - Verify 2FA code
- `disable2FA(code)` - Disable 2FA
- `forgotPassword(email)` - Request password reset
- `resetPassword(token, newPassword)` - Reset password with token
- `changePassword(current, new)` - Change password (authenticated)
- `verifyEmail(token)` - Verify email address
- `resendVerificationEmail()` - Resend verification email
- `checkEmailAvailability(email)` - Check if email is available

### 3. **productService.ts** (488 lines)
Product catalog and search service:

**Methods**:
- `getProducts(params)` - Get products with filters, sorting, pagination
- `getProduct(id)` - Get single product by ID
- `getProductBySlug(slug)` - Get product by slug
- `searchProducts(query)` - Full-text search
- `getCategories()` - Get all categories with counts
- `getFeaturedProducts(limit)` - Get featured products
- `getBestSellers(limit)` - Get best selling products
- `getNewArrivals(limit)` - Get new arrivals
- `getProductsByDosha(type)` - Filter by dosha type
- `getRelatedProducts(id)` - Get related products
- `getRecommendedProducts(params)` - ML-powered recommendations
- `getProductReviews(id)` - Get product reviews
- `addProductReview(id, rating, comment)` - Add review
- `updateProductReview(id, reviewId, rating, comment)` - Update review
- `deleteProductReview(id, reviewId)` - Delete review
- `markReviewHelpful(id, reviewId)` - Mark review as helpful
- `checkProductStock(id)` - Check stock availability

### 4. **cartService.ts** (440 lines)
Shopping cart management:

**Methods**:
- `getCart()` - Get current cart
- `addToCart(productId, quantity, variant?)` - Add item to cart
- `updateCartItem(itemId, quantity)` - Update item quantity
- `removeFromCart(itemId)` - Remove item from cart
- `applyCoupon(code)` - Apply coupon code
- `removeCoupon()` - Remove applied coupon
- `clearCart()` - Clear all items
- `validateCart()` - Validate items (stock, prices)
- `getCartItemCount()` - Get total item count
- `syncCart(localItems)` - Sync local cart with server
- `addMultipleToCart(items)` - Bulk add items
- `updateMultipleCartItems(updates)` - Bulk update items
- `calculateShipping(addressId)` - Calculate shipping cost
- `getAvailableCoupons()` - Get applicable coupons
- `saveCartForLater()` - Save cart for later
- `restoreSavedCart()` - Restore saved cart

### 5. **orderService.ts** (487 lines)
Order management and tracking:

**Methods**:
- `createOrder(orderData)` - Create new order
- `getOrders(params)` - Get order history with filters
- `getOrder(id)` - Get single order details
- `trackOrder(id)` - Track order status and shipping
- `cancelOrder(id, reason?)` - Cancel order
- `requestReturn(id, items, reason)` - Request return
- `confirmOrderReceipt(id)` - Confirm order received
- `reorder(id)` - Reorder from previous order
- `getOrderInvoice(id)` - Get order invoice
- `downloadInvoice(id)` - Download invoice PDF
- `updateOrderPayment(id, method)` - Update payment method
- `confirmPayment(id, details)` - Confirm payment
- `getOrderStatistics()` - Get user order statistics
- `getOrderSupport(id)` - Get support contact info
- `verifyPaymentStatus(id)` - Verify payment status

### 6. **userService.ts** (734 lines)
User profile and preferences:

**Profile Methods**:
- `getProfile()` - Get user profile
- `updateProfile(data)` - Update profile
- `uploadAvatar(imageUri)` - Upload profile picture
- `deleteAccount(password)` - Delete user account

**Address Methods**:
- `getAddresses()` - Get all addresses
- `getAddress(id)` - Get single address
- `addAddress(address)` - Add new address
- `updateAddress(id, address)` - Update address
- `deleteAddress(id)` - Delete address
- `setDefaultAddress(id)` - Set default address

**Wishlist Methods**:
- `getWishlist()` - Get wishlist items
- `addToWishlist(productId)` - Add to wishlist
- `removeFromWishlist(productId)` - Remove from wishlist
- `isInWishlist(productId)` - Check if in wishlist
- `clearWishlist()` - Clear entire wishlist

**Preferences Methods**:
- `getPreferences()` - Get user preferences
- `updatePreferences(prefs)` - Update preferences

**Notification Methods**:
- `getNotifications(params)` - Get notifications
- `markNotificationRead(id)` - Mark as read
- `markAllNotificationsRead()` - Mark all as read
- `deleteNotification(id)` - Delete notification
- `getUnreadNotificationCount()` - Get unread count

**Other Methods**:
- `getActivityLog(params)` - Get activity history
- `getUserStatistics()` - Get user stats
- `submitDoshaQuiz(answers)` - Submit dosha quiz
- `getDoshaQuizHistory()` - Get quiz history
- `submitSupportTicket(subject, message, category)` - Submit support ticket
- `getFAQ(category?)` - Get FAQ

### 7. **index.ts** (74 lines)
Central export file for easy imports

## Usage Examples

### Basic Import
```typescript
import { authService, productService, cartService } from '@/services/api';

// Use individual service
const products = await productService.getProducts({ category: 'Oils' });
```

### With Error Handling
```typescript
import { authService, handleApiError } from '@/services/api';

try {
  const response = await authService.login(email, password);
  console.log('Logged in:', response.user);
} catch (error) {
  const apiError = handleApiError(error);
  console.error('Login failed:', apiError.message);
}
```

### With React Query
```typescript
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/api';

function ProductList() {
  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getProducts(),
  });

  // ...
}
```

### Pagination Example
```typescript
const products = await productService.getProducts({
  page: 1,
  limit: 20,
  category: 'Oils',
  sortBy: 'price-low',
});

console.log(products.pagination.totalPages);
console.log(products.pagination.hasNext);
```

## Features

### Type Safety
- Full TypeScript support
- Typed request/response interfaces
- Generic `ApiResponse<T>` wrapper
- Comprehensive type exports

### Error Handling
- Consistent error structure
- Network error detection
- Timeout handling
- Validation error support
- User-friendly error messages

### Authentication
- Automatic token management
- Secure token storage (Expo SecureStore)
- Token refresh on expiry
- Request queuing during refresh
- Multiple auth methods (email, OTP, social)

### Network Resilience
- Network connectivity checks
- Automatic retry on token refresh
- Request timeout handling
- Offline detection

### Developer Experience
- JSDoc comments on all functions
- Development logging
- Clear naming conventions
- Modular structure
- Easy to extend

## Configuration

The API client uses configuration from `/src/lib/constants/config.ts`:

```typescript
{
  API_URL: 'https://api.ayurvedahaven.com/api',
  API_TIMEOUT: 30000, // 30 seconds
  ACCESS_TOKEN_KEY: '@ayurveda_access_token',
  REFRESH_TOKEN_KEY: '@ayurveda_refresh_token',
}
```

## Best Practices

1. **Always use try-catch** blocks when calling API services
2. **Handle errors gracefully** with user-friendly messages
3. **Use React Query** for data fetching and caching
4. **Implement optimistic updates** for better UX
5. **Check network status** before critical operations
6. **Log errors** to monitoring service (Sentry)

## Testing

```typescript
import { authService } from '@/services/api';
import { jest } from '@jest/globals';

jest.mock('@/services/api/apiClient');

describe('AuthService', () => {
  it('should login successfully', async () => {
    const result = await authService.login('test@example.com', 'password');
    expect(result.user).toBeDefined();
  });
});
```

## Integration Checklist

- [ ] Update environment variables for API URLs
- [ ] Configure OAuth credentials (Google, Apple)
- [ ] Set up Sentry for error monitoring
- [ ] Implement offline queue for failed requests
- [ ] Add analytics tracking
- [ ] Set up push notification tokens
- [ ] Test token refresh flow
- [ ] Implement request retry logic
- [ ] Add cache invalidation strategies
- [ ] Configure rate limiting handling

## Total Stats
- **Total Lines**: 3,056 lines of production code
- **Total Files**: 7 TypeScript files
- **Total Size**: ~79KB
- **Functions**: 100+ API methods
- **Types**: 50+ TypeScript interfaces/types
