import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

interface RouteParams {
  params: Promise<{
    productId: string;
  }>;
}

// GET rating stats for a product - Proxy to backend with fallback
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { productId } = await params;

    const response = await fetch(`${BACKEND_URL}/api/reviews/product/${productId}/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // Return default stats if backend fails
      return NextResponse.json({
        averageRating: 0,
        totalReviews: 0,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching review stats:', error);
    // Return default stats on error
    return NextResponse.json({
      averageRating: 0,
      totalReviews: 0,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    });
  }
}
