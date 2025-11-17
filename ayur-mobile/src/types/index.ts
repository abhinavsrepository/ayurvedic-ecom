/**
 * TypeScript Type Definitions
 * Comprehensive types for the Ayurvedic eCommerce App
 */

// ==================== Product Types ====================

export type DoshaType = 'Vata' | 'Pitta' | 'Kapha' | 'Tridosha';

export type CategoryType =
  | 'Oils'
  | 'Powders'
  | 'Tablets'
  | 'Teas'
  | 'Skincare'
  | 'Hair Care'
  | 'Wellness';

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: CategoryType;
  doshaTypes: DoshaType[];
  images: string[];
  thumbnail: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockQuantity: number;
  benefits: string[];
  ingredients: string[];
  usage: string;
  isFeatured: boolean;
  isBestSeller: boolean;
  tags: string[];
}

export interface ProductReview {
  id: string;
  productId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

// ==================== Cart Types ====================

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

// ==================== User Types ====================

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  doshaType?: DoshaType;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

// ==================== Order Types ====================

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  shippingAddress: Address;
  paymentMethod: string;
  orderDate: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

// ==================== Payment Types ====================

export type PaymentMethodType = 'card' | 'upi' | 'netbanking' | 'cod';

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  name: string;
  icon: string;
  details?: {
    cardNumber?: string;
    cardHolder?: string;
    expiryDate?: string;
    upiId?: string;
  };
  isDefault: boolean;
}

// ==================== Filter Types ====================

export interface ProductFilters {
  category?: CategoryType;
  doshaType?: DoshaType;
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  inStock?: boolean;
  sortBy?: 'price-low' | 'price-high' | 'rating' | 'popular' | 'newest';
}

// ==================== Navigation Types ====================

export type RootStackParamList = {
  AuthStack: undefined;
  MainTabs: undefined;
  ProductDetails: { productId: string };
  Cart: undefined;
  Checkout: undefined;
  OrderSuccess: { orderId: string };
  Search: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

export type MainTabsParamList = {
  Home: undefined;
  Products: { category?: CategoryType };
  Wishlist: undefined;
  Profile: undefined;
};

// ==================== Context Types ====================

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

export interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
}

export interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
}

// ==================== Component Props ====================

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: any;
}

export interface ProductCardProps {
  product: Product;
  onPress: () => void;
  showWishlist?: boolean;
}

export interface CategoryCardProps {
  category: CategoryType;
  icon: string;
  onPress: () => void;
}
