/**
 * Addresses API Module
 *
 * API methods for customer address management.
 */

import { apiClient } from './client';

export interface Address {
  id: string;
  label?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  addressType: 'SHIPPING' | 'BILLING';
  fullAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressRequest {
  label?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  isDefault?: boolean;
  addressType?: 'SHIPPING' | 'BILLING';
}

export interface UpdateAddressRequest {
  label?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isDefault?: boolean;
  addressType?: 'SHIPPING' | 'BILLING';
}

export const addressesApi = {
  /**
   * Get all addresses for current user
   */
  getAll: async (): Promise<Address[]> => {
    return apiClient.get<Address[]>('/api/addresses');
  },

  /**
   * Get default address
   */
  getDefault: async (): Promise<Address | null> => {
    return apiClient.get<Address | null>('/api/addresses/default');
  },

  /**
   * Get single address by ID
   */
  getById: async (id: string): Promise<Address> => {
    return apiClient.get<Address>(`/api/addresses/${id}`);
  },

  /**
   * Create a new address
   */
  create: async (data: CreateAddressRequest): Promise<Address> => {
    return apiClient.post<Address>('/api/addresses', data);
  },

  /**
   * Update an address
   */
  update: async (id: string, data: UpdateAddressRequest): Promise<Address> => {
    return apiClient.patch<Address>(`/api/addresses/${id}`, data);
  },

  /**
   * Delete an address
   */
  delete: async (id: string): Promise<{ message: string }> => {
    return apiClient.delete(`/api/addresses/${id}`);
  },

  /**
   * Set an address as default
   */
  setDefault: async (id: string): Promise<Address> => {
    return apiClient.post<Address>(`/api/addresses/${id}/default`);
  },
};

export default addressesApi;
