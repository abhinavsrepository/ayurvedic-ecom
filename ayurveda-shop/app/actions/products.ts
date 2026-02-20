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

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

const normalizePageResponse = (raw: any) => {
  const page = raw?.number ?? raw?.page ?? 0;
  const totalPages = raw?.totalPages ?? 0;
  const content = Array.isArray(raw?.content) ? raw.content : [];

  return {
    ...raw,
    content,
    totalElements: raw?.totalElements ?? raw?.total ?? content.length,
    last: raw?.last ?? page >= Math.max(totalPages - 1, 0),
    first: raw?.first ?? page === 0,
    numberOfElements: raw?.numberOfElements ?? content.length,
    number: page,
    sort: raw?.sort ?? [],
    empty: raw?.empty ?? content.length === 0,
  };
};

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

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: {
          revalidate: 60,
          tags: ['products'],
        },
        signal: AbortSignal.timeout(3000), // 3 second timeout
      });

      if (!response.ok) {
        throw new Error('Backend not available');
      }

      const data = await response.json();
      return PageProductResponseSchema.parse(normalizePageResponse(data));
    } catch (error: any) {
      throw new Error(`Failed to fetch products: ${error?.message || 'Unknown error'}`);
    }
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
      const url = `${BACKEND_URL}/api/products/slug/${slug}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: {
          revalidate: 60,
          tags: [`product-${slug}`],
        },
        signal: AbortSignal.timeout(3000), // 3 second timeout
      });

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Backend returned ${response.status}`);
      }

      const data = await response.json();
      return ProductResponseSchema.parse(data);
    } catch (error: any) {
      throw new Error(`Failed to fetch product '${slug}': ${error?.message || 'Unknown error'}`);
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
      status: 'ACTIVE',
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
    const url = `${BACKEND_URL}/api/products?size=${limit}&sort=is_featured,desc&status=ACTIVE`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 300,
        tags: ['featured-products'],
      },
      signal: AbortSignal.timeout(3000), // 3 second timeout
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch featured products: ${response.status}`);
    }

    const data = await response.json();
    const parsed = PageProductResponseSchema.parse(normalizePageResponse(data));
    return parsed.content;
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
      status: 'ACTIVE',
    };

    return await getProducts(params);
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
  revalidateTag('products', 'default');
  revalidateTag('featured-products', 'default');

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
  revalidateTag('products', 'default');
  revalidateTag(`product-${product.slug}`, 'default');
  revalidateTag('featured-products', 'default');

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
  revalidateTag('products', 'default');
  revalidateTag('featured-products', 'default');
}
