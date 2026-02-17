import { apiClient } from './client';
import { Customer, PageRequest, PageResponse } from './types';

export const customersApi = {
  getAll: async (params?: PageRequest): Promise<PageResponse<Customer>> => {
    return apiClient.get<PageResponse<Customer>>('/api/customers', { params });
  },

  getById: async (id: string): Promise<Customer> => {
    return apiClient.get<Customer>(`/api/customers/${id}`);
  },

  getStats: async (id: string): Promise<CustomerStatsResponse> => {
    return apiClient.get<CustomerStatsResponse>(`/api/customers/${id}/stats`);
  },

  update: async (id: string, data: UpdateCustomerDto): Promise<Customer> => {
    return apiClient.patch<Customer>(`/api/customers/${id}`, data);
  },

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
};

export interface UpdateCustomerDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  acceptsMarketing?: boolean;
}

export interface CustomerStatsResponse {
  customer: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string | null;
  };
  stats: {
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    lifetimeValue: number;
    lastOrderAt: string | null;
  };
  recentOrders: {
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    createdAt: string;
  }[];
}
