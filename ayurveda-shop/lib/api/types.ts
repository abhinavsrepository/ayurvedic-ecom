// Auth types
export interface LoginRequest {
  username: string;
  password: string;
  twoFaCode?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserInfo;
}

export interface UserInfo {
  username: string;
  email: string;
  fullName: string;
  roles: string[];
  twoFaEnabled: boolean;
}

export interface UserProfileResponse {
  username: string;
  email: string;
  fullName: string;
  roles: string[];
  twoFaEnabled: boolean;
}

export interface TwoFaEnableResponse {
  qrCode: string;
  secret: string;
}

export interface TwoFaVerifyRequest {
  code: string;
}

// Product types
export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  mrp: number;
  image: string;
  ingredients: string[];
  benefits: string[];
  usage: string;
  featured: boolean;
  bestseller: boolean;
  newArrival: boolean;
  rating: number;
  reviewCount: number;
  stockQuantity: number;
  sku: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCreateRequest {
  name: string;
  description: string;
  category: string;
  price: number;
  mrp: number;
  image: string;
  ingredients: string[];
  benefits: string[];
  usage: string;
  featured: boolean;
  bestseller: boolean;
  newArrival: boolean;
  stockQuantity: number;
  sku: string;
}

export interface ProductUpdateRequest extends ProductCreateRequest {}

export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  mrp: number;
  image: string;
  ingredients: string[];
  benefits: string[];
  usage: string;
  featured: boolean;
  bestseller: boolean;
  newArrival: boolean;
  rating: number;
  reviewCount: number;
  stockQuantity: number;
  sku: string;
  createdAt: string;
  updatedAt: string;
}

// Order types
export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod?: string;
  trackingNumber?: string;
  carrier?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
  cancelledReason?: string;
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
}

export enum FulfillmentStatus {
  UNFULFILLED = 'unfulfilled',
  PARTIALLY_FULFILLED = 'partially_fulfilled',
  FULFILLED = 'fulfilled',
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  sku?: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  discountAmount?: number;
}

export interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// Create Order DTO
export interface CreateOrderItemDto {
  productId: string;
  quantity: number;
}

export interface CreateOrderDto {
  items: CreateOrderItemDto[];
  couponCode?: string;
  shippingAddressLine1: string;
  shippingAddressLine2?: string;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingCountry: string;
  notes?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export interface OrderListResponse {
  id: number;
  orderNumber: string;
  customerName: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
}

export interface OrderDetailResponse extends Order {}

export interface OrderStatusUpdateRequest {
  status: OrderStatus;
  trackingNumber?: string;
  notes?: string;
}

export interface OrderRefundRequest {
  reason: string;
  amount: number;
}

// Customer types
export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lifetimeValue: number;
  lastOrderAt: string | null;
  acceptsMarketing: boolean;
  createdAt: string;
  updatedAt: string;
  // UI helpers
  name?: string;
  status?: 'active' | 'inactive';
  phone?: string;
  lastOrderDate?: string;
}

// Pagination
export interface PageRequest {
  page?: number;
  size?: number;
  sort?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

// Statistics
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  revenueGrowth: number;
  ordersGrowth: number;
  customersGrowth: number;
  aovGrowth: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

// Payment types
export enum PaymentProvider {
  STRIPE = 'STRIPE',
  RAZORPAY = 'RAZORPAY',
}

export interface CreatePaymentDto {
  orderId: string;
  amount: number;
  currency: string;
  provider: PaymentProvider;
  paymentMethodId?: string;
}

export interface PaymentResponse {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  checkoutUrl?: string;
  clientSecret?: string;
}

export interface RazorpayPaymentData {
  orderId: string;
  paymentId: string;
  signature: string;
  internalOrderId: string;
}

export interface StripePaymentData {
  paymentIntentId: string;
  internalOrderId: string;
}

export interface PaymentStatusResponse {
  orderId: string;
  orderNumber: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  total: number;
}

export interface OrderTrackingInfo {
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  trackingNumber?: string;
  carrier?: string;
  shippingAddress: ShippingAddress;
  createdAt: string;
  updatedAt: string;
}
