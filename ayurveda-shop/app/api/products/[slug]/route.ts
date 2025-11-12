import { NextRequest, NextResponse } from 'next/server';
import { productDetailsData } from '@/lib/data/productDetails';

interface RouteParams {
  params: {
    slug: string;
  };
}

// GET product by slug
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { slug } = params;

    // In a real app, this would fetch from a database
    const product = productDetailsData[slug];

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT - Update product
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { slug } = params;
    const body = await request.json();

    // In a real app, this would update in a database
    const existingProduct = productDetailsData[slug];

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    const updatedProduct = {
      ...existingProduct,
      ...body,
      id: existingProduct.id, // Preserve ID
      slug: existingProduct.slug, // Preserve slug
    };

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE product
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { slug } = params;

    // In a real app, this would delete from a database
    const product = productDetailsData[slug];

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
