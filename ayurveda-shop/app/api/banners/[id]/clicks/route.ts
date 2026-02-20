import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// POST - Track banner click
export async function POST(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const response = await fetch(`${BACKEND_URL}/api/banners/${id}/clicks`, {
      method: 'POST',
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
    console.error('Error tracking click:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to track click' },
      { status: 502 }
    );
  }
}
