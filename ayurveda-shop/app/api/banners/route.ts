import { NextRequest, NextResponse } from 'next/server';

// GET all banners
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const position = searchParams.get('position');
    const status = searchParams.get('status');

    // For now, return empty array since banners are not implemented in backend
    // In the future, this should proxy to backend API
    const banners: any[] = [];

    return NextResponse.json({
      success: true,
      banners,
      message: 'Banner management not yet implemented in backend'
    });
  } catch (error: any) {
    console.error('Error fetching banners:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch banners', banners: [] },
      { status: 500 }
    );
  }
}
