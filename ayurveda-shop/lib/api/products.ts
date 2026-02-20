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

  getById: async (id: string): Promise<ProductResponse> => {
    return apiClient.get<ProductResponse>(`/api/products/${id}`);
  },

  create: async (product: ProductCreateRequest): Promise<ProductResponse> => {
    return apiClient.post<ProductResponse>('/api/products', product);
  },

  update: async (id: string, product: ProductUpdateRequest): Promise<ProductResponse> => {
    return apiClient.put<ProductResponse>(`/api/products/${id}`, product);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/api/products/${id}`);
  },

  search: async (query: string, params?: PageRequest): Promise<PageResponse<ProductResponse>> => {
    return apiClient.get<PageResponse<ProductResponse>>('/api/products/search', {
      params: { q: query, ...params },
    });
  },

  updateStock: async (id: string, quantity: number): Promise<ProductResponse> => {
    return apiClient.patch<ProductResponse>(`/api/products/${id}/stock`, { quantity });
  },
};
