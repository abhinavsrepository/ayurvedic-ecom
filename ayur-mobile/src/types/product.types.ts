/**
 * Product Type Definitions
 *
 * Complete type definitions for products, categories, filters, and related entities.
 */

/**
 * Dosha Types
 * The three Ayurvedic body types
 */
export enum DoshaType {
  VATA = 'vata',
  PITTA = 'pitta',
  KAPHA = 'kapha',
}

/**
 * Product Availability Status
 */
export enum ProductAvailability {
  IN_STOCK = 'in_stock',
  OUT_OF_STOCK = 'out_of_stock',
  LIMITED_STOCK = 'limited_stock',
  PRE_ORDER = 'pre_order',
  DISCONTINUED = 'discontinued',
}

/**
 * Product Condition
 */
export enum ProductCondition {
  NEW = 'new',
  REFURBISHED = 'refurbished',
  USED = 'used',
}

/**
 * Badge Types for Products
 */
export enum ProductBadgeType {
  NEW = 'new',
  BESTSELLER = 'bestseller',
  TRENDING = 'trending',
  FEATURED = 'featured',
  SALE = 'sale',
  ORGANIC = 'organic',
  VEGAN = 'vegan',
  GLUTEN_FREE = 'gluten_free',
  AYURVEDIC_CERTIFIED = 'ayurvedic_certified',
  LIMITED_EDITION = 'limited_edition',
}

/**
 * Product Image
 */
export interface ProductImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  alt: string;
  isPrimary: boolean;
  order: number;
}

/**
 * Product Variant
 */
export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  isAvailable: boolean;
  stock: number;
  attributes: {
    size?: string;
    weight?: string;
    volume?: string;
    color?: string;
    flavor?: string;
    [key: string]: string | undefined;
  };
}

/**
 * Product Review
 */
export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
  images?: string[];
}

/**
 * Product Rating Summary
 */
export interface ProductRating {
  average: number;
  count: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

/**
 * Product Nutrition Info
 */
export interface NutritionInfo {
  servingSize: string;
  servingsPerContainer?: number;
  calories?: number;
  nutrients: {
    name: string;
    amount: string;
    dailyValue?: string;
  }[];
}

/**
 * Product Ingredient
 */
export interface ProductIngredient {
  name: string;
  percentage?: number;
  benefits?: string[];
  isAyurvedic?: boolean;
}

/**
 * Dosha Balance Information
 */
export interface DoshaBalance {
  vata: number; // -10 to +10 (negative = decreases, positive = increases)
  pitta: number;
  kapha: number;
  description?: string;
  recommendations?: string[];
}

/**
 * Main Product Interface
 */
export interface Product {
  // Basic Info
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;

  // Pricing
  price: number;
  compareAtPrice?: number;
  discountPercentage?: number;
  currency: string;

  // Images
  images: ProductImage[];
  primaryImage: string;
  thumbnailImage: string;

  // Categories & Tags
  categoryId: string;
  categoryName: string;
  categoryPath: string[]; // Breadcrumb path
  subCategories?: string[];
  tags: string[];
  badges: ProductBadgeType[];

  // Brand
  brandId?: string;
  brandName?: string;
  brandLogo?: string;

  // Availability
  availability: ProductAvailability;
  stock: number;
  isAvailable: boolean;
  estimatedDelivery?: string;

  // Variants
  hasVariants: boolean;
  variants?: ProductVariant[];
  selectedVariantId?: string;

  // Ratings & Reviews
  rating: ProductRating;
  reviewCount: number;

  // Ayurvedic Properties
  doshaBalance?: DoshaBalance;
  suitableFor?: DoshaType[];
  ayurvedicCategory?: string;
  ayurvedicBenefits?: string[];

  // Ingredients & Nutrition
  ingredients?: ProductIngredient[];
  nutritionInfo?: NutritionInfo;
  allergens?: string[];

  // Usage
  usage?: string;
  dosage?: string;
  precautions?: string[];
  sideEffects?: string[];

  // Certifications
  certifications?: {
    name: string;
    logo?: string;
    verificationUrl?: string;
  }[];

  // Additional Info
  weight?: string;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  shelfLife?: string;
  storageInstructions?: string;
  manufacturingDetails?: {
    madeIn: string;
    manufacturer: string;
    manufacturingDate?: string;
    expiryDate?: string;
  };

  // SEO & Meta
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];

  // Timestamps
  createdAt: string;
  updatedAt: string;

  // Features
  isFeatured: boolean;
  isBestseller: boolean;
  isTrending: boolean;
  isNew: boolean;

  // Related Products
  relatedProductIds?: string[];
}

/**
 * Product Category
 */
export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  parentId?: string;
  level: number;
  order: number;
  productCount: number;
  isActive: boolean;
  isFeatured: boolean;
  children?: ProductCategory[];
  path?: string[]; // Breadcrumb path
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Product Filter Options
 */
export interface ProductFilter {
  // Search
  query?: string;

  // Category
  categoryId?: string;
  categorySlug?: string;

  // Price Range
  minPrice?: number;
  maxPrice?: number;

  // Rating
  minRating?: number;

  // Availability
  availability?: ProductAvailability[];
  inStockOnly?: boolean;

  // Dosha
  doshaType?: DoshaType[];

  // Tags & Badges
  tags?: string[];
  badges?: ProductBadgeType[];

  // Brand
  brandId?: string;
  brandIds?: string[];

  // Certifications
  certifications?: string[];

  // Features
  isFeatured?: boolean;
  isBestseller?: boolean;
  isTrending?: boolean;
  isNew?: boolean;

  // Sorting
  sortBy?: ProductSortOption;
  sortOrder?: 'asc' | 'desc';

  // Pagination
  page?: number;
  limit?: number;
  offset?: number;
}

/**
 * Product Sort Options
 */
export enum ProductSortOption {
  RELEVANCE = 'relevance',
  PRICE_LOW_TO_HIGH = 'price_asc',
  PRICE_HIGH_TO_LOW = 'price_desc',
  RATING = 'rating',
  NEWEST = 'newest',
  POPULARITY = 'popularity',
  NAME_A_Z = 'name_asc',
  NAME_Z_A = 'name_desc',
  DISCOUNT = 'discount',
}

/**
 * Product List Response (for API)
 */
export interface ProductListResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters?: {
    categories: ProductCategory[];
    brands: { id: string; name: string; count: number }[];
    priceRange: { min: number; max: number };
    doshaTypes: { type: DoshaType; count: number }[];
    badges: { type: ProductBadgeType; count: number }[];
  };
}

/**
 * Cart Item (Product in Cart)
 */
export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  product: Product;
  quantity: number;
  price: number;
  subtotal: number;
  isAvailable: boolean;
  addedAt: string;
}

/**
 * Wishlist Item (Product in Wishlist)
 */
export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  addedAt: string;
  isAvailable: boolean;
  priceDropAlert: boolean;
  stockAlert: boolean;
}

/**
 * Product Search Suggestion
 */
export interface SearchSuggestion {
  type: 'product' | 'category' | 'brand' | 'query';
  id: string;
  text: string;
  image?: string;
  metadata?: {
    productCount?: number;
    categoryPath?: string[];
    [key: string]: any;
  };
}

/**
 * Product Recommendation
 */
export interface ProductRecommendation {
  type:
    | 'personalized'
    | 'similar'
    | 'trending'
    | 'bestseller'
    | 'frequently_bought_together'
    | 'dosha_based'
    | 'recently_viewed';
  products: Product[];
  title: string;
  description?: string;
}

/**
 * Product Quick View (minimal product data for quick preview)
 */
export interface ProductQuickView {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  primaryImage: string;
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  badges: ProductBadgeType[];
}

/**
 * Type Guards
 */
export const isProduct = (obj: any): obj is Product => {
  return obj && typeof obj.id === 'string' && typeof obj.name === 'string';
};

export const isProductCategory = (obj: any): obj is ProductCategory => {
  return obj && typeof obj.id === 'string' && typeof obj.name === 'string' && typeof obj.level === 'number';
};

/**
 * Helper Types
 */
export type ProductId = Product['id'];
export type CategoryId = ProductCategory['id'];
export type VariantId = ProductVariant['id'];
