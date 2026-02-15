import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

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
    longDescription: backendProduct.description || '',
    price: Number(backendProduct.price),
    compare_at_price: backendProduct.compare_at_price ? Number(backendProduct.compare_at_price) : null,
    originalPrice: backendProduct.compare_at_price ? Number(backendProduct.compare_at_price) : undefined,
    image: backendProduct.image || backendProduct.product_images?.[0]?.url || 'https://via.placeholder.com/400?text=Product',
    images: backendProduct.product_images?.map((img: any) => img.url) || [],
    category: backendProduct.category || 'Uncategorized',
    inStock: backendProduct.status === 'ACTIVE',
    rating: backendProduct.rating || 4.5,
    reviewCount: backendProduct.review_count || 0,
    status: backendProduct.status,
    sku: backendProduct.sku,
    brand: backendProduct.brand,
    weight_grams: backendProduct.weight_grams,
    ingredients,
    benefits,
    howToUse: backendProduct.usage_instructions ? [backendProduct.usage_instructions] : [''],
    dosage: backendProduct.dosage || '',
    warnings: backendProduct.warnings || [''],
    certifications: ['100% Natural', 'Ayurvedic', 'GMP Certified'],
    created_at: backendProduct.created_at,
    updated_at: backendProduct.updated_at,
  };
}

// GET product by slug - Proxy to backend
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { slug } = await params;

    const response = await fetch(`${BACKEND_URL}/api/products/slug/${slug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { success: false, error: 'Product not found' },
          { status: 404 }
        );
      }
      throw new Error(`Backend returned ${response.status}`);
    }

    const backendProduct = await response.json();
    const product = transformProduct(backendProduct);
    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT - Update product - Proxy to backend
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    // Get authorization header from request
    const authHeader = request.headers.get('authorization');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const response = await fetch(`${BACKEND_URL}/api/products/slug/${slug}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { success: false, error: 'Product not found' },
          { status: 404 }
        );
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Backend returned ${response.status}`);
    }

    const updatedProduct = await response.json();
    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE product - Proxy to backend
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { slug } = await params;

    // Get authorization header from request
    const authHeader = request.headers.get('authorization');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const response = await fetch(`${BACKEND_URL}/api/products/slug/${slug}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { success: false, error: 'Product not found' },
          { status: 404 }
        );
      }
      throw new Error(`Backend returned ${response.status}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete product' },
      { status: 500 }
    );
  }
}
