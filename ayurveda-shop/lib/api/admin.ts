import { apiClient } from './client';

type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'refunded';
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

const toNumber = (value: unknown): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return Number(value);
  if (value && typeof value === 'object' && 'toString' in value) {
    return Number((value as { toString: () => string }).toString());
  }
  return 0;
};

const lower = (value: unknown): string =>
  typeof value === 'string' ? value.toLowerCase() : '';

const mapOrder = (order: any): Order => {
  const customerNameFromRelation = [
    order.customers?.first_name,
    order.customers?.last_name,
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  return {
    id: order.id,
    orderNumber: order.orderNumber || order.order_number || '',
    customerName:
      order.customerName ||
      customerNameFromRelation ||
      order.customers?.email ||
      'Guest',
    customerEmail: order.customerEmail || order.customers?.email || '',
    customerPhone:
      order.customerPhone || order.customers?.phone_number || order.phone || '',
    status: lower(order.status) as OrderStatus,
    paymentStatus: lower(
      order.paymentStatus ?? order.payment_status,
    ) as PaymentStatus,
    paymentMethod: order.paymentMethod || order.payment_method || 'N/A',
    total: toNumber(order.total),
    subtotal: toNumber(order.subtotal),
    tax: toNumber(order.tax ?? order.tax_amount),
    shipping: toNumber(order.shipping ?? order.shipping_amount),
    discount: toNumber(order.discount ?? order.discount_amount),
    items: order.items || order.order_items || [],
    createdAt: order.createdAt || order.created_at,
  };
};

const mapOrdersPage = (response: any): PageResponse<Order> => {
  const content = (response.content || []).map(mapOrder);
  const number = response.number ?? response.page ?? 0;
  const totalElements = response.totalElements ?? response.total ?? 0;
  return {
    content,
    totalElements,
    totalPages: response.totalPages ?? 0,
    size: response.size ?? 20,
    number,
    first: response.first ?? number === 0,
    last: response.last ?? false,
    numberOfElements: response.numberOfElements ?? content.length,
    empty: response.empty ?? content.length === 0,
  };
};

const buildQuery = (params?: Record<string, unknown>) => {
  const queryParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });
  }
  return queryParams.toString();
};

export const adminApi = {
  getDashboardStats: async () => {
    return apiClient.get('/api/admin/dashboard/stats');
  },

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
    const qs = buildQuery(params);
    const response = await apiClient.get<any>(`/api/orders${qs ? `?${qs}` : ''}`);
    return mapOrdersPage(response);
  },

  getOrder: async (orderId: string): Promise<Order> => {
    const response = await apiClient.get<any>(`/api/orders/${orderId}`);
    return mapOrder(response);
  },

  cancelOrder: async (orderId: string, reason?: string): Promise<Order> => {
    const response = await apiClient.patch<any>(`/api/orders/${orderId}/cancel`, {
      reason,
    });
    return mapOrder(response);
  },

  processRefund: async (
    orderId: string,
    amount: number,
    reason: string,
  ): Promise<Order> => {
    const response = await apiClient.post<any>(`/api/orders/${orderId}/refund`, {
      amount,
      reason,
    });
    return mapOrder(response);
  },

  trackOrder: async (orderId: string): Promise<any> => {
    return apiClient.get(`/api/orders/${orderId}/track`);
  },

  searchCustomers: async (
    query: string,
    params?: {
      page?: number;
      size?: number;
    },
  ) => {
    const qs = buildQuery({ q: query, ...params });
    return apiClient.get(`/api/customers/search${qs ? `?${qs}` : ''}`);
  },

  exportCustomers: async (): Promise<Blob> => {
    return apiClient.get<Blob>('/api/customers/export', {
      responseType: 'blob',
    });
  },

  getProducts: async (params?: {
    page?: number;
    size?: number;
    search?: string;
    status?: string;
    category?: string;
  }) => {
    const qs = buildQuery(params);
    return apiClient.get(`/api/products${qs ? `?${qs}` : ''}`);
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

  getCustomers: async (params?: {
    page?: number;
    size?: number;
    search?: string;
  }) => {
    const normalizedParams = params
      ? { ...params, query: params.search, search: undefined }
      : undefined;
    const qs = buildQuery(normalizedParams as Record<string, unknown> | undefined);
    return apiClient.get(`/api/customers${qs ? `?${qs}` : ''}`);
  },

  getCustomer: async (customerId: string) => {
    return apiClient.get(`/api/customers/${customerId}`);
  },

  getCustomerStats: async (customerId: string) => {
    return apiClient.get(`/api/customers/${customerId}/stats`);
  },
};

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
