/**
 * ISR Revalidation Webhook Endpoint
 *
 * This endpoint allows the NestJS backend to trigger on-demand revalidation
 * of specific pages when content changes (products, blog posts, etc.)
 *
 * Usage:
 * POST /api/revalidate?secret=YOUR_SECRET
 * Body: { path: '/product/turmeric-powder' } or { paths: ['/product/1', '/product/2'] }
 */

import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

// Secret token to prevent unauthorized revalidation
const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET || 'your-secret-token-change-in-production';

export async function POST(request: NextRequest) {
  try {
    // Verify secret token
    const secret = request.nextUrl.searchParams.get('secret');

    if (secret !== REVALIDATION_SECRET) {
      return NextResponse.json(
        { error: 'Invalid token', success: false },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { path, paths, tag, tags } = body;

    // Track what was revalidated
    const revalidated: string[] = [];

    // Revalidate single path
    if (path) {
      revalidatePath(path);
      revalidated.push(`path:${path}`);
    }

    // Revalidate multiple paths
    if (paths && Array.isArray(paths)) {
      for (const p of paths) {
        revalidatePath(p);
        revalidated.push(`path:${p}`);
      }
    }

    // Revalidate single tag
    if (tag) {
      revalidateTag(tag);
      revalidated.push(`tag:${tag}`);
    }

    // Revalidate multiple tags
    if (tags && Array.isArray(tags)) {
      for (const t of tags) {
        revalidateTag(t);
        revalidated.push(`tag:${t}`);
      }
    }

    // Check if anything was revalidated
    if (revalidated.length === 0) {
      return NextResponse.json(
        {
          error: 'No path or tag provided',
          success: false,
          message: 'Please provide at least one path or tag to revalidate',
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      revalidated,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Revalidation error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for health check
 */
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  if (secret !== REVALIDATION_SECRET) {
    return NextResponse.json(
      { error: 'Invalid token', success: false },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Revalidation endpoint is active',
    timestamp: new Date().toISOString(),
  });
}
