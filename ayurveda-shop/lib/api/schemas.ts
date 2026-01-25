import { z } from 'zod';

// Product Image Schema
export const ProductImageSchema = z.object({
  url: z.string().url(),
  altText: z.string().optional(),
});

export type ProductImage = z.infer<typeof ProductImageSchema>;

// Product Response Schema - matches backend snake_case format
export const ProductResponseSchema = z.object({
  id: z.string().uuid(),
  sku: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  short_description: z.string().optional(),
  price: z.coerce.number(),
  compare_at_price: z.coerce.number().optional(),
  cost_price: z.coerce.number().optional(),
  status: z.enum(['ACTIVE', 'DRAFT', 'ARCHIVED']),
  category: z.string().optional(),
  brand: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  ingredients: z.array(z.string()).optional().default([]),
  benefits: z.array(z.string()).optional().default([]),
  usage: z.string().optional(),
  images: z.array(z.string()).optional().default([]),
  weight_grams: z.number().int().optional(),
  is_featured: z.boolean().default(false),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  rating: z.number().optional(),
  reviewCount: z.number().int().optional(),
  warnings: z.array(z.string()).optional(),
  shelfLife: z.string().optional(),
  madeIn: z.string().optional(),
  certifications: z.array(z.string()).optional(),
  doshaType: z.array(z.string()).optional(),
  stock: z.object({
    quantity: z.number().int(),
    reserved_quantity: z.number().int(),
    available: z.number().int(),
  }).optional(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
}).transform((data) => ({
  // Transform to camelCase for frontend use
  id: data.id,
  sku: data.sku,
  name: data.name,
  slug: data.slug,
  description: data.description,
  shortDescription: data.short_description,
  price: data.price,
  compareAtPrice: data.compare_at_price,
  costPrice: data.cost_price,
  status: data.status.toLowerCase() as 'active' | 'draft' | 'archived',
  category: data.category,
  brand: data.brand,
  tags: data.tags || [],
  ingredients: data.ingredients || [],
  benefits: data.benefits || [],
  usage: data.usage,
  images: (data.images || []).map(url => ({ url, altText: data.name })),
  weightGrams: data.weight_grams,
  isFeatured: data.is_featured,
  seoTitle: data.seo_title,
  seoDescription: data.seo_description,
  rating: data.rating,
  reviewCount: data.reviewCount,
  warnings: data.warnings,
  shelfLife: data.shelfLife,
  madeIn: data.madeIn,
  certifications: data.certifications,
  doshaType: data.doshaType,
  stockQuantity: data.stock?.quantity || 0,
  lowStock: (data.stock?.available || 0) < 10,
  createdAt: data.created_at.toISOString(),
  updatedAt: data.updated_at.toISOString(),
}));

export type ProductResponse = z.infer<typeof ProductResponseSchema>;

// Page Response Schema
export const PageableSchema = z.object({
  pageNumber: z.number().int(),
  pageSize: z.number().int(),
  paged: z.boolean(),
  unpaged: z.boolean(),
  offset: z.number().int(),
  sort: z.array(z.any()),
});

export const PageProductResponseSchema = z.object({
  totalPages: z.number().int(),
  totalElements: z.number().int(),
  last: z.boolean(),
  pageable: PageableSchema.optional(),
  first: z.boolean(),
  numberOfElements: z.number().int(),
  size: z.number().int(),
  content: z.array(ProductResponseSchema),
  number: z.number().int(),
  sort: z.array(z.any()),
  empty: z.boolean(),
});

export type PageProductResponse = z.infer<typeof PageProductResponseSchema>;

// Product Create Request Schema - uses snake_case for backend
export const ProductCreateRequestSchema = z.object({
  sku: z.string().max(100),
  name: z.string().max(500),
  slug: z.string().max(200).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  short_description: z.string().max(1000).optional(),
  price: z.number().positive(),
  compare_at_price: z.number().nonnegative().optional(),
  cost_price: z.number().nonnegative().optional(),
  status: z.enum(['ACTIVE', 'DRAFT', 'ARCHIVED']),
  category: z.string().optional(),
  brand: z.string().optional(),
  tags: z.array(z.string()).optional(),
  ingredients: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  usage: z.string().optional(),
  images: z.array(z.string()).optional(),
  weight_grams: z.number().int().optional(),
  is_featured: z.boolean().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
});

export type ProductCreateRequest = z.infer<typeof ProductCreateRequestSchema>;

// Product Update Request Schema - uses snake_case for backend
export const ProductUpdateRequestSchema = z.object({
  name: z.string().max(500).optional(),
  slug: z.string().max(200).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().optional(),
  short_description: z.string().max(1000).optional(),
  price: z.number().positive().optional(),
  compare_at_price: z.number().nonnegative().optional(),
  cost_price: z.number().nonnegative().optional(),
  status: z.enum(['ACTIVE', 'DRAFT', 'ARCHIVED']).optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  tags: z.array(z.string()).optional(),
  ingredients: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  usage: z.string().optional(),
  images: z.array(z.string()).optional(),
  weight_grams: z.number().int().optional(),
  is_featured: z.boolean().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
});

export type ProductUpdateRequest = z.infer<typeof ProductUpdateRequestSchema>;

// Query Parameters - uses backend's uppercase status values
export const ProductListParamsSchema = z.object({
  page: z.number().int().min(0).default(0),
  size: z.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  status: z.enum(['ACTIVE', 'DRAFT', 'ARCHIVED']).optional(),
  category: z.string().optional(),
  sort: z.array(z.string()).optional(),
});

export type ProductListParams = z.infer<typeof ProductListParamsSchema>;

// Order Schemas
export const OrderItemSchema = z.object({
  id: z.string().uuid(),
  sku: z.string(),
  productName: z.string(),
  quantity: z.number().int(),
  unitPrice: z.number(),
  lineTotal: z.number(),
  discountAmount: z.number().optional(),
});

export const AddressSchema = z.object({
  addressLine1: z.string(),
  addressLine2: z.string().optional(),
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
  country: z.string(),
});

export const CustomerInfoSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
});

export const OrderDetailResponseSchema = z.object({
  id: z.string().uuid(),
  orderNumber: z.string(),
  customer: CustomerInfoSchema,
  status: z.string(),
  paymentStatus: z.string(),
  fulfillmentStatus: z.string(),
  items: z.array(OrderItemSchema),
  subtotal: z.number(),
  taxAmount: z.number(),
  shippingAmount: z.number(),
  discountAmount: z.number(),
  total: z.number(),
  couponCode: z.string().optional(),
  shippingAddress: AddressSchema,
  trackingNumber: z.string().optional(),
  carrier: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type OrderDetailResponse = z.infer<typeof OrderDetailResponseSchema>;

export const OrderListResponseSchema = z.object({
  id: z.string().uuid(),
  orderNumber: z.string(),
  customerName: z.string(),
  customerEmail: z.string(),
  status: z.string(),
  paymentStatus: z.string(),
  fulfillmentStatus: z.string(),
  total: z.number(),
  itemsCount: z.number().int(),
  createdAt: z.string().datetime(),
});

export type OrderListResponse = z.infer<typeof OrderListResponseSchema>;

export const PageOrderListResponseSchema = z.object({
  totalPages: z.number().int(),
  totalElements: z.number().int(),
  last: z.boolean(),
  first: z.boolean(),
  numberOfElements: z.number().int(),
  size: z.number().int(),
  content: z.array(OrderListResponseSchema),
  number: z.number().int(),
  empty: z.boolean(),
});

export type PageOrderListResponse = z.infer<typeof PageOrderListResponseSchema>;
