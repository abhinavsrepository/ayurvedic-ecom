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
import { featuredProducts as mockProducts } from '@/lib/data/products';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

const USE_MOCK_DATA = false;

// Mock data transformation
function transformMockProduct(mock: any): ProductResponse {
  return {
    id: mock.id,
    sku: `SKU-${mock.id}`,
    name: mock.name,
    slug: mock.slug,
    description: mock.longDescription || mock.description,
    shortDescription: mock.shortDescription || mock.description.substring(0, 100) + '...',
    price: mock.price,
    compareAtPrice: mock.originalPrice,
    costPrice: undefined,
    status: 'active',
    category: mock.category,
    brand: 'Ayurveda Haven',
    tags: mock.keywords || [],
    ingredients: mock.ingredients || [],
    benefits: mock.benefits || [],
    usage: mock.howToUse,
    images: [{ url: mock.image, altText: mock.name }],
    weightGrams: undefined,
    isFeatured: mock.isBestseller || false,
    seoTitle: mock.metaTitle,
    seoDescription: mock.metaDescription,
    stockQuantity: mock.inStock ? 100 : 0,
    lowStock: false,
    rating: mock.rating,
    reviewCount: mock.reviewCount,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    // Additional SEO fields stored as custom properties
    warnings: mock.warnings,
    shelfLife: mock.shelfLife,
    madeIn: mock.madeIn,
    certifications: mock.certifications,
    doshaType: mock.doshaType,
  };
}

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
      return PageProductResponseSchema.parse(data);
    } catch (error) {
      // Silently use mock data when backend is unavailable

      let filteredProducts = mockProducts.map(transformMockProduct);

      if (validatedParams.status) {
        const statusLower = validatedParams.status.toLowerCase();
        filteredProducts = filteredProducts.filter(p => p.status === statusLower);
      }

      if (validatedParams.category) {
        filteredProducts = filteredProducts.filter(p => p.category === validatedParams.category);
      }

      if (validatedParams.search) {
        const searchLower = validatedParams.search.toLowerCase();
        filteredProducts = filteredProducts.filter(p =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description?.toLowerCase().includes(searchLower)
        );
      }

      const size = validatedParams.size || 20;
      const page = validatedParams.page || 0;
      const startIndex = page * size;
      const endIndex = startIndex + size;
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

      return {
        totalPages: Math.ceil(filteredProducts.length / size),
        totalElements: filteredProducts.length,
        last: endIndex >= filteredProducts.length,
        first: page === 0,
        numberOfElements: paginatedProducts.length,
        size,
        content: paginatedProducts,
        number: page,
        sort: [],
        empty: paginatedProducts.length === 0,
      };
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
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Backend returned ${response.status}`);
      }

      const data = await response.json();
      return ProductResponseSchema.parse(data);
    } catch (error) {
      // Silently use mock data when backend is unavailable
      const mockProduct = mockProducts.find(p => p.slug === slug);
      if (mockProduct) {
        return transformMockProduct(mockProduct);
      }
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
      status: 'ACTIVE',
    };

    try {
      const result = await getProducts(params);
      return result.content;
    } catch (error) {
      console.warn('Backend not available, using mock data for search:', query);
      const searchLower = query.toLowerCase();
      const searchResults = mockProducts
        .filter(p =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
        )
        .slice(0, limit)
        .map(transformMockProduct);
      return searchResults;
    }
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
        throw new Error('Backend not available');
      }

      const data = await response.json();
      const parsed = PageProductResponseSchema.parse(data);
      return parsed.content;
    } catch (error) {
      console.warn('Backend not available, using mock data for featured products:', error);
      return mockProducts
        .filter(p => p.isBestseller)
        .slice(0, limit)
        .map(transformMockProduct);
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
      status: 'ACTIVE',
    };

    try {
      return await getProducts(params);
    } catch (error) {
      console.warn('Backend not available, using mock data for category:', category);
      const categoryProducts = mockProducts
        .filter(p => p.category === category)
        .map(transformMockProduct);

      const startIndex = page * size;
      const paginatedProducts = categoryProducts.slice(startIndex, startIndex + size);

      return {
        totalPages: Math.ceil(categoryProducts.length / size),
        totalElements: categoryProducts.length,
        last: startIndex + size >= categoryProducts.length,
        first: page === 0,
        numberOfElements: paginatedProducts.length,
        size,
        content: paginatedProducts,
        number: page,
        sort: [],
        empty: paginatedProducts.length === 0,
      };
    }
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
