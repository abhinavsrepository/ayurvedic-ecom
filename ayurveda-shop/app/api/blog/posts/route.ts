import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

// GET all blog posts - Proxy to backend
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();

    const backendUrl = `${BACKEND_URL}/api/blog/posts${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { 
        content: [],
        pagination: { page: 0, size: 10, total: 0, totalPages: 0 }
      },
      { status: 200 }
    );
  }
}
