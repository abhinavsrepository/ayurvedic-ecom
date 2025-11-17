/**
 * Order Service
 * Handles all order-related API calls
 */

import apiClient, { ApiResponse } from './apiClient';
import { Order, OrderStatus, Address, PaymentMethodType } from '../../types';
import { PaginatedResponse, PaginationParams } from './productService';

/**
 * Create order data
 */
export interface CreateOrderData {
  shippingAddressId: string;
  billingAddressId?: string;
  paymentMethod: PaymentMethodType;
  couponCode?: string;
  notes?: string;
}

/**
 * Order with detailed items
 */
export interface OrderDetails extends Order {
  billingAddress?: Address;
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    productImage: string;
    quantity: number;
    price: number;
    total: number;
  }>;
}

/**
 * Order tracking information
 */
export interface OrderTracking {
  orderId: string;
  trackingNumber?: string;
  carrier?: string;
  status: OrderStatus;
  estimatedDelivery?: string;
  timeline: Array<{
    status: OrderStatus;
    timestamp: string;
    location?: string;
    description: string;
  }>;
  currentLocation?: string;
}

/**
 * Payment intent for order
 */
export interface PaymentIntent {
  clientSecret: string;
  orderId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethodType;
}

/**
 * Order filters
 */
export interface OrderFilters {
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

/**
 * Order query parameters
 */
export interface OrderQueryParams extends PaginationParams, OrderFilters {}

/**
 * Invoice data
 */
export interface Invoice {
  orderId: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate?: string;
  items: Array<{
    description: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  billingAddress: Address;
  shippingAddress: Address;
}

/**
 * Create new order
 * @param orderData - Order creation data
 * @returns Created order with payment intent
 */
export const createOrder = async (
  orderData: CreateOrderData
): Promise<{ order: OrderDetails; paymentIntent?: PaymentIntent }> => {
  try {
    const response = await apiClient.post<
      ApiResponse<{ order: OrderDetails; paymentIntent?: PaymentIntent }>
    >('/orders', orderData);

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to create order');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create order');
  }
};

/**
 * Get user's orders with filters and pagination
 * @param params - Query parameters including filters and pagination
 * @returns Paginated list of orders
 */
export const getOrders = async (params?: OrderQueryParams): Promise<PaginatedResponse<Order>> => {
  try {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Order>>>('/orders', {
      params,
    });

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to fetch orders');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch orders');
  }
};

/**
 * Get single order by ID
 * @param id - Order ID
 * @returns Order details
 */
export const getOrder = async (id: string): Promise<OrderDetails> => {
  try {
    const response = await apiClient.get<ApiResponse<OrderDetails>>(`/orders/${id}`);

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to fetch order');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch order');
  }
};

/**
 * Track order status and shipping
 * @param id - Order ID
 * @returns Order tracking information
 */
export const trackOrder = async (id: string): Promise<OrderTracking> => {
  try {
    const response = await apiClient.get<ApiResponse<OrderTracking>>(`/orders/${id}/track`);

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to track order');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to track order');
  }
};

/**
 * Cancel order
 * @param id - Order ID
 * @param reason - Cancellation reason
 * @returns Updated order
 */
export const cancelOrder = async (id: string, reason?: string): Promise<OrderDetails> => {
  try {
    const response = await apiClient.post<ApiResponse<OrderDetails>>(`/orders/${id}/cancel`, {
      reason,
    });

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to cancel order');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to cancel order');
  }
};

/**
 * Request order return
 * @param id - Order ID
 * @param items - Items to return with quantities
 * @param reason - Return reason
 * @returns Return request details
 */
export const requestReturn = async (
  id: string,
  items: Array<{ itemId: string; quantity: number }>,
  reason: string
): Promise<{
  returnId: string;
  status: string;
  message: string;
}> => {
  try {
    const response = await apiClient.post<
      ApiResponse<{
        returnId: string;
        status: string;
        message: string;
      }>
    >(`/orders/${id}/return`, { items, reason });

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to request return');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to request return');
  }
};

/**
 * Confirm order receipt
 * @param id - Order ID
 * @returns Updated order
 */
export const confirmOrderReceipt = async (id: string): Promise<OrderDetails> => {
  try {
    const response = await apiClient.post<ApiResponse<OrderDetails>>(`/orders/${id}/confirm`);

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to confirm order');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to confirm order');
  }
};

/**
 * Reorder (create new order from previous order)
 * @param id - Original order ID
 * @returns New order details
 */
export const reorder = async (id: string): Promise<{ order: OrderDetails; paymentIntent?: PaymentIntent }> => {
  try {
    const response = await apiClient.post<
      ApiResponse<{ order: OrderDetails; paymentIntent?: PaymentIntent }>
    >(`/orders/${id}/reorder`);

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to reorder');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to reorder');
  }
};

/**
 * Get order invoice
 * @param id - Order ID
 * @returns Invoice data
 */
export const getOrderInvoice = async (id: string): Promise<Invoice> => {
  try {
    const response = await apiClient.get<ApiResponse<Invoice>>(`/orders/${id}/invoice`);

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to get invoice');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get invoice');
  }
};

/**
 * Download order invoice PDF
 * @param id - Order ID
 * @returns Invoice PDF URL
 */
export const downloadInvoice = async (id: string): Promise<string> => {
  try {
    const response = await apiClient.get<ApiResponse<{ url: string }>>(
      `/orders/${id}/invoice/download`
    );

    if (response.data.success && response.data.data) {
      return response.data.data.url;
    }

    throw new Error(response.data.message || 'Failed to download invoice');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to download invoice');
  }
};

/**
 * Update order payment
 * @param id - Order ID
 * @param paymentMethod - New payment method
 * @returns Payment intent
 */
export const updateOrderPayment = async (
  id: string,
  paymentMethod: PaymentMethodType
): Promise<PaymentIntent> => {
  try {
    const response = await apiClient.put<ApiResponse<PaymentIntent>>(`/orders/${id}/payment`, {
      paymentMethod,
    });

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to update payment');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update payment');
  }
};

/**
 * Confirm payment for order
 * @param id - Order ID
 * @param paymentDetails - Payment confirmation details
 * @returns Updated order
 */
export const confirmPayment = async (
  id: string,
  paymentDetails: {
    paymentIntentId?: string;
    transactionId?: string;
    method: PaymentMethodType;
  }
): Promise<OrderDetails> => {
  try {
    const response = await apiClient.post<ApiResponse<OrderDetails>>(
      `/orders/${id}/payment/confirm`,
      paymentDetails
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to confirm payment');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to confirm payment');
  }
};

/**
 * Get order statistics
 * @returns Order statistics for current user
 */
export const getOrderStatistics = async (): Promise<{
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  statusBreakdown: Record<OrderStatus, number>;
}> => {
  try {
    const response = await apiClient.get<
      ApiResponse<{
        totalOrders: number;
        totalSpent: number;
        averageOrderValue: number;
        statusBreakdown: Record<OrderStatus, number>;
      }>
    >('/orders/statistics');

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to get statistics');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get statistics');
  }
};

/**
 * Get order support contact
 * @param id - Order ID
 * @returns Support contact information
 */
export const getOrderSupport = async (
  id: string
): Promise<{
  email: string;
  phone: string;
  chatAvailable: boolean;
}> => {
  try {
    const response = await apiClient.get<
      ApiResponse<{
        email: string;
        phone: string;
        chatAvailable: boolean;
      }>
    >(`/orders/${id}/support`);

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to get support info');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get support info');
  }
};

/**
 * Verify order payment status
 * @param id - Order ID
 * @returns Payment status
 */
export const verifyPaymentStatus = async (
  id: string
): Promise<{
  paid: boolean;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  transactionId?: string;
}> => {
  try {
    const response = await apiClient.get<
      ApiResponse<{
        paid: boolean;
        status: 'pending' | 'processing' | 'completed' | 'failed';
        transactionId?: string;
      }>
    >(`/orders/${id}/payment/status`);

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to verify payment');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to verify payment');
  }
};

export default {
  createOrder,
  getOrders,
  getOrder,
  trackOrder,
  cancelOrder,
  requestReturn,
  confirmOrderReceipt,
  reorder,
  getOrderInvoice,
  downloadInvoice,
  updateOrderPayment,
  confirmPayment,
  getOrderStatistics,
  getOrderSupport,
  verifyPaymentStatus,
};
