import { apiClient } from './client';
import {
  Order,
  OrderListResponse,
  OrderDetailResponse,
  OrderStatusUpdateRequest,
  OrderRefundRequest,
  CreateOrderDto,
  OrderTrackingInfo,
  PageRequest,
  PageResponse,
} from './types';

export const ordersApi = {
  // Create a new order
  create: async (data: CreateOrderDto): Promise<Order> => {
    return apiClient.post<Order>('/api/orders', data);
  },

  // Get all orders for the current user
  getAll: async (params?: PageRequest): Promise<PageResponse<OrderListResponse>> => {
    return apiClient.get<PageResponse<OrderListResponse>>('/api/orders', { params });
  },

  // Get a specific order by ID
  getById: async (id: string): Promise<Order> => {
    return apiClient.get<Order>(`/api/orders/${id}`);
  },

  // Cancel an order
  cancel: async (id: string, reason?: string): Promise<Order> => {
    return apiClient.patch<Order>(`/api/orders/${id}/cancel`, { reason });
  },

  // Track an order
  track: async (id: string): Promise<OrderTrackingInfo> => {
    return apiClient.get<OrderTrackingInfo>(`/api/orders/${id}/track`);
  },

  // Admin: Update order status
  updateStatus: async (id: string, request: OrderStatusUpdateRequest): Promise<OrderDetailResponse> => {
    return apiClient.patch<OrderDetailResponse>(`/api/orders/${id}/status`, request);
  },

  // Admin: Process refund
  processRefund: async (id: string, request: OrderRefundRequest): Promise<OrderDetailResponse> => {
    return apiClient.post<OrderDetailResponse>(`/api/orders/${id}/refund`, request);
  },

  // Get orders by status
  getByStatus: async (status: string, params?: PageRequest): Promise<PageResponse<OrderListResponse>> => {
    return apiClient.get<PageResponse<OrderListResponse>>('/api/orders', {
      params: { status, ...params },
    });
  },

  // Search orders
  search: async (query: string, params?: PageRequest): Promise<PageResponse<OrderListResponse>> => {
    return apiClient.get<PageResponse<OrderListResponse>>('/api/orders/search', {
      params: { q: query, ...params },
    });
  },

  // Export orders to CSV (Admin only)
  exportOrders: async (params?: { startDate?: string; endDate?: string }): Promise<Blob> => {
    return apiClient.get<Blob>('/api/orders/export', {
      params,
      responseType: 'blob',
    });
  },
};
