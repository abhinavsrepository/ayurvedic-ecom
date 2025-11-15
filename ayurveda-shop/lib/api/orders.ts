import { apiClient } from './client';
import {
  Order,
  OrderListResponse,
  OrderDetailResponse,
  OrderStatusUpdateRequest,
  RefundRequest,
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

  updateStatus: async (id: number, request: OrderStatusUpdateRequest): Promise<OrderDetailResponse> => {
    return apiClient.patch<OrderDetailResponse>(`/api/orders/${id}/status`, request);
  },

  processRefund: async (id: number, request: RefundRequest): Promise<OrderDetailResponse> => {
    return apiClient.post<OrderDetailResponse>(`/api/orders/${id}/refund`, request);
  },

  getByStatus: async (status: string, params?: PageRequest): Promise<PageResponse<OrderListResponse>> => {
    return apiClient.get<PageResponse<OrderListResponse>>('/api/orders', {
      params: { status, ...params },
    });
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
