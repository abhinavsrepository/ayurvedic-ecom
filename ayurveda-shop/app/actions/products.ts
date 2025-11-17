'use server';

import {
  ProductResponseSchema,
  PageProductResponseSchema,
  ProductListParamsSchema,
  ProductCreateRequestSchema,
  ProductUpdateRequestSchema,
  type ProductResponse,
  type PageProductResponse,
  type ProductListParams,
  type ProductCreateRequest,
  type ProductUpdateRequest,
} from '@/lib/api/schemas';
import { revalidateTag, unstable_cache } from 'next/cache';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Cached product list with 60s revalidation
export const getProducts = unstable_cache(
  async (params?: Partial<ProductListParams>): Promise<PageProductResponse> => {
    const validatedParams = ProductListParamsSchema.partial().parse(params || {});

    const searchParams = new URLSearchParams();
    if (validatedParams.page !== undefined) searchParams.set('page', String(validatedParams.page));
    if (validatedParams.size !== undefined) searchParams.set('size', String(validatedParams.size));
    if (validatedParams.search) searchParams.set('search', validatedParams.search);
    if (validatedParams.status) searchParams.set('status', validatedParams.status);
    if (validatedParams.category) searchParams.set('category', validatedParams.category);
    if (validatedParams.sort) {
      validatedParams.sort.forEach(s => searchParams.append('sort', s));
    }

    const url = `${BACKEND_URL}/api/products?${searchParams.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 60, // Cache for 60 seconds
        tags: ['products'],
      },
    });

    if (!response.ok) {
      console.warn(`Backend returned ${response.status} for products endpoint`);
      return {
        totalPages: 0,
        totalElements: 0,
        last: true,
        first: true,
        numberOfElements: 0,
        size: validatedParams.size || 20,
        content: [],
        number: validatedParams.page || 0,
        sort: [],
        empty: true,
      };
    }

    const data = await response.json();
    return PageProductResponseSchema.parse(data);
  },
  ['products-list'],
  {
    revalidate: 60,
    tags: ['products'],
  }
);

// Cached individual product with 60s revalidation
export const getProductBySlug = unstable_cache(
  async (slug: string): Promise<ProductResponse | null> => {
    try {
      const url = `${BACKEND_URL}/api/products/${slug}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: {
          revalidate: 60,
          tags: [`product-${slug}`],
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Backend returned ${response.status}`);
      }

      const data = await response.json();
      return ProductResponseSchema.parse(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },
  ['product-by-slug'],
  {
    revalidate: 60,
  }
);

// Search products with caching
export const searchProducts = unstable_cache(
  async (query: string, limit: number = 10): Promise<ProductResponse[]> => {
    const params: ProductListParams = {
      page: 0,
      size: limit,
      search: query,
      status: 'active',
    };

    const result = await getProducts(params);
    return result.content;
  },
  ['product-search'],
  {
    revalidate: 60,
  }
);

// Get featured products
export const getFeaturedProducts = unstable_cache(
  async (limit: number = 8): Promise<ProductResponse[]> => {
    try {
      const url = `${BACKEND_URL}/api/products?size=${limit}&sort=isFeatured,desc&status=active`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: {
          revalidate: 300, // Cache for 5 minutes
          tags: ['featured-products'],
        },
      });

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      const parsed = PageProductResponseSchema.parse(data);
      return parsed.content;
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  },
  ['featured-products'],
  {
    revalidate: 300,
    tags: ['featured-products'],
  }
);

// Get products by category
export const getProductsByCategory = unstable_cache(
  async (category: string, page: number = 0, size: number = 20): Promise<PageProductResponse> => {
    const params: ProductListParams = {
      page,
      size,
      category,
      status: 'active',
    };

    return getProducts(params);
  },
  ['products-by-category'],
  {
    revalidate: 60,
  }
);

// Admin actions - no caching, requires auth

export async function createProduct(data: ProductCreateRequest): Promise<ProductResponse> {
  const validated = ProductCreateRequestSchema.parse(data);

  const response = await fetch(`${BACKEND_URL}/api/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(validated),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to create product');
  }

  const result = await response.json();
  const product = ProductResponseSchema.parse(result);

  // Revalidate caches
  revalidateTag('products');
  revalidateTag('featured-products');

  return product;
}

export async function updateProduct(
  productId: string,
  data: ProductUpdateRequest
): Promise<ProductResponse> {
  const validated = ProductUpdateRequestSchema.parse(data);

  const response = await fetch(`${BACKEND_URL}/api/products/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(validated),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to update product');
  }

  const result = await response.json();
  const product = ProductResponseSchema.parse(result);

  // Revalidate caches
  revalidateTag('products');
  revalidateTag(`product-${product.slug}`);
  revalidateTag('featured-products');

  return product;
}

export async function deleteProduct(productId: string): Promise<void> {
  const response = await fetch(`${BACKEND_URL}/api/products/${productId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Product not found');
    }
    throw new Error('Failed to delete product');
  }

  // Revalidate caches
  revalidateTag('products');
  revalidateTag('featured-products');
}
