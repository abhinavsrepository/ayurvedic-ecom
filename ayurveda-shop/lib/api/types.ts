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
  id: number;
  orderNumber: string;
  customerId: number;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: Address;
  paymentMethod: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
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

export interface RefundRequest {
  reason: string;
  amount: number;
}

// Customer types
export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate?: string;
  status: 'active' | 'inactive';
  createdAt: string;
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
