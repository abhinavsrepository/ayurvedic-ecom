import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/Product';

// Initialize products in localStorage or return existing
function getProducts(): Product[] {
  if (typeof window === 'undefined') {
    // Server-side: Return empty array, will be populated from localStorage on client
    return [];
  }

  const stored = localStorage.getItem('ayurveda_products');
  if (stored) {
    return JSON.parse(stored);
  }

  // Default products if none exist
  const defaultProducts: Product[] = [
    {
      id: "1",
      name: "Ayurvedic Hair Oil",
      slug: "ayurvedic-hair-oil",
      description: "Natural hair oil with 15 powerful herbs for hair growth and nourishment",
      price: 299,
      originalPrice: 399,
      image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&h=500&fit=crop",
      category: "Hair Care",
      inStock: true,
      rating: 4.5,
      reviewCount: 128
    },
    {
      id: "2",
      name: "Ayurvedic Cough Syrup",
      slug: "ayurvedic-cough-syrup",
      description: "Herbal cough syrup for relief from cold and cough",
      price: 149,
      originalPrice: 199,
      image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500&h=500&fit=crop",
      category: "Immunity",
      inStock: true,
      rating: 4.3,
      reviewCount: 89
    },
    {
      id: "3",
      name: "Diabetes Care Supplement",
      slug: "diabetes-care-supplement",
      description: "Natural supplement to help manage blood sugar levels",
      price: 499,
      originalPrice: 699,
      image: "https://images.unsplash.com/photo-1550572017-4c1a9489d5bf?w=500&h=500&fit=crop",
      category: "Wellness",
      inStock: true,
      rating: 4.6,
      reviewCount: 156
    },
    {
      id: "4",
      name: "Active Protein Powder",
      slug: "active-protein-powder",
      description: "Plant-based protein powder with Ashwagandha and natural ingredients",
      price: 899,
      originalPrice: 1299,
      image: "https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=500&h=500&fit=crop",
      category: "Fitness",
      inStock: true,
      rating: 4.7,
      reviewCount: 203
    },
    {
      id: "5",
      name: "Liver Care Capsules",
      slug: "liver-care-capsules",
      description: "Ayurvedic capsules for liver detoxification and health",
      price: 399,
      originalPrice: 549,
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&h=500&fit=crop",
      category: "Wellness",
      inStock: true,
      rating: 4.4,
      reviewCount: 94
    },
    {
      id: "6",
      name: "Liver Oil Extract",
      slug: "liver-oil-extract",
      description: "Premium liver oil extract with omega fatty acids",
      price: 599,
      originalPrice: 799,
      image: "https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=500&h=500&fit=crop",
      category: "Wellness",
      inStock: true,
      rating: 4.5,
      reviewCount: 112
    }
  ];

  localStorage.setItem('ayurveda_products', JSON.stringify(defaultProducts));
  return defaultProducts;
}

function saveProducts(products: Product[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ayurveda_products', JSON.stringify(products));
  }
}

// GET all products
export async function GET(request: NextRequest) {
  try {
    // In a real app, this would fetch from a database
    // For now, we'll use a mock response with the default products
    const products = [
      {
        id: "1",
        name: "Ayurvedic Hair Oil",
        slug: "ayurvedic-hair-oil",
        description: "Natural hair oil with 15 powerful herbs for hair growth and nourishment",
        price: 299,
        originalPrice: 399,
        image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&h=500&fit=crop",
        category: "Hair Care",
        inStock: true,
        rating: 4.5,
        reviewCount: 128
      },
      {
        id: "2",
        name: "Ayurvedic Cough Syrup",
        slug: "ayurvedic-cough-syrup",
        description: "Herbal cough syrup for relief from cold and cough",
        price: 149,
        originalPrice: 199,
        image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500&h=500&fit=crop",
        category: "Immunity",
        inStock: true,
        rating: 4.3,
        reviewCount: 89
      },
      {
        id: "3",
        name: "Diabetes Care Supplement",
        slug: "diabetes-care-supplement",
        description: "Natural supplement to help manage blood sugar levels",
        price: 499,
        originalPrice: 699,
        image: "https://images.unsplash.com/photo-1550572017-4c1a9489d5bf?w=500&h=500&fit=crop",
        category: "Wellness",
        inStock: true,
        rating: 4.6,
        reviewCount: 156
      },
      {
        id: "4",
        name: "Active Protein Powder",
        slug: "active-protein-powder",
        description: "Plant-based protein powder with Ashwagandha and natural ingredients",
        price: 899,
        originalPrice: 1299,
        image: "https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=500&h=500&fit=crop",
        category: "Fitness",
        inStock: true,
        rating: 4.7,
        reviewCount: 203
      },
      {
        id: "5",
        name: "Liver Care Capsules",
        slug: "liver-care-capsules",
        description: "Ayurvedic capsules for liver detoxification and health",
        price: 399,
        originalPrice: 549,
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&h=500&fit=crop",
        category: "Wellness",
        inStock: true,
        rating: 4.4,
        reviewCount: 94
      },
      {
        id: "6",
        name: "Liver Oil Extract",
        slug: "liver-oil-extract",
        description: "Premium liver oil extract with omega fatty acids",
        price: 599,
        originalPrice: 799,
        image: "https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=500&h=500&fit=crop",
        category: "Wellness",
        inStock: true,
        rating: 4.5,
        reviewCount: 112
      }
    ];

    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'slug', 'description', 'price', 'category'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // In a real app, this would save to a database
    // For now, we'll return success with the created product
    const newProduct: Product = {
      id: Date.now().toString(),
      name: body.name,
      slug: body.slug,
      description: body.description,
      price: body.price,
      originalPrice: body.originalPrice,
      image: body.image || 'https://via.placeholder.com/500?text=Product',
      category: body.category,
      inStock: body.inStock !== undefined ? body.inStock : true,
      rating: body.rating || 0,
      reviewCount: body.reviewCount || 0
    };

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
