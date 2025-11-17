import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

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
      console.warn(`Backend returned ${response.status} for products endpoint`);
      // Return empty array instead of throwing error
      return NextResponse.json({
        success: true,
        products: [],
        message: 'Backend products endpoint not available or returned error'
      });
    }

    const data = await response.json();

    // Transform backend response to match frontend expectations
    const products = data.content || data || [];
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    console.error('Error fetching products from backend:', error);

    // Return empty array instead of error for network issues
    if (error.code === 'ECONNREFUSED' || error.cause?.code === 'ECONNREFUSED') {
      console.warn('Backend is not running - returning empty products array');
      return NextResponse.json({
        success: true,
        products: [],
        message: 'Backend is not running'
      });
    }

    return NextResponse.json(
      { success: true, products: [], message: error.message || 'Failed to fetch products' }
    );
  }
}

// POST - Create new product - Proxy to backend
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
