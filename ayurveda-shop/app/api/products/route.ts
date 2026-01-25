import { NextRequest, NextResponse } from 'next/server';
import { allProducts } from '@/lib/data/allProducts';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

// GET all products - Proxy to backend with fallback to mock data
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
      console.warn(`Backend returned ${response.status} for products endpoint, using mock data`);
      return NextResponse.json({
        success: true,
        products: allProducts,
        message: 'Using mock data - Backend products endpoint not available'
      });
    }

    const data = await response.json();

    // Transform backend response to match frontend expectations
    const products = data.content || data || [];
    
    // If backend returns empty, use mock data
    if (products.length === 0) {
      return NextResponse.json({
        success: true,
        products: allProducts,
        message: 'Using mock data - Backend returned empty'
      });
    }
    
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    console.error('Error fetching products from backend:', error);

    // Return mock data when backend is not available
    console.warn('Backend is not running - returning mock products');
    return NextResponse.json({
      success: true,
      products: allProducts,
      message: 'Using mock data - Backend is not running'
    });
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
