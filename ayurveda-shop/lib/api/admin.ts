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

  updateOrderStatus: async (orderId: string, status: string, notes?: string): Promise<Order> => {
    return apiClient.patch(`/api/orders/${orderId}/status`, { status, notes });
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
  refund: adminApi.processRefund,
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
};
