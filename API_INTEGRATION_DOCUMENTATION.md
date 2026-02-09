# Ayurveda Shop & API Integration Documentation

## Table of Contents
1. [Overview](#overview)
2. [Base URL Configuration](#base-url-configuration)
3. [API Endpoint Matching Analysis](#api-endpoint-matching-analysis)
4. [Authentication & Authorization](#authentication--authorization)
5. [Error Handling](#error-handling)
6. [Request/Response Formats](#requestresponse-formats)
7. [Migration Recommendations](#migration-recommendations)
8. [Testing & Validation](#testing--validation)

---

## Overview

### Architecture
This project consists of two interconnected applications:
- **Frontend (ayurveda-shop)**: Next.js-based e-commerce platform with React components
- **Backend API (ayurveda-api)**: NestJS-based REST API server

### Technology Stack
- **Frontend**: Next.js 14, TypeScript, Axios, React Context
- **Backend**: NestJS, TypeScript, Prisma ORM, PostgreSQL
- **Authentication**: JWT tokens (access + refresh tokens)
- **CORS**: Cross-Origin Resource Sharing configured

---

## Base URL Configuration

### Frontend Configuration
**File**: `C:\Users\surya\OneDrive\Desktop\cosmicolast\ayurveda-shop\.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3333
```

### Backend Configuration
**File**: `C:\Users\surya\OneDrive\Desktop\cosmicolast\ayurveda-api\.env`

```env
PORT=3333
DATABASE_URL=postgresql://postgres:postgres:root@localhost:5433/ayurveda_admin
JWT_SECRET=super-secret-jwt-key-change-in-production-min-32-characters-long
JWT_REFRESH_SECRET=super-secret-refresh-key-change-in-production-min-32-chars
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

**API Base URL**: `http://localhost:3333`

---

## API Endpoint Matching Analysis

### ✅ CORRECT ENDPOINTS

#### Authentication Endpoints
| Frontend | Backend | Status | Method |
|----------|---------|--------|--------|
| `/api/auth/login` | `/api/auth/login` | ✅ MATCHED | POST |
| `/api/auth/refresh` | `/api/auth/refresh` | ✅ MATCHED | POST |
| `/api/auth/me` | `/api/auth/me` | ✅ MATCHED | GET |
| `/api/auth/logout` | `/api/auth/logout` | ✅ MATCHED | POST |
| `/api/auth/2fa/enable` | `/api/auth/2fa/enable` | ✅ MATCHED | POST |
| `/api/auth/2fa/verify` | `/api/auth/2fa/verify` | ✅ MATCHED | POST |
| `/api/auth/2fa/disable` | `/api/auth/2fa/disable` | ✅ MATCHED | DELETE |

#### Products Endpoints
| Frontend | Backend | Status | Method |
|----------|---------|--------|--------|
| `/api/products` | `/products` | ✅ MATCHED | GET |
| `/api/products/:id` | `/products/:id` | ✅ MATCHED | GET |
| `/api/products` | `/products` | ✅ MATCHED | POST |
| `/api/products/:id` | `/products/:id` | ✅ MATCHED | PUT |
| `/api/products/:id` | `/products/:id` | ✅ MATCHED | DELETE |
| `/api/products/search` | Not Found | ⚠️ FRONTEND ISSUE | GET |
| `/api/products/:id/stock` | Not Found | ⚠️ FRONTEND ISSUE | PATCH |

#### Cart Endpoints
| Frontend | Backend | Status | Method |
|----------|---------|--------|--------|
| `/api/cart` | `/cart` | ✅ MATCHED | GET |
| `/api/cart/items` | `/cart/items` | ✅ MATCHED | POST |
| `/api/cart/items/:itemId` | `/cart/items/:itemId` | ✅ MATCHED | PATCH |
| `/api/cart/items/:itemId` | `/cart/items/:itemId` | ✅ MATCHED | DELETE |
| `/api/cart` | `/cart` | ✅ MATCHED | DELETE |
| `/api/cart/merge` | `/cart/merge` | ✅ MATCHED | POST |
| `/api/cart/summary` | `/cart/summary` | ✅ MATCHED | GET |

#### Reviews Endpoints
| Frontend | Backend | Status | Method |
|----------|---------|--------|--------|
| `/api/reviews/product/:productId` | `/reviews/product/:productId` | ✅ MATCHED | GET |
| `/api/reviews/product/:productId/stats` | `/reviews/product/:productId/stats` | ✅ MATCHED | GET |
| `/api/reviews` | `/reviews` | ✅ MATCHED | POST |
| `/api/reviews/:id` | `/reviews/:id` | ✅ MATCHED | PATCH |
| `/api/reviews/:id` | `/reviews/:id` | ✅ MATCHED | DELETE |
| `/api/reviews/:id/helpful` | `/reviews/:id/helpful` | ✅ MATCHED | POST |
| `/api/reviews/user` | `/reviews/user` | ✅ MATCHED | GET |

#### Blog Endpoints
| Frontend | Backend | Status | Method |
|----------|---------|--------|--------|
| `/api/blog/posts` | `/blog/posts` | ✅ MATCHED | GET |
| `/api/blog/posts/:slug` | `/blog/posts/:slug` | ✅ MATCHED | GET |
| `/api/blog/categories` | `/blog/categories` | ✅ MATCHED | GET |
| `/api/blog/tags` | `/blog/tags` | ✅ MATCHED | GET |
| `/api/blog/admin/posts` | `/blog/admin/posts` | ✅ MATCHED | GET |
| `/api/blog/admin/posts/:id` | `/blog/admin/posts/:id` | ✅ MATCHED | GET |
| `/api/blog/posts` | `/blog/posts` | ✅ MATCHED | POST |
| `/api/blog/posts/:id` | `/blog/posts/:id` | ✅ MATCHED | PUT |
| `/api/blog/posts/:id` | `/blog/posts/:id` | ✅ MATCHED | DELETE |

#### Addresses Endpoints
| Frontend | Backend | Status | Method |
|----------|---------|--------|--------|
| `/api/addresses` | `/addresses` | ✅ MATCHED | GET |
| `/api/addresses/default` | `/addresses/default` | ✅ MATCHED | GET |
| `/api/addresses/:id` | `/addresses/:id` | ✅ MATCHED | GET |
| `/api/addresses` | `/addresses` | ✅ MATCHED | POST |
| `/api/addresses/:id` | `/addresses/:id` | ✅ MATCHED | PATCH |
| `/api/addresses/:id` | `/addresses/:id` | ✅ MATCHED | DELETE |
| `/api/addresses/:id/default` | `/addresses/:id/default` | ✅ MATCHED | POST |

#### Users Endpoints
| Frontend | Backend | Status | Method |
|----------|---------|--------|--------|
| `/api/users/me` | `/users/me` | ✅ MATCHED | GET |
| `/api/users/me` | `/users/me` | ✅ MATCHED | PATCH |
| `/api/users/me/password` | `/users/me/password` | ✅ MATCHED | POST |
| `/api/users/me/avatar` | `/users/me/avatar` | ✅ MATCHED | POST |
| `/api/users/me/account` | `/users/me/account` | ✅ MATCHED | DELETE |

#### Payments Endpoints
| Frontend | Backend | Status | Method |
|----------|---------|--------|--------|
| `/api/payments/create` | `/payments/create` | ✅ MATCHED | POST |
| `/api/payments/verify/razorpay` | `/payments/verify/razorpay` | ✅ MATCHED | POST |
| `/api/payments/status/:orderId` | `/payments/status/:orderId` | ✅ MATCHED | GET |
| `/api/payments/refund` | `/payments/refund` | ✅ MATCHED | POST |

#### Orders Endpoints
| Frontend | Backend | Status | Method |
|----------|---------|--------|--------|
| `/api/orders` | `/orders` | ✅ MATCHED | GET |
| `/api/orders/:id` | `/orders/:id` | ✅ MATCHED | GET |
| `/api/orders/:id/status` | Not Found | ⚠️ FRONTEND ISSUE | PATCH |
| `/api/orders/:id/refund` | Not Found | ⚠️ FRONTEND ISSUE | POST |
| `/api/orders/search` | Not Found | ⚠️ FRONTEND ISSUE | GET |
| `/api/orders/export` | Not Found | ⚠️ FRONTEND ISSUE | GET |

#### Customers Endpoints
| Frontend | Backend | Status | Method |
|----------|---------|--------|--------|
| `/api/customers` | `/customers` | ✅ MATCHED | GET |
| `/api/customers/:id` | `/customers/:id` | ✅ MATCHED | GET |
| `/api/customers/search` | Not Found | ⚠️ FRONTEND ISSUE | GET |
| `/api/customers/export` | Not Found | ⚠️ FRONTEND ISSUE | GET |

---

### ⚠️ ENDPOINTS WITH FRONTEND ISSUES

#### 1. Products Controller
**File**: `ayurveda-api/src/products/products.controller.ts`

**Missing Endpoints**:
- ✅ Backend supports: `/products/search` (GET) with query parameter `q` for search
- ❌ Frontend calling: `/api/products/search` (GET)
- ❌ Frontend calling: `/api/products/:id/stock` (PATCH)

**Solution**:
```typescript
// Update ayurveda-shop/lib/api/products.ts
search: async (query: string, params?: PageRequest): Promise<PageResponse<ProductResponse>> => {
  return apiClient.get<PageResponse<ProductResponse>>('/api/products/search', {
    params: { q: query, ...params },
  });
},

updateStock: async (id: number, quantity: number): Promise<ProductResponse> => {
  return apiClient.patch<ProductResponse>(`/api/products/${id}/stock`, { quantity });
},
```

#### 2. Orders Controller
**File**: `ayurveda-api/src/orders/orders.controller.ts`

**Missing Endpoints**:
- ✅ Backend supports: `/orders/:id/cancel` (PATCH)
- ✅ Backend supports: `/orders/:id/track` (GET)
- ❌ Frontend calling: `/api/orders/:id/status` (PATCH)
- ❌ Frontend calling: `/api/orders/:id/refund` (POST)
- ❌ Frontend calling: `/api/orders/search` (GET)
- ❌ Frontend calling: `/api/orders/export` (GET)

**Solution**:
```typescript
// Update ayurveda-shop/lib/api/orders.ts
cancelOrder: async (id: number, reason?: string): Promise<OrderDetailResponse> => {
  return apiClient.patch<OrderDetailResponse>(`/api/orders/${id}/cancel`, { reason });
},

trackOrder: async (id: number): Promise<any> => {
  return apiClient.get(`/api/orders/${id}/track`);
},

search: async (query: string, params?: PageRequest): Promise<PageResponse<OrderListResponse>> => {
  return apiClient.get<PageResponse<OrderListResponse>>('/api/orders/search', {
    params: { q: query, ...params },
  });
},

exportOrders: async (params?: { startDate?: string; endDate?: string }): Promise<Blob> => {
  return apiClient.get<Blob>('/api/orders/export', {
    params,
    responseType: 'blob',
  });
},
```

#### 3. Customers Controller
**File**: `ayurveda-api/src/customers/customers.controller.ts`

**Missing Endpoints**:
- ✅ Backend supports: `/customers/:id/stats` (GET)
- ❌ Frontend calling: `/api/customers/search` (GET)
- ❌ Frontend calling: `/api/customers/export` (GET)

**Solution**:
```typescript
// Update ayurveda-shop/lib/api/customers.ts
search: async (query: string, params?: PageRequest): Promise<PageResponse<Customer>> => {
  return apiClient.get<PageResponse<Customer>>('/api/customers/search', {
    params: { q: query, ...params },
  });
},

exportCustomers: async (): Promise<Blob> => {
  return apiClient.get<Blob>('/api/customers/export', {
    responseType: 'blob',
  });
},
```

---

## Authentication & Authorization

### Token Management Flow

#### 1. Login Flow
```typescript
// Frontend: ayurveda-shop/lib/api/auth.ts
export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>('/api/auth/login', credentials);
  },
  // ... other methods
}
```

**Backend Response**:
```typescript
// ayurveda-api/src/auth/auth.service.ts
{
  accessToken: string,
  refreshToken: string,
  user: {
    id: string,
    email: string,
    firstName: string,
    lastName: string,
    // ... other user fields
  }
}
```

#### 2. Token Refresh Flow
```typescript
// Frontend: ayurveda-shop/lib/api/client.ts (lines 44-48)
const { data } = await axios.post(`${API_BASE_URL}/api/auth/refresh`, null, {
  headers: {
    'X-Refresh-Token': refreshToken,
  },
});
```

**Backend Response**:
```typescript
// ayurveda-api/src/auth/auth.service.ts
{
  accessToken: string,
  refreshToken: string
}
```

#### 3. JWT Token Configuration
**Backend**: `ayurveda-api/.env`
```env
JWT_SECRET=super-secret-jwt-key-change-in-production-min-32-characters-long
JWT_REFRESH_SECRET=super-secret-refresh-key-change-in-production-min-32-chars
```

**Frontend**: `ayurveda-shop/lib/api/client.ts`
- Access token stored in: `localStorage.admin_access_token`
- Refresh token stored in: `localStorage.admin_refresh_token`

#### 4. Request Interceptor
```typescript
// Frontend: ayurveda-shop/lib/api/client.ts (lines 18-29)
this.client.interceptors.request.use(
  (config) => {
    const token = this.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

#### 5. Response Interceptor
```typescript
// Frontend: ayurveda-shop/lib/api/client.ts (lines 32-78)
this.client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Handle 401 errors and refresh tokens
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = this.getRefreshToken();
        if (refreshToken) {
          const { data } = await axios.post(`${API_BASE_URL}/api/auth/refresh`, null, {
            headers: {
              'X-Refresh-Token': refreshToken,
            },
          });

          this.setTokens(data.accessToken, data.refreshToken);

          // Retry original request
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          }
          return this.client(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        this.clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/admin/login';
        }
        return Promise.resolve({ data: null } as any);
      }
    }

    // Suppress 401 console errors (expected when not logged in)
    if (error.response?.status === 401) {
      console.debug('Unauthorized request - authentication required');
      return Promise.resolve({ data: null } as any);
    }

    return Promise.reject(error);
  }
);
```

### API Endpoint Access Levels

#### Public Endpoints (No Authentication Required)
- Products: `GET /products`, `GET /products/:id`, `GET /products/slug/:slug`
- Auth: `POST /api/auth/login`, `POST /api/auth/refresh`
- Blog: `GET /blog/posts`, `GET /blog/posts/:slug`, `GET /blog/categories`, `GET /blog/tags`
- Reviews: `GET /reviews/product/:productId`, `GET /reviews/product/:productId/stats`
- Cart: `GET /cart`, `POST /cart/items`, `PATCH /cart/items/:itemId`, `DELETE /cart/items/:itemId`, `DELETE /cart`, `GET /cart/summary`
- Payments: `POST /payments/webhook/razorpay`

#### Protected Endpoints (Authentication Required)
- Orders: All `/orders` endpoints
- Reviews: `POST /reviews`, `PATCH /reviews/:id`, `DELETE /reviews/:id`, `POST /reviews/:id/helpful`, `GET /reviews/user`
- Addresses: All `/addresses` endpoints
- Users: All `/users` endpoints
- Payments: All `/payments` endpoints (except webhook)

#### Admin-Only Endpoints
Products: `POST /products`, `PUT /products/:id`, `DELETE /products/:id`
Customers: `GET /customers`, `GET /customers/:id`, `GET /customers/:id/stats`, `PATCH /customers/:id`
Blog: `GET /blog/admin/posts`, `GET /blog/admin/posts/:id`, `POST /blog/posts`, `PUT /blog/posts/:id`, `DELETE /blog/posts/:id`
Payments: `POST /payments/refund`

---

## Error Handling

### Error Response Structure

#### Generic Error Response
```typescript
{
  statusCode: number,
  message: string,
  error: string,
  errors?: Array<{
    field: string,
    message: string
  }>,
  timestamp: string,
  path: string,
  method: string
}
```

### Common HTTP Status Codes

#### 200 OK
- Successful GET, PUT, DELETE requests
- Order cancellation successful

#### 201 Created
- Successful POST requests (create product, blog post, order)

#### 204 No Content
- Successful DELETE requests
- 2FA disabled successfully

#### 400 Bad Request
- Invalid input data
- Insufficient stock
- Invalid credentials
- Product already exists
- Cannot cancel order in current status

#### 401 Unauthorized
- Missing or invalid JWT token
- Session expired (handled by automatic token refresh)

#### 403 Forbidden
- Insufficient permissions
- Attempting to access someone else's order

#### 404 Not Found
- Product, order, customer not found
- Review not found
- Invalid slug

#### 409 Conflict
- Product with slug already exists
- Email already in use

#### 500 Internal Server Error
- Database connection issues
- Unexpected server errors

### Frontend Error Handling

```typescript
// ayurveda-shop/lib/api/client.ts
this.client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Error handling logic
    if (error.response?.status === 401) {
      console.debug('Unauthorized request - authentication required');
      return Promise.resolve({ data: null } as any);
    }

    return Promise.reject(error);
  }
);
```

---

## Request/Response Formats

### Common Types

#### Page Request & Response
```typescript
interface PageRequest {
  page?: number;    // Default: 0
  size?: number;    // Default: 10
}

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}
```

### Product Types
```typescript
interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  originalPrice?: number;
  stock?: number;
  image?: string;
  category?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductResponse {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  originalPrice?: number;
  stock?: number;
  image?: string;
  category?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateProductDto {
  name: string;
  slug: string;
  description?: string;
  price: number;
  originalPrice?: number;
  stock?: number;
  image?: string;
  category?: string;
  status: string;
}
```

### Order Types
```typescript
interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  items: any[];
  createdAt: string;
}

interface OrderDetailResponse {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  items: any[];
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
  shippingAddress?: any;
}

interface CreateOrderDto {
  items: any[];
  shippingAddress: any;
  paymentMethod: string;
  couponCode?: string;
}
```

### Cart Types
```typescript
interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  variantId?: string;
  lineTotal: number;
}

interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  updatedAt: string;
}

interface CartSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
  freeShippingThreshold: number;
  amountToFreeShipping: number;
}
```

---

## Migration Recommendations

### 1. Fix Frontend API Endpoint Issues

#### Update Products API
```typescript
// ayurveda-shop/lib/api/products.ts
export const productsApi = {
  getAll: async (params?: PageRequest): Promise<PageResponse<ProductResponse>> => {
    return apiClient.get<PageResponse<ProductResponse>>('/api/products', { params });
  },

  getById: async (id: number): Promise<ProductResponse> => {
    return apiClient.get<ProductResponse>(`/api/products/${id}`);
  },

  create: async (product: ProductCreateRequest): Promise<ProductResponse> => {
    return apiClient.post<ProductResponse>('/api/products', product);
  },

  update: async (id: number, product: ProductUpdateRequest): Promise<ProductResponse> => {
    return apiClient.put<ProductResponse>(`/api/products/${id}`, product);
  },

  delete: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/api/products/${id}`);
  },

  // FIX: Add search endpoint
  search: async (query: string, params?: PageRequest): Promise<PageResponse<ProductResponse>> => {
    return apiClient.get<PageResponse<ProductResponse>>('/api/products/search', {
      params: { q: query, ...params },
    });
  },

  // FIX: Add stock update endpoint
  updateStock: async (id: number, quantity: number): Promise<ProductResponse> => {
    return apiClient.patch<ProductResponse>(`/api/products/${id}/stock`, { quantity });
  },
};
```

#### Update Orders API
```typescript
// ayurveda-shop/lib/api/orders.ts
export const ordersApi = {
  getAll: async (params?: PageRequest): Promise<PageResponse<OrderListResponse>> => {
    return apiClient.get<PageResponse<OrderListResponse>>('/api/orders', { params });
  },

  getById: async (id: number): Promise<OrderDetailResponse> => {
    return apiClient.get<OrderDetailResponse>(`/api/orders/${id}`);
  },

  // FIX: Update to match backend endpoint
  updateStatus: async (id: number, status: string): Promise<OrderDetailResponse> => {
    return apiClient.patch<OrderDetailResponse>(`/api/orders/${id}/status`, { status });
  },

  // FIX: Add cancel endpoint (backend uses cancel, not refund for order status)
  cancel: async (id: number, reason?: string): Promise<OrderDetailResponse> => {
    return apiClient.patch<OrderDetailResponse>(`/api/orders/${id}/cancel`, { reason });
  },

  // FIX: Add track endpoint
  track: async (id: number): Promise<any> => {
    return apiClient.get(`/api/orders/${id}/track`);
  },

  // FIX: Add search endpoint
  search: async (query: string, params?: PageRequest): Promise<PageResponse<OrderListResponse>> => {
    return apiClient.get<PageResponse<OrderListResponse>>('/api/orders/search', {
      params: { q: query, ...params },
    });
  },

  // FIX: Add export endpoint
  exportOrders: async (params?: { startDate?: string; endDate?: string }): Promise<Blob> => {
    return apiClient.get<Blob>('/api/orders/export', {
      params,
      responseType: 'blob',
    });
  },

  // FIX: Update processRefund to use correct endpoint
  processRefund: async (id: number, amount: number, reason: string): Promise<OrderDetailResponse> => {
    return apiClient.post<OrderDetailResponse>(`/api/orders/${id}/refund`, { amount, reason });
  },
};
```

#### Update Customers API
```typescript
// ayurveda-shop/lib/api/customers.ts
export const customersApi = {
  getAll: async (params?: PageRequest): Promise<PageResponse<Customer>> => {
    return apiClient.get<PageResponse<Customer>>('/api/customers', { params });
  },

  getById: async (id: number): Promise<Customer> => {
    return apiClient.get<Customer>(`/api/customers/${id}`);
  },

  // FIX: Add search endpoint
  search: async (query: string, params?: PageRequest): Promise<PageResponse<Customer>> => {
    return apiClient.get<PageResponse<Customer>>('/api/customers/search', {
      params: { q: query, ...params },
    });
  },

  // FIX: Add stats endpoint
  getStats: async (id: number): Promise<any> => {
    return apiClient.get(`/api/customers/${id}/stats`);
  },

  // FIX: Add export endpoint
  exportCustomers: async (): Promise<Blob> => {
    return apiClient.get<Blob>('/api/customers/export', {
      responseType: 'blob',
    });
  },
};
```

### 2. Update Admin API

```typescript
// ayurveda-shop/lib/api/admin.ts
export const adminApi = {
  // Dashboard Stats
  getDashboardStats: async () => {
    return apiClient.get('/api/admin/dashboard/stats');
  },

  // Orders
  getOrders: async (params?: {
    page?: number;
    size?: number;
    status?: string;
    paymentStatus?: string;
    fulfillmentStatus?: string;
    fromDate?: string;
    toDate?: string;
    customerEmail?: string;
  }): Promise<PageResponse<Order>> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiClient.get(`/api/orders?${queryParams.toString()}`);
  },

  getOrder: async (orderId: string): Promise<Order> => {
    return apiClient.get(`/api/orders/${orderId}`);
  },

  updateOrderStatus: async (orderId: string, status: string): Promise<Order> => {
    return apiClient.patch(`/api/orders/${orderId}/status`, { status });
  },

  cancelOrder: async (orderId: string, reason?: string): Promise<Order> => {
    return apiClient.patch(`/api/orders/${orderId}/cancel`, { reason });
  },

  processRefund: async (orderId: string, amount: number, reason: string): Promise<Order> => {
    return apiClient.post(`/api/orders/${orderId}/refund`, { amount, reason });
  },

  // Products
  getProducts: async (params?: {
    page?: number;
    size?: number;
    search?: string;
    status?: string;
    category?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiClient.get(`/api/products?${queryParams.toString()}`);
  },

  getProduct: async (productId: string) => {
    return apiClient.get(`/api/products/${productId}`);
  },

  createProduct: async (data: any) => {
    return apiClient.post('/api/products', data);
  },

  updateProduct: async (productId: string, data: any) => {
    return apiClient.put(`/api/products/${productId}`, data);
  },

  deleteProduct: async (productId: string) => {
    return apiClient.delete(`/api/products/${productId}`);
  },

  // Customers
  getCustomers: async (params?: {
    page?: number;
    size?: number;
    search?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiClient.get(`/api/customers?${queryParams.toString()}`);
  },

  getCustomer: async (customerId: string) => {
    return apiClient.get(`/api/customers/${customerId}`);
  },
};

// Export individual API modules for better organization
export const ordersApi = {
  list: adminApi.getOrders,
  get: adminApi.getOrder,
  updateStatus: adminApi.updateOrderStatus,
  cancel: adminApi.cancelOrder,
  refund: adminApi.processRefund,
  search: adminApi.search,
  export: adminApi.exportOrders,
};

export const productsApi = {
  list: adminApi.getProducts,
  get: adminApi.getProduct,
  create: adminApi.createProduct,
  update: adminApi.updateProduct,
  delete: adminApi.deleteProduct,
};

export const customersApi = {
  list: adminApi.getCustomers,
  get: adminApi.getCustomer,
  search: adminApi.search,
  export: adminApi.exportCustomers,
};
```

### 3. Environment Configuration

#### Update Frontend `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:3333
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

#### Update Backend `.env`
```env
DATABASE_URL=postgresql://postgres:postgres:root@localhost:5433/ayurveda_admin
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars
PORT=3333
NODE_ENV=development
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

---

## Testing & Validation

### Test Endpoint Coverage

#### 1. Run Backend Tests
```bash
cd ayurveda-api
npm run test
```

#### 2. Run E2E Tests
```bash
cd ayurveda-api
npm run test:e2e
```

#### 3. Test API Endpoints Manually

**Login Test**:
```bash
curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

**Get Products Test**:
```bash
curl -X GET http://localhost:3333/products?page=0&size=10
```

**Get Cart Test**:
```bash
curl -X GET http://localhost:3333/cart \
  -H "x-session-id: your-session-id"
```

### Validation Checklist

- [ ] Verify all endpoints match between frontend and backend
- [ ] Test authentication flow (login, token refresh, logout)
- [ ] Test authorization (admin vs customer roles)
- [ ] Test error handling (401, 403, 404, 500)
- [ ] Test pagination and filtering
- [ ] Test file uploads (products)
- [ ] Test payment processing (Razorpay)
- [ ] Test order tracking
- [ ] Test cart operations (guest and authenticated)
- [ ] Test blog content management
- [ ] Test address management
- [ ] Test review submission and management
- [ ] Test customer statistics
- [ ] Test export functionality

### Monitoring and Logging

#### Backend Logging
```typescript
// ayurveda-api/src/main.ts
console.log(`Server running on port ${process.env.PORT}`);
```

#### Frontend Error Tracking
```typescript
// ayurveda-shop/lib/api/client.ts
this.client.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);
```

---

## Conclusion

This documentation provides a comprehensive overview of the Ayurveda Shop and API integration. The frontend and backend are largely compatible, with several endpoints requiring updates to match the backend implementation. The recommended migrations focus on aligning frontend API calls with the actual backend endpoints, particularly for search functionality, order management, and customer statistics.

The authentication system uses JWT tokens with automatic refresh functionality, providing a seamless user experience. Error handling is implemented at both frontend and backend levels, with appropriate HTTP status codes and error messages.

## Support and Troubleshooting

For issues related to:
- **Database connection**: Check PostgreSQL is running on port 5433
- **Authentication**: Verify JWT_SECRET and JWT_REFRESH_SECRET are properly configured
- **API calls**: Ensure NEXT_PUBLIC_API_URL matches backend PORT setting
- **CORS**: Check CORS_ORIGINS in backend .env file

For additional support, refer to:
- Backend documentation: `ayurveda-api/README.md`
- Frontend API documentation: `ayurveda-shop/lib/api/` directory
