/**
 * Order Type Definitions
 *
 * Complete type definitions for orders, order items, payments, and shipping.
 */

import type { Product } from './product.types';
import type { Address } from './user.types';

/**
 * Order Status Enum
 */
export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  FAILED = 'failed',
  ON_HOLD = 'on_hold',
}

/**
 * Payment Status Enum
 */
export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
  CANCELLED = 'cancelled',
}

/**
 * Payment Method Enum
 */
export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  NET_BANKING = 'net_banking',
  UPI = 'upi',
  WALLET = 'wallet',
  COD = 'cod', // Cash on Delivery
  EMI = 'emi',
  PAYPAL = 'paypal',
  APPLE_PAY = 'apple_pay',
  GOOGLE_PAY = 'google_pay',
}

/**
 * Shipping Method Enum
 */
export enum ShippingMethod {
  STANDARD = 'standard',
  EXPRESS = 'express',
  SAME_DAY = 'same_day',
  NEXT_DAY = 'next_day',
  PICKUP = 'pickup',
}

/**
 * Return Status Enum
 */
export enum ReturnStatus {
  REQUESTED = 'requested',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PICKED_UP = 'picked_up',
  IN_TRANSIT = 'in_transit',
  RECEIVED = 'received',
  REFUNDED = 'refunded',
  COMPLETED = 'completed',
}

/**
 * Return Reason Enum
 */
export enum ReturnReason {
  DEFECTIVE = 'defective',
  WRONG_ITEM = 'wrong_item',
  NOT_AS_DESCRIBED = 'not_as_described',
  CHANGED_MIND = 'changed_mind',
  BETTER_PRICE = 'better_price',
  ORDERED_BY_MISTAKE = 'ordered_by_mistake',
  DAMAGED = 'damaged',
  EXPIRED = 'expired',
  OTHER = 'other',
}

/**
 * Order Item Interface
 */
export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId?: string;
  product: {
    id: string;
    name: string;
    slug: string;
    image: string;
    sku: string;
    attributes?: Record<string, string>;
  };
  quantity: number;
  price: number; // Price at the time of order
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  isReturnable: boolean;
  returnDeadline?: string;
  isReviewed: boolean;
}

/**
 * Order Discount/Coupon
 */
export interface OrderDiscount {
  id: string;
  code: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  amount: number; // Actual discount amount
  description?: string;
}

/**
 * Shipping Details
 */
export interface ShippingDetails {
  method: ShippingMethod;
  carrier: string;
  trackingNumber?: string;
  trackingUrl?: string;
  cost: number;
  estimatedDelivery: string;
  actualDelivery?: string;
  address: Address;
}

/**
 * Payment Details
 */
export interface PaymentDetails {
  id: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  amount: number;
  currency: string;
  paidAt?: string;
  refundedAt?: string;
  refundAmount?: number;
  paymentGateway?: string;
  last4?: string; // Last 4 digits of card
  cardBrand?: string;
}

/**
 * Order Timeline Event
 */
export interface OrderTimelineEvent {
  id: string;
  status: OrderStatus;
  title: string;
  description?: string;
  timestamp: string;
  location?: string;
  metadata?: Record<string, any>;
}

/**
 * Order Summary (for checkout)
 */
export interface OrderSummary {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  itemCount: number;
  savings?: number;
}

/**
 * Main Order Interface
 */
export interface Order {
  // Basic Info
  id: string;
  orderNumber: string;
  userId: string;

  // Status
  status: OrderStatus;
  paymentStatus: PaymentStatus;

  // Items
  items: OrderItem[];
  itemCount: number;

  // Pricing
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;

  // Discounts/Coupons
  discounts?: OrderDiscount[];
  couponCode?: string;

  // Shipping
  shippingDetails: ShippingDetails;

  // Payment
  paymentDetails: PaymentDetails;

  // Billing Address
  billingAddress: Address;

  // Timeline
  timeline: OrderTimelineEvent[];

  // Dates
  placedAt: string;
  confirmedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  estimatedDelivery: string;

  // Notes
  customerNote?: string;
  internalNotes?: string[];

  // Flags
  isGift: boolean;
  giftMessage?: string;
  requiresSignature: boolean;

  // Invoice
  invoiceUrl?: string;
  invoiceNumber?: string;

  // Return/Refund
  isReturnable: boolean;
  returnDeadline?: string;
  hasReturn: boolean;
  returnId?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
}

/**
 * Order Return Request
 */
export interface OrderReturn {
  id: string;
  orderId: string;
  userId: string;
  status: ReturnStatus;

  // Items to return
  items: {
    orderItemId: string;
    quantity: number;
    reason: ReturnReason;
    reasonDescription?: string;
    images?: string[];
  }[];

  // Refund
  refundAmount: number;
  refundMethod: 'original' | 'wallet' | 'bank_transfer';
  refundStatus: PaymentStatus;

  // Pickup
  pickupAddress: Address;
  pickupDate?: string;
  pickupSlot?: string;

  // Timeline
  timeline: {
    status: ReturnStatus;
    title: string;
    description?: string;
    timestamp: string;
  }[];

  // Dates
  requestedAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  completedAt?: string;

  // Admin Notes
  adminNotes?: string;
  rejectionReason?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
}

/**
 * Order Tracking Info
 */
export interface OrderTracking {
  orderId: string;
  trackingNumber: string;
  carrier: string;
  status: OrderStatus;
  estimatedDelivery: string;
  currentLocation?: string;
  timeline: {
    status: string;
    location: string;
    timestamp: string;
    description?: string;
  }[];
  deliveryAddress: Address;
}

/**
 * Checkout Request
 */
export interface CheckoutRequest {
  // Items (from cart)
  items: {
    productId: string;
    variantId?: string;
    quantity: number;
  }[];

  // Addresses
  shippingAddressId: string;
  billingAddressId: string;
  useSameAddress: boolean;

  // Shipping
  shippingMethod: ShippingMethod;

  // Payment
  paymentMethod: PaymentMethod;
  paymentMethodId?: string; // Saved payment method ID

  // Discounts
  couponCode?: string;

  // Options
  isGift: boolean;
  giftMessage?: string;
  customerNote?: string;

  // Save preferences
  savePaymentMethod?: boolean;
  saveAddress?: boolean;
}

/**
 * Checkout Response
 */
export interface CheckoutResponse {
  order: Order;
  paymentIntent?: {
    id: string;
    clientSecret: string;
    amount: number;
    currency: string;
  };
  redirectUrl?: string; // For payment gateway redirects
}

/**
 * Order List Response (for API)
 */
export interface OrderListResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  summary?: {
    totalOrders: number;
    totalSpent: number;
    currency: string;
    statusCounts: Record<OrderStatus, number>;
  };
}

/**
 * Order Filter Options
 */
export interface OrderFilter {
  status?: OrderStatus[];
  paymentStatus?: PaymentStatus[];
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string; // Search by order number, product name, etc.
  sortBy?: 'date' | 'amount' | 'status';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

/**
 * Reorder Request
 */
export interface ReorderRequest {
  orderId: string;
  itemIds?: string[]; // If not provided, reorder all items
}

/**
 * Order Invoice
 */
export interface OrderInvoice {
  orderId: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate?: string;

  // Company Details
  seller: {
    name: string;
    address: string;
    gstin?: string;
    pan?: string;
    email: string;
    phone: string;
  };

  // Customer Details
  buyer: {
    name: string;
    address: string;
    gstin?: string;
    email: string;
    phone: string;
  };

  // Items
  items: {
    name: string;
    sku: string;
    quantity: number;
    price: number;
    tax: number;
    total: number;
  }[];

  // Totals
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;

  // Payment
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId?: string;

  // Notes
  notes?: string[];
  terms?: string[];

  // URLs
  pdfUrl?: string;
}

/**
 * Type Guards
 */
export const isOrder = (obj: any): obj is Order => {
  return (
    obj &&
    typeof obj.id === 'string' &&
    typeof obj.orderNumber === 'string' &&
    Array.isArray(obj.items)
  );
};

export const isOrderItem = (obj: any): obj is OrderItem => {
  return (
    obj &&
    typeof obj.id === 'string' &&
    typeof obj.productId === 'string' &&
    typeof obj.quantity === 'number'
  );
};

/**
 * Helper Types
 */
export type OrderId = Order['id'];
export type OrderItemId = OrderItem['id'];
export type ReturnId = OrderReturn['id'];

/**
 * Order Status Helper Functions
 */
export const getOrderStatusColor = (status: OrderStatus): string => {
  const statusColors: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: '#F59E0B',
    [OrderStatus.CONFIRMED]: '#3B82F6',
    [OrderStatus.PROCESSING]: '#8B5CF6',
    [OrderStatus.SHIPPED]: '#10B981',
    [OrderStatus.OUT_FOR_DELIVERY]: '#06B6D4',
    [OrderStatus.DELIVERED]: '#22C55E',
    [OrderStatus.CANCELLED]: '#EF4444',
    [OrderStatus.REFUNDED]: '#F97316',
    [OrderStatus.FAILED]: '#DC2626',
    [OrderStatus.ON_HOLD]: '#6B7280',
  };
  return statusColors[status] || '#6B7280';
};

export const getOrderStatusLabel = (status: OrderStatus): string => {
  const statusLabels: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'Pending',
    [OrderStatus.CONFIRMED]: 'Confirmed',
    [OrderStatus.PROCESSING]: 'Processing',
    [OrderStatus.SHIPPED]: 'Shipped',
    [OrderStatus.OUT_FOR_DELIVERY]: 'Out for Delivery',
    [OrderStatus.DELIVERED]: 'Delivered',
    [OrderStatus.CANCELLED]: 'Cancelled',
    [OrderStatus.REFUNDED]: 'Refunded',
    [OrderStatus.FAILED]: 'Failed',
    [OrderStatus.ON_HOLD]: 'On Hold',
  };
  return statusLabels[status] || status;
};

export const canCancelOrder = (status: OrderStatus): boolean => {
  return [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.PROCESSING].includes(status);
};

export const canReturnOrder = (status: OrderStatus, deliveredAt?: string): boolean => {
  if (status !== OrderStatus.DELIVERED || !deliveredAt) {
    return false;
  }
  // Check if within 7 days return window
  const deliveryDate = new Date(deliveredAt);
  const today = new Date();
  const daysSinceDelivery = Math.floor(
    (today.getTime() - deliveryDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  return daysSinceDelivery <= 7;
};
