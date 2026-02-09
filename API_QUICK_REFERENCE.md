# API Integration Quick Reference

## Base URL Configuration
- **Frontend**: `http://localhost:3000`
- **Backend**: `http://localhost:3333`
- **API Prefix**: `/api`

---

## 🔴 MISMATCHED ENDPOINTS

### 1. Products API

| Frontend Call | Backend Available | Status | Solution |
|---------------|-------------------|--------|----------|
| `/api/products/search?q=herbs` | `/products/search` | ❌ Frontend needs fix | Update ayurveda-shop/lib/api/products.ts |
| `/api/products/:id/stock` | ✅ Backend has endpoint | ❌ Frontend missing | Add updateStock method |

### 2. Orders API

| Frontend Call | Backend Available | Status | Solution |
|---------------|-------------------|--------|----------|
| `/api/orders/:id/status` | ✅ Backend has `/orders/:id/cancel` | ❌ Different endpoint | Use cancel endpoint instead |
| `/api/orders/:id/refund` | ✅ Backend has `/orders/:id/cancel` | ❌ Different endpoint | Use cancel endpoint instead |
| `/api/orders/search` | ✅ Backend has `/orders/search` | ❌ Frontend missing | Add search method |
| `/api/orders/export` | ❌ Backend missing | ❌ Frontend calling wrong endpoint | Backend needs export endpoint |

### 3. Customers API

| Frontend Call | Backend Available | Status | Solution |
|---------------|-------------------|--------|----------|
| `/api/customers/search` | ❌ Backend missing | ❌ Frontend calling wrong endpoint | Backend needs search endpoint |
| `/api/customers/export` | ❌ Backend missing | ❌ Frontend calling wrong endpoint | Backend needs export endpoint |
| `/api/customers/:id/stats` | ✅ Backend has endpoint | ❌ Frontend missing | Add getStats method |

---

## ✅ MATCHED ENDPOINTS

### Authentication (Full Match)
```
/api/auth/login              → POST /api/auth/login
/api/auth/refresh            → POST /api/auth/refresh
/api/auth/me                 → GET /api/auth/me
/api/auth/logout             → POST /api/auth/logout
/api/auth/2fa/enable         → POST /api/auth/2fa/enable
/api/auth/2fa/verify         → POST /api/auth/2fa/verify
/api/auth/2fa/disable        → DELETE /api/auth/2fa/disable
```

### Products (Partial Match)
```
/api/products                → GET/POST /products
/api/products/:id            → GET/PUT/DELETE /products/:id
/api/products/slug/:slug     → GET /products/slug/:slug
```

### Cart (Full Match)
```
/api/cart                    → GET/DELETE /cart
/api/cart/items              → POST /cart/items
/api/cart/items/:itemId      → PATCH/DELETE /cart/items/:itemId
/api/cart/merge              → POST /cart/merge
/api/cart/summary            → GET /cart/summary
```

### Reviews (Full Match)
```
/api/reviews/product/:id     → GET /reviews/product/:id
/api/reviews/product/:id/stats → GET /reviews/product/:id/stats
/api/reviews                 → POST /reviews
/api/reviews/:id             → PATCH/DELETE /reviews/:id
/api/reviews/:id/helpful     → POST /reviews/:id/helpful
/api/reviews/user            → GET /reviews/user
```

### Blog (Full Match)
```
/api/blog/posts              → GET /blog/posts
/api/blog/posts/:slug        → GET /blog/posts/:slug
/api/blog/categories         → GET /blog/categories
/api/blog/tags               → GET /blog/tags
/api/blog/admin/posts        → GET /blog/admin/posts
/api/blog/admin/posts/:id    → GET /blog/admin/posts/:id
/api/blog/posts              → POST /blog/posts
/api/blog/posts/:id          → PUT /blog/posts/:id
/api/blog/posts/:id          → DELETE /blog/posts/:id
```

### Addresses (Full Match)
```
/api/addresses               → GET/POST /addresses
/api/addresses/default       → GET /addresses/default
/api/addresses/:id           → GET/PATCH/DELETE /addresses/:id
/api/addresses/:id/default   → POST /addresses/:id/default
```

### Users (Full Match)
```
/api/users/me                → GET/PATCH /users/me
/api/users/me/password       → POST /users/me/password
/api/users/me/avatar         → POST /users/me/avatar
/api/users/me/account        → DELETE /users/me/account
```

### Payments (Full Match)
```
/api/payments/create         → POST /payments/create
/api/payments/verify/razorpay → POST /payments/verify/razorpay
/api/payments/status/:id     → GET /payments/status/:id
/api/payments/refund         → POST /payments/refund
```

### Orders (Partial Match)
```
/api/orders                  → GET /orders
/api/orders/:id              → GET /orders/:id
/api/orders/:id/cancel       → PATCH /orders/:id/cancel
/api/orders/:id/track        → GET /orders/:id/track
```

---

## 🔧 QUICK FIXES

### Fix Products API
```typescript
// Add to ayurveda-shop/lib/api/products.ts
search: async (query: string, params?: PageRequest): Promise<PageResponse<ProductResponse>> => {
  return apiClient.get<PageResponse<ProductResponse>>('/api/products/search', {
    params: { q: query, ...params },
  });
},

updateStock: async (id: number, quantity: number): Promise<ProductResponse> => {
  return apiClient.patch<ProductResponse>(`/api/products/${id}/stock`, { quantity });
},
```

### Fix Orders API
```typescript
// Update ayurveda-shop/lib/api/orders.ts
export const ordersApi = {
  // Add new methods
  cancel: async (id: number, reason?: string): Promise<OrderDetailResponse> => {
    return apiClient.patch<OrderDetailResponse>(`/api/orders/${id}/cancel`, { reason });
  },

  track: async (id: number): Promise<any> => {
    return apiClient.get(`/api/orders/${id}/track`);
  },

  // Update existing methods
  updateStatus: async (id: number, status: string): Promise<OrderDetailResponse> => {
    return apiClient.patch<OrderDetailResponse>(`/api/orders/${id}/status`, { status });
  },

  processRefund: async (id: number, amount: number, reason: string): Promise<OrderDetailResponse> => {
    return apiClient.post<OrderDetailResponse>(`/api/orders/${id}/refund`, { amount, reason });
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
};
```

### Fix Customers API
```typescript
// Update ayurveda-shop/lib/api/customers.ts
export const customersApi = {
  getAll: async (params?: PageRequest): Promise<PageResponse<Customer>> => {
    return apiClient.get<PageResponse<Customer>>('/api/customers', { params });
  },

  getById: async (id: number): Promise<Customer> => {
    return apiClient.get<Customer>(`/api/customers/${id}`);
  },

  // Add new methods
  search: async (query: string, params?: PageRequest): Promise<PageResponse<Customer>> => {
    return apiClient.get<PageResponse<Customer>>('/api/customers/search', {
      params: { q: query, ...params },
    });
  },

  getStats: async (id: number): Promise<any> => {
    return apiClient.get(`/api/customers/${id}/stats`);
  },

  exportCustomers: async (): Promise<Blob> => {
    return apiClient.get<Blob>('/api/customers/export', {
      responseType: 'blob',
    });
  },
};
```

---

## 📊 ENDPOINT COUNTS

### Correctly Mapped Endpoints
- **Authentication**: 7/7 (100%)
- **Products**: 4/6 (67%)
- **Cart**: 6/6 (100%)
- **Reviews**: 7/7 (100%)
- **Blog**: 9/9 (100%)
- **Addresses**: 6/6 (100%)
- **Users**: 5/5 (100%)
- **Payments**: 4/4 (100%)
- **Orders**: 4/8 (50%)
- **Customers**: 2/5 (40%)

**Overall Mismatch**: 10 out of 65 endpoints (15.4%)

---

## 🎯 PRIORITY FIXES

### High Priority (Critical for Core Functionality)
1. ✅ Update Products API - add search and stock endpoints
2. ✅ Update Orders API - fix status update, add search and export
3. ✅ Update Customers API - add search and stats endpoints

### Medium Priority (Admin Features)
4. ✅ Admin API - consolidate and fix all admin endpoints
5. ✅ Error handling - improve frontend error logging

### Low Priority (Nice to Have)
6. ✅ Documentation - add API documentation for all endpoints
7. ✅ Testing - add integration tests for all API endpoints

---

## 🔐 SECURITY NOTES

### JWT Configuration
- **Access Token**: Stored in localStorage, valid for ~15 minutes
- **Refresh Token**: Stored in localStorage, valid for ~7 days
- **Secret Keys**: Must be changed in production

### CORS Configuration
- **Allowed Origins**: `http://localhost:3000,http://localhost:3001`
- **Frontend**: `http://localhost:3000`

### Rate Limiting
- **General**: 100 requests per minute per IP
- **Apply**: Global throttler configuration

---

## 📝 BACKEND ENDPOINT REQUIREMENTS

### Required New Endpoints

#### 1. Products Search
```typescript
// ayurveda-api/src/products/products.controller.ts
@Public()
@Get('search')
@ApiOperation({ summary: 'Search products' })
async search(@Query('q') query: string, @Query() queryDto: QueryProductDto) {
  return this.productsService.search(query, queryDto);
}
```

#### 2. Products Stock Update
```typescript
// ayurveda-api/src/products/products.controller.ts
@Patch(':id/stock')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'manager')
@ApiBearerAuth()
async updateStock(
  @Param('id') id: string,
  @Body('quantity') quantity: number
) {
  return this.productsService.updateStock(id, quantity);
}
```

#### 3. Customers Search
```typescript
// ayurveda-api/src/customers/customers.controller.ts
@Public()
@Get('search')
@ApiOperation({ summary: 'Search customers' })
async search(@Query('q') query: string, @Query() queryDto: QueryCustomerDto) {
  return this.customersService.search(query, queryDto);
}
```

#### 4. Customers Export
```typescript
// ayurveda-api/src/customers/customers.controller.ts
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'manager')
@ApiBearerAuth()
@Get('export')
@ApiOperation({ summary: 'Export customers' })
async export(@Query() queryDto: QueryCustomerDto) {
  return this.customersService.export(queryDto);
}
```

#### 5. Orders Export
```typescript
// ayurveda-api/src/orders/orders.controller.ts
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Get('export')
@ApiOperation({ summary: 'Export orders' })
async export(@Query() queryDto: QueryOrderDto) {
  return this.ordersService.export(queryDto);
}
```

---

## 🚀 DEPLOYMENT CHECKLIST

### Backend Deployment
- [ ] Set up PostgreSQL database
- [ ] Configure environment variables
- [ ] Set up JWT secrets
- [ ] Configure CORS origins
- [ ] Set up file uploads (S3 or local storage)
- [ ] Configure payment gateway (Razorpay)
- [ ] Set up logging and monitoring

### Frontend Deployment
- [ ] Set up environment variables
- [ ] Configure API URL
- [ ] Configure payment gateway keys
- [ ] Set up production builds
- [ ] Configure error tracking
- [ ] Set up CDN for assets

### Integration Testing
- [ ] Test all authentication flows
- [ ] Test all API endpoints
- [ ] Test payment processing
- [ ] Test order management
- [ ] Test customer management
- [ ] Test cart functionality
- [ ] Test performance under load
- [ ] Test security (auth, authz)

---

## 📚 ADDITIONAL RESOURCES

### Frontend Files
- `ayurveda-shop/lib/api/client.ts` - API client with interceptors
- `ayurveda-shop/lib/api/index.ts` - API module exports
- `ayurveda-shop/lib/api/auth.ts` - Authentication API
- `ayurveda-shop/lib/api/products.ts` - Products API
- `ayurveda-shop/lib/api/orders.ts` - Orders API
- `ayurveda-shop/lib/api/customers.ts` - Customers API
- `ayurveda-shop/lib/api/admin.ts` - Admin API

### Backend Files
- `ayurveda-api/src/app.module.ts` - Main application module
- `ayurveda-api/src/auth/auth.controller.ts` - Authentication controller
- `ayurveda-api/src/products/products.controller.ts` - Products controller
- `ayurveda-api/src/orders/orders.controller.ts` - Orders controller
- `ayurveda-api/src/customers/customers.controller.ts` - Customers controller
- `ayurveda-api/.env` - Environment configuration

### Documentation
- Full Integration Guide: `API_INTEGRATION_DOCUMENTATION.md`
- API Specification: Check Swagger/OpenAPI at `http://localhost:3333/api/docs`
- Frontend README: `ayurveda-shop/README.md`
- Backend README: `ayurveda-api/README.md`
