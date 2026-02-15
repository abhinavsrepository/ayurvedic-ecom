import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

// GET all blog categories - Proxy to backend
export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/blog/categories`, {
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
    console.error('Error fetching blog categories:', error);
    return NextResponse.json([], { status: 200 });
  }
}
