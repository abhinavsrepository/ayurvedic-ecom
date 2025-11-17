import { z } from 'zod';

// Product Image Schema
export const ProductImageSchema = z.object({
  url: z.string().url(),
  altText: z.string().optional(),
});

export type ProductImage = z.infer<typeof ProductImageSchema>;

// Product Response Schema
export const ProductResponseSchema = z.object({
  id: z.string().uuid(),
  sku: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  price: z.number(),
  compareAtPrice: z.number().optional(),
  costPrice: z.number().optional(),
  status: z.enum(['active', 'inactive', 'draft']),
  category: z.string().optional(),
  brand: z.string().optional(),
  tags: z.array(z.string()).default([]),
  images: z.array(ProductImageSchema).default([]),
  weightGrams: z.number().int().optional(),
  isFeatured: z.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  stockQuantity: z.number().int().default(0),
  lowStock: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

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

// Product Create Request Schema
export const ProductCreateRequestSchema = z.object({
  sku: z.string().max(100),
  name: z.string().max(500),
  slug: z.string().max(200).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  shortDescription: z.string().max(1000).optional(),
  price: z.number().positive(),
  compareAtPrice: z.number().nonnegative().optional(),
  costPrice: z.number().nonnegative().optional(),
  status: z.enum(['active', 'inactive', 'draft']),
  category: z.string().optional(),
  brand: z.string().optional(),
  tags: z.array(z.string()).optional(),
  images: z.array(ProductImageSchema).optional(),
  weightGrams: z.number().int().optional(),
  isFeatured: z.boolean().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export type ProductCreateRequest = z.infer<typeof ProductCreateRequestSchema>;

// Product Update Request Schema
export const ProductUpdateRequestSchema = z.object({
  name: z.string().max(500).optional(),
  description: z.string().optional(),
  shortDescription: z.string().max(1000).optional(),
  price: z.number().positive().optional(),
  compareAtPrice: z.number().nonnegative().optional(),
  costPrice: z.number().nonnegative().optional(),
  status: z.enum(['active', 'inactive', 'draft']).optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  tags: z.array(z.string()).optional(),
  images: z.array(ProductImageSchema).optional(),
  weightGrams: z.number().int().optional(),
  isFeatured: z.boolean().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export type ProductUpdateRequest = z.infer<typeof ProductUpdateRequestSchema>;

// Query Parameters
export const ProductListParamsSchema = z.object({
  page: z.number().int().min(0).default(0),
  size: z.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  status: z.enum(['active', 'inactive', 'draft']).optional(),
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
