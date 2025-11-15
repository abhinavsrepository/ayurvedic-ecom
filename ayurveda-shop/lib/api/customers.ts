import { apiClient } from './client';
import { Customer, PageRequest, PageResponse } from './types';

export const customersApi = {
  getAll: async (params?: PageRequest): Promise<PageResponse<Customer>> => {
    return apiClient.get<PageResponse<Customer>>('/api/customers', { params });
  },

  getById: async (id: number): Promise<Customer> => {
    return apiClient.get<Customer>(`/api/customers/${id}`);
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
