import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

// Transform backend product to frontend format
function transformProduct(backendProduct: any) {
  // Parse ingredients - backend stores as comma-separated string
  let ingredients: string[] = [];
  if (backendProduct.ingredients) {
    ingredients = typeof backendProduct.ingredients === 'string' 
      ? backendProduct.ingredients.split(',').map((i: string) => i.trim()).filter(Boolean)
      : backendProduct.ingredients;
  }
  
  // Parse benefits - backend stores as comma-separated string
  let benefits: string[] = [];
  if (backendProduct.benefits) {
    benefits = typeof backendProduct.benefits === 'string'
      ? backendProduct.benefits.split(',').map((b: string) => b.trim()).filter(Boolean)
      : backendProduct.benefits;
  }
  
  return {
    id: backendProduct.id,
    name: backendProduct.name,
    slug: backendProduct.slug,
    description: backendProduct.short_description || backendProduct.description || '',
    price: Number(backendProduct.price),
    originalPrice: backendProduct.compare_at_price ? Number(backendProduct.compare_at_price) : undefined,
    image: backendProduct.image || backendProduct.product_images?.[0]?.url || 'https://via.placeholder.com/400?text=Product',
    category: backendProduct.category || 'Uncategorized',
    inStock: backendProduct.status === 'ACTIVE',
    rating: backendProduct.rating || 4.5,
    reviewCount: backendProduct.review_count || 0,
    // Backend-specific fields
    sku: backendProduct.sku,
    status: backendProduct.status,
    brand: backendProduct.brand,
    ingredients,
    benefits,
    weight_grams: backendProduct.weight_grams,
    created_at: backendProduct.created_at,
    updated_at: backendProduct.updated_at,
  };
}

// GET all products - Proxy to backend
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();

    const backendUrl = `${BACKEND_URL}/api/products${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `Backend returned ${response.status} for products endpoint`,
        },
        { status: response.status },
      );
    }

    const data = await response.json();

    // Transform backend response to match frontend expectations
    // Backend returns paginated data with 'content' array
    const backendProducts = data.content || data || [];
    
    // Transform each product to match frontend interface
    const products = backendProducts.map(transformProduct);
    
    return NextResponse.json({ 
      success: true, 
      products,
      pagination: {
        total: data.totalElements || data.total || products.length,
        page: data.number || data.page || 0,
        size: data.size || 20,
        totalPages: data.totalPages || 1,
      }
    });
  } catch (error: any) {
    console.error('Error fetching products from backend:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch products' },
      { status: 502 },
    );
  }
}

// POST - Create new product - Proxy to backend
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Get authorization header from request
    const authHeader = request.headers.get('authorization');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const response = await fetch(`${BACKEND_URL}/api/products`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Backend returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ success: true, product: data }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}
