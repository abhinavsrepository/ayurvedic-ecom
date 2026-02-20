import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

// GET all banners
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.toString();
    const backendUrl = `${BACKEND_URL}/api/banners${query ? `?${query}` : ''}`;

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const payload = await response.json().catch(() => ({}));
    return NextResponse.json(payload, {
      status: response.status,
    });
  } catch (error: any) {
    console.error('Error fetching banners:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch banners',
        banners: [],
      },
      { status: 502 },
    );
  }
}
