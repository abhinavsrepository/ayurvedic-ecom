import { NextRequest, NextResponse } from 'next/server';

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

    // For now, just return success
    // In the future, this should proxy to backend API
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error tracking click:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to track click' },
      { status: 500 }
    );
  }
}
