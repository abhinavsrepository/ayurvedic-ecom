import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

interface RouteParams {
  params: Promise<{
    productId: string;
  }>;
}

// GET reviews for a product - Proxy to backend with fallback
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { productId } = await params;
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();

    const backendUrl = `${BACKEND_URL}/api/reviews/product/${productId}${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // Return empty reviews if backend fails
      return NextResponse.json({
        reviews: [],
        stats: {
          averageRating: 0,
          totalReviews: 0,
          distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        },
        pagination: {
          page: 0,
          size: 10,
          total: 0,
          totalPages: 0
        }
      });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    // Return empty reviews on error
    return NextResponse.json({
      reviews: [],
      stats: {
        averageRating: 0,
        totalReviews: 0,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      },
      pagination: {
        page: 0,
        size: 10,
        total: 0,
        totalPages: 0
      }
    });
  }
}
