import { apiClient } from './client';
import { Customer, PageRequest, PageResponse } from './types';

const toNumber = (value: unknown): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return Number(value);
  if (value && typeof value === 'object' && 'toString' in value) {
    return Number((value as { toString: () => string }).toString());
  }
  return 0;
};

const mapCustomer = (customer: any): Customer => ({
  id: customer.id,
  email: customer.email,
  firstName: customer.firstName || customer.first_name || '',
  lastName: customer.lastName || customer.last_name || '',
  phoneNumber: customer.phoneNumber ?? customer.phone_number ?? null,
  totalOrders: toNumber(customer.totalOrders ?? customer.total_orders),
  totalSpent: toNumber(customer.totalSpent ?? customer.total_spent),
  averageOrderValue: toNumber(
    customer.averageOrderValue ?? customer.average_order_value,
  ),
  lifetimeValue: toNumber(customer.lifetimeValue ?? customer.lifetime_value),
  lastOrderAt: customer.lastOrderAt || customer.last_order_at || null,
  acceptsMarketing:
    customer.acceptsMarketing ?? customer.accepts_marketing ?? false,
  createdAt: customer.createdAt || customer.created_at,
  updatedAt: customer.updatedAt || customer.updated_at,
});

const mapCustomersPage = (response: any): PageResponse<Customer> => {
  const content = (response.content || []).map(mapCustomer);
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

export const customersApi = {
  getAll: async (params?: PageRequest): Promise<PageResponse<Customer>> => {
    const response = await apiClient.get<any>('/api/customers', { params });
    return mapCustomersPage(response);
  },

  getById: async (id: string): Promise<Customer> => {
    const response = await apiClient.get<any>(`/api/customers/${id}`);
    return mapCustomer(response);
  },

  getStats: async (id: string): Promise<CustomerStatsResponse> => {
    const response = await apiClient.get<any>(`/api/customers/${id}/stats`);
    return {
      customer: {
        id: response.customer.id,
        email: response.customer.email,
        firstName: response.customer.firstName || response.customer.first_name,
        lastName: response.customer.lastName || response.customer.last_name,
        phoneNumber:
          response.customer.phoneNumber ?? response.customer.phone_number ?? null,
      },
      stats: {
        totalOrders: toNumber(response.stats.totalOrders ?? response.stats.total_orders),
        totalSpent: toNumber(response.stats.totalSpent ?? response.stats.total_spent),
        averageOrderValue: toNumber(
          response.stats.averageOrderValue ?? response.stats.average_order_value,
        ),
        lifetimeValue: toNumber(response.stats.lifetimeValue ?? response.stats.lifetime_value),
        lastOrderAt: response.stats.lastOrderAt || response.stats.last_order_at || null,
      },
      recentOrders: (response.recentOrders || response.recent_orders || []).map(
        (order: any) => ({
          id: order.id,
          orderNumber: order.orderNumber || order.order_number,
          status: (order.status || '').toLowerCase(),
          total: toNumber(order.total),
          createdAt: order.createdAt || order.created_at,
        }),
      ),
    };
  },

  update: async (id: string, data: UpdateCustomerDto): Promise<Customer> => {
    const payload: Record<string, unknown> = {
      email: data.email,
      first_name: data.firstName,
      last_name: data.lastName,
      phone_number: data.phoneNumber,
      accepts_marketing: data.acceptsMarketing,
    };

    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined) {
        delete payload[key];
      }
    });

    const response = await apiClient.patch<any>(`/api/customers/${id}`, payload);
    return mapCustomer(response);
  },

  search: async (
    query: string,
    params?: PageRequest,
  ): Promise<PageResponse<Customer>> => {
    const response = await apiClient.get<any>('/api/customers/search', {
      params: { q: query, ...params },
    });
    return mapCustomersPage(response);
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
