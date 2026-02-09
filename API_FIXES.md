# API Integration Fixes - Ready-to-Use Code

## 🚀 Quick Fixes for Integration Issues

### 1. Fix Products API (`ayurveda-shop/lib/api/products.ts`)

```typescript
import { apiClient } from './client';
import {
  Product,
  ProductCreateRequest,
  ProductUpdateRequest,
  ProductResponse,
  PageRequest,
  PageResponse,
} from './types';

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

  // ✅ FIX: Add search endpoint (backend has /products/search, frontend was missing it)
  search: async (query: string, params?: PageRequest): Promise<PageResponse<ProductResponse>> => {
    return apiClient.get<PageResponse<ProductResponse>>('/api/products/search', {
      params: { q: query, ...params },
    });
  },

  // ✅ FIX: Add stock update endpoint (backend has /products/:id/stock)
  updateStock: async (id: number, quantity: number): Promise<ProductResponse> => {
    return apiClient.patch<ProductResponse>(`/api/products/${id}/stock`, { quantity });
  },
};
```

---

### 2. Fix Orders API (`ayurveda-shop/lib/api/orders.ts`)

```typescript
import { apiClient } from './client';
import {
  Order,
  OrderListResponse,
  OrderDetailResponse,
  OrderStatusUpdateRequest,
  OrderRefundRequest,
  PageRequest,
  PageResponse,
} from './types';

export const ordersApi = {
  getAll: async (params?: PageRequest): Promise<PageResponse<OrderListResponse>> => {
    return apiClient.get<PageResponse<OrderListResponse>>('/api/orders', { params });
  },

  getById: async (id: number): Promise<OrderDetailResponse> => {
    return apiClient.get<OrderDetailResponse>(`/api/orders/${id}`);
  },

  // ✅ FIX: Update to use backend's cancel endpoint instead of status
  cancel: async (id: number, reason?: string): Promise<OrderDetailResponse> => {
    return apiClient.patch<OrderDetailResponse>(`/api/orders/${id}/cancel`, { reason });
  },

  // ✅ FIX: Add tracking endpoint (backend has /orders/:id/track)
  track: async (id: number): Promise<any> => {
    return apiClient.get(`/api/orders/${id}/track`);
  },

  // ✅ FIX: Update to match backend's refund endpoint
  processRefund: async (id: number, amount: number, reason: string): Promise<OrderDetailResponse> => {
    return apiClient.post<OrderDetailResponse>(`/api/orders/${id}/refund`, { amount, reason });
  },

  // ✅ FIX: Add search endpoint
  search: async (query: string, params?: PageRequest): Promise<PageResponse<OrderListResponse>> => {
    return apiClient.get<PageResponse<OrderListResponse>>('/api/orders/search', {
      params: { q: query, ...params },
    });
  },

  // ✅ FIX: Add export endpoint
  exportOrders: async (params?: { startDate?: string; endDate?: string }): Promise<Blob> => {
    return apiClient.get<Blob>('/api/orders/export', {
      params,
      responseType: 'blob',
    });
  },

  // ✅ FIX: Add payment method support
  updatePaymentStatus: async (id: number, paymentStatus: string): Promise<OrderDetailResponse> => {
    return apiClient.patch<OrderDetailResponse>(`/api/orders/${id}/payment-status`, { paymentStatus });
  },
};
```

---

### 3. Fix Customers API (`ayurveda-shop/lib/api/customers.ts`)

```typescript
import { apiClient } from './client';
import { Customer, PageRequest, PageResponse } from './types';

export const customersApi = {
  getAll: async (params?: PageRequest): Promise<PageResponse<Customer>> => {
    return apiClient.get<PageResponse<Customer>>('/api/customers', { params });
  },

  getById: async (id: number): Promise<Customer> => {
    return apiClient.get<Customer>(`/api/customers/${id}`);
  },

  // ✅ FIX: Add search endpoint
  search: async (query: string, params?: PageRequest): Promise<PageResponse<Customer>> => {
    return apiClient.get<PageResponse<Customer>>('/api/customers/search', {
      params: { q: query, ...params },
    });
  },

  // ✅ FIX: Add stats endpoint (backend has /api/customers/:id/stats)
  getStats: async (id: number): Promise<any> => {
    return apiClient.get(`/api/customers/${id}/stats`);
  },

  // ✅ FIX: Add export endpoint
  exportCustomers: async (): Promise<Blob> => {
    return apiClient.get<Blob>('/api/customers/export', {
      responseType: 'blob',
    });
  },
};
```

---

### 4. Fix Admin API (`ayurveda-shop/lib/api/admin.ts`)

```typescript
import { apiClient } from './client';

type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned' | 'refunded';
type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  items: any[];
  createdAt: string;
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

// Dashboard & Analytics
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

  // ✅ FIX: Update to use cancel endpoint
  cancelOrder: async (orderId: string, reason?: string): Promise<Order> => {
    return apiClient.patch(`/api/orders/${orderId}/cancel`, { reason });
  },

  // ✅ FIX: Use backend's refund endpoint
  processRefund: async (orderId: string, amount: number, reason: string): Promise<Order> => {
    return apiClient.post(`/api/orders/${orderId}/refund`, { amount, reason });
  },

  // ✅ FIX: Add customer search
  searchCustomers: async (query: string, params?: {
    page?: number;
    size?: number;
  }) => {
    const queryParams = new URLSearchParams();
    queryParams.append('q', query);
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.size) queryParams.append('size', String(params.size));

    return apiClient.get(`/api/customers?${queryParams.toString()}`);
  },

  // ✅ FIX: Add customer export
  exportCustomers: async (): Promise<Blob> => {
    return apiClient.get<Blob>('/api/customers/export', {
      responseType: 'blob',
    });
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
  cancel: adminApi.cancelOrder,
  refund: adminApi.processRefund,
  search: adminApi.searchCustomers,
  export: adminApi.exportCustomers,
  track: adminApi.trackOrder,
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
  search: adminApi.searchCustomers,
  export: adminApi.exportCustomers,
  getStats: adminApi.getCustomerStats,
};
```

---

### 5. Add Missing Backend Endpoints (`ayurveda-api/src/products/products.controller.ts`)

```typescript
// Add after existing @Get(':slug') method (line 67)

@Public()
@Get('search')
@ApiOperation({ summary: 'Search products' })
@ApiResponse({ status: 200, description: 'Products found' })
@ApiResponse({ status: 400, description: 'Invalid query parameter' })
async search(
  @Query('q') query: string,
  @Query() queryDto: QueryProductDto,
) {
  return this.productsService.search(query, queryDto);
}

@Patch(':id/stock')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'manager')
@ApiBearerAuth()
@ApiOperation({ summary: 'Update product stock' })
@ApiParam({ name: 'id', description: 'Product ID' })
@ApiResponse({ status: 200, description: 'Stock updated successfully' })
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@ApiResponse({ status: 404, description: 'Product not found' })
async updateStock(
  @Param('id') id: string,
  @Body('quantity') quantity: number,
) {
  return this.productsService.updateStock(id, quantity);
}
```

---

### 6. Add Missing Backend Endpoints (`ayurveda-api/src/customers/customers.controller.ts`)

```typescript
// Add after existing @Patch(':id') method (line 79)

@Public()
@Get('search')
@ApiOperation({ summary: 'Search customers' })
@ApiResponse({ status: 200, description: 'Customers found' })
@ApiResponse({ status: 400, description: 'Invalid query parameter' })
async search(
  @Query('q') query: string,
  @Query() queryDto: QueryCustomerDto,
) {
  return this.customersService.search(query, queryDto);
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'manager')
@ApiBearerAuth()
@Get('export')
@ApiOperation({ summary: 'Export customers' })
@ApiResponse({ status: 200, description: 'Export initiated' })
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
async export(
  @Query() queryDto: QueryCustomerDto,
) {
  return this.customersService.export(queryDto);
}
```

---

### 7. Add Missing Backend Endpoints (`ayurveda-api/src/orders/orders.controller.ts`)

```typescript
// Add after existing @Patch(':id/cancel') method (line 94)

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Get('export')
@ApiOperation({ summary: 'Export orders' })
@ApiResponse({ status: 200, description: 'Export initiated' })
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
async export(
  @Query() queryDto: QueryOrderDto,
) {
  return this.ordersService.export(queryDto);
}
```

---

## 🎯 How to Apply These Fixes

### Step 1: Backup Current Files
```bash
cd ayurveda-shop
cp lib/api/products.ts lib/api/products.ts.backup
cp lib/api/orders.ts lib/api/orders.ts.backup
cp lib/api/customers.ts lib/api/customers.ts.backup
cp lib/api/admin.ts lib/api/admin.ts.backup
```

### Step 2: Apply Fixes
Replace the contents of each file with the provided fixes above.

### Step 3: Test Changes
```bash
cd ayurveda-shop
npm run dev

# In another terminal
cd ayurveda-api
npm run start:dev
```

### Step 4: Verify Integration
Test the following endpoints:
- Products search
- Orders cancel
- Orders search
- Orders export
- Customer search
- Customer export

### Step 5: Update Backend (Optional)
If backend endpoints are missing, add them using the backend code provided above.

---

## 📋 Testing Checklist

After applying fixes, test:

- [ ] **Products**
  - [ ] Search functionality works
  - [ ] Stock update works
  - [ ] All CRUD operations work

- [ ] **Orders**
  - [ ] Cancel order works
  - [ ] Track order works
  - [ ] Search orders works
  - [ ] Export orders works
  - [ ] Refund processing works

- [ ] **Customers**
  - [ ] Search customers works
  - [ ] Export customers works
  - [ ] Get customer stats works

- [ ] **Authentication**
  - [ ] Login works
  - [ ] Token refresh works
  - [ ] Logout works

- [ ] **Admin**
  - [ ] Dashboard stats work
  - [ ] Order management works
  - [ ] Product management works
  - [ ] Customer management works

---

## ⚠️ Important Notes

1. **Backup Before Changes**: Always backup original files before making changes
2. **Test Thoroughly**: Test each endpoint after changes
3. **Check Backend**: Verify backend endpoints exist and are properly configured
4. **Environment Variables**: Ensure all environment variables are set correctly
5. **Database**: Test with actual database data to ensure proper functionality

---

## 🚨 Troubleshooting

### Issue: 404 Not Found
**Solution**: Check if backend endpoint exists and is properly configured

### Issue: 401 Unauthorized
**Solution**: Check JWT token is being sent correctly in request headers

### Issue: 500 Internal Server Error
**Solution**: Check backend logs for specific error details

### Issue: CORS Error
**Solution**: Verify CORS_ORIGINS in backend .env matches frontend URL

---

## 📚 Additional Resources

- Full Integration Documentation: `API_INTEGRATION_DOCUMENTATION.md`
- Quick Reference: `API_QUICK_REFERENCE.md`
- Files Comparison: `API_FILES_COMPARISON.md`
- Integration Summary: `API_INTEGRATION_SUMMARY.md`

---

**Document Created**: February 9, 2026
**Status**: Ready for Implementation
**Estimated Fix Time**: 2-3 hours for frontend fixes, 1 hour for backend fixes
