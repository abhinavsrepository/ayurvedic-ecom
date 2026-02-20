import { apiClient } from './client';
import {
  Order,
  OrderDetailResponse,
  OrderStatusUpdateRequest,
  OrderRefundRequest,
  CreateOrderDto,
  OrderTrackingInfo,
  PageRequest,
  PageResponse,
  OrderStatus,
  PaymentStatus,
  FulfillmentStatus,
  ShippingAddress,
} from './types';

const toNumber = (value: unknown): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return Number(value);
  if (value && typeof value === 'object' && 'toString' in value) {
    return Number((value as { toString: () => string }).toString());
  }
  return 0;
};

const normalizeStatus = (value: unknown): string => {
  if (typeof value !== 'string') return '';
  return value.toLowerCase();
};

const mapShippingAddress = (order: any): ShippingAddress => {
  const shipping = order.shippingAddress || {};
  return {
    line1: shipping.line1 || order.shipping_address_line1 || '',
    line2: shipping.line2 || order.shipping_address_line2 || '',
    city: shipping.city || order.shipping_city || '',
    state: shipping.state || order.shipping_state || '',
    postalCode: shipping.postalCode || order.shipping_postal_code || '',
    country: shipping.country || order.shipping_country || '',
  };
};

const mapOrderItem = (item: any) => ({
  id: item.id,
  productId: item.productId || item.product_id,
  productName: item.productName || item.product_name || '',
  productImage: item.productImage || item.product_image,
  sku: item.sku,
  quantity: Number(item.quantity || 0),
  unitPrice: toNumber(item.unitPrice ?? item.unit_price),
  lineTotal: toNumber(item.lineTotal ?? item.line_total),
  discountAmount: toNumber(item.discountAmount ?? item.discount_amount),
});

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
    customerId: order.customerId || order.customer_id || order.customers?.id || '',
    customerName:
      order.customerName ||
      customerNameFromRelation ||
      order.customers?.email ||
      '',
    customerEmail: order.customerEmail || order.customers?.email || '',
    status: normalizeStatus(order.status) as OrderStatus,
    paymentStatus: normalizeStatus(
      order.paymentStatus ?? order.payment_status,
    ) as PaymentStatus,
    fulfillmentStatus: normalizeStatus(
      order.fulfillmentStatus ?? order.fulfillment_status,
    ) as FulfillmentStatus,
    items: (order.items || order.order_items || []).map(mapOrderItem),
    subtotal: toNumber(order.subtotal),
    taxAmount: toNumber(order.taxAmount ?? order.tax_amount),
    shippingAmount: toNumber(order.shippingAmount ?? order.shipping_amount),
    discountAmount: toNumber(order.discountAmount ?? order.discount_amount),
    total: toNumber(order.total),
    shippingAddress: mapShippingAddress(order),
    paymentMethod: order.paymentMethod || order.payment_method,
    trackingNumber: order.trackingNumber || order.tracking_number,
    carrier: order.carrier,
    notes: order.notes,
    createdAt: order.createdAt || order.created_at,
    updatedAt: order.updatedAt || order.updated_at,
    cancelledAt: order.cancelledAt || order.cancelled_at,
    cancelledReason: order.cancelledReason || order.cancelled_reason,
  };
};

const mapPageResponse = (response: any): PageResponse<Order> => {
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

const mapTrackingInfo = (tracking: any): OrderTrackingInfo => ({
  orderNumber: tracking.orderNumber || tracking.order_number || '',
  status: normalizeStatus(tracking.status) as OrderStatus,
  paymentStatus: normalizeStatus(
    tracking.paymentStatus ?? tracking.payment_status,
  ) as PaymentStatus,
  fulfillmentStatus: normalizeStatus(
    tracking.fulfillmentStatus ?? tracking.fulfillment_status,
  ) as FulfillmentStatus,
  trackingNumber: tracking.trackingNumber || tracking.tracking_number,
  carrier: tracking.carrier,
  shippingAddress: {
    line1: tracking.shippingAddress?.line1 || tracking.shipping_address_line1 || '',
    line2: tracking.shippingAddress?.line2 || tracking.shipping_address_line2 || '',
    city: tracking.shippingAddress?.city || tracking.shipping_city || '',
    state: tracking.shippingAddress?.state || tracking.shipping_state || '',
    postalCode:
      tracking.shippingAddress?.postalCode || tracking.shipping_postal_code || '',
    country: tracking.shippingAddress?.country || tracking.shipping_country || '',
  },
  createdAt: tracking.createdAt || tracking.created_at,
  updatedAt: tracking.updatedAt || tracking.updated_at,
});

export const ordersApi = {
  create: async (data: CreateOrderDto): Promise<Order> => {
    const response = await apiClient.post<any>('/api/orders', data);
    return mapOrder(response);
  },

  getAll: async (params?: PageRequest): Promise<PageResponse<Order>> => {
    const response = await apiClient.get<any>('/api/orders', { params });
    return mapPageResponse(response);
  },

  getById: async (id: string): Promise<Order> => {
    const response = await apiClient.get<any>(`/api/orders/${id}`);
    return mapOrder(response);
  },

  cancel: async (id: string, reason?: string): Promise<Order> => {
    const response = await apiClient.patch<any>(`/api/orders/${id}/cancel`, { reason });
    return mapOrder(response);
  },

  track: async (id: string): Promise<OrderTrackingInfo> => {
    const response = await apiClient.get<any>(`/api/orders/${id}/track`);
    return mapTrackingInfo(response);
  },

  updateStatus: async (
    id: string,
    request: OrderStatusUpdateRequest,
  ): Promise<OrderDetailResponse> => {
    const response = await apiClient.patch<any>(`/api/orders/${id}/status`, request);
    return mapOrder(response) as OrderDetailResponse;
  },

  processRefund: async (
    id: string,
    request: OrderRefundRequest,
  ): Promise<OrderDetailResponse> => {
    const response = await apiClient.post<any>(`/api/orders/${id}/refund`, request);
    return mapOrder(response) as OrderDetailResponse;
  },

  getByStatus: async (
    status: string,
    params?: PageRequest,
  ): Promise<PageResponse<Order>> => {
    const response = await apiClient.get<any>('/api/orders', {
      params: { status, ...params },
    });
    return mapPageResponse(response);
  },

  search: async (
    query: string,
    params?: PageRequest,
  ): Promise<PageResponse<Order>> => {
    const response = await apiClient.get<any>('/api/orders/search', {
      params: { q: query, ...params },
    });
    return mapPageResponse(response);
  },

  exportOrders: async (
    params?: { startDate?: string; endDate?: string },
  ): Promise<Blob> => {
    return apiClient.get<Blob>('/api/orders/export', {
      params,
      responseType: 'blob',
    });
  },
};
