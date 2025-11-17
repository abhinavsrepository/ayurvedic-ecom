import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getProductBySlug, getProducts } from '@/app/actions/products';
import ProductDetailSkeleton from '@/components/products/ProductDetailSkeleton';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import ProductClient from './ProductClient';
import Breadcrumbs, { type BreadcrumbItem } from '@/components/seo/Breadcrumbs';
import StructuredData, { generateProductSchema } from '@/components/seo/StructuredData';
import { REVALIDATION_TIMES, SITE_CONFIG, getAbsoluteUrl } from '@/lib/seo/config';
import {
  Shield,
  Truck,
  RefreshCw,
  Award,
} from 'lucide-react';

// Enable ISR with 1 hour revalidation for better SEO performance
export const revalidate = REVALIDATION_TIMES.product;

// Generate static params for popular products
export async function generateStaticParams() {
  try {
    const products = await getProducts({ page: 0, size: 20, status: 'active' });
    return products.content.map((product) => ({
      slug: product.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Enhanced metadata generation for product pages
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found | Ayurveda Haven',
      description: 'The product you are looking for could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = product.seoTitle || `${product.name} - Premium Ayurvedic ${product.category || 'Product'}`;
  const description = product.seoDescription || product.shortDescription || product.description;
  const productUrl = getAbsoluteUrl(`/product/${slug}`);
  const image = product.images.length > 0 ? product.images[0].url : `${SITE_CONFIG.url}/og-image.jpg`;

  return {
    title,
    description,
    keywords: [
      product.name,
      product.category || '',
      product.brand || '',
      ...(product.tags || []),
      'ayurvedic',
      'natural',
      'organic',
      'herbal',
    ].filter(Boolean),
    openGraph: {
      type: 'product',
      url: productUrl,
      title,
      description,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 1200,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: SITE_CONFIG.twitterHandle,
      images: [image],
    },
    alternates: {
      canonical: productUrl,
    },
    robots: {
      index: product.status === 'active',
      follow: true,
      googleBot: {
        index: product.status === 'active',
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

async function ProductContent({ slug }: { slug: string }) {
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  // Generate breadcrumb items
  const breadcrumbItems: BreadcrumbItem[] = [
    { name: 'Shop', url: '/shop' },
  ];

  if (product.category) {
    breadcrumbItems.push({
      name: product.category,
      url: `/shop?category=${encodeURIComponent(product.category)}`,
    });
  }

  breadcrumbItems.push({
    name: product.name,
    url: `/product/${slug}`,
  });

  // Generate product structured data
  const productSchema = generateProductSchema({
    name: product.name,
    description: product.description,
    image: product.images.length > 0 ? product.images[0].url : undefined,
    sku: product.sku,
    brand: product.brand,
    price: product.price,
    currency: 'INR',
    availability: product.stockQuantity > 0 ? 'InStock' : 'OutOfStock',
    url: getAbsoluteUrl(`/product/${slug}`),
    rating: product.rating,
    reviewCount: product.reviewCount,
    category: product.category,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Product Structured Data */}
      <StructuredData data={productSchema} />

      <Navbar />

      <main className="container mx-auto px-4 py-8 mt-20">
        {/* SEO-Optimized Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} className="mb-8" />

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
              {product.images.length > 0 ? (
                <Image
                  src={product.images[0].url}
                  alt={product.images[0].altText || product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
              {product.isFeatured && (
                <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Featured
                </div>
              )}
              {discount > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {discount}% OFF
                </div>
              )}
              {!product.stockQuantity && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(0, 4).map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200"
                  >
                    <Image
                      src={img.url}
                      alt={img.altText || `${product.name} view ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info - Client Component */}
          <ProductClient product={product} discount={discount} />
        </div>

        {/* Trust Badges */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Free Shipping</p>
                <p className="text-xs text-gray-600">On orders above ₹999</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <RefreshCw className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Easy Returns</p>
                <p className="text-xs text-gray-600">30-day return policy</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">100% Authentic</p>
                <p className="text-xs text-gray-600">Certified products</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Quality Assured</p>
                <p className="text-xs text-gray-600">Lab tested</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Details</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">{product.description}</p>

            {product.brand && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900">Brand</h3>
                <p className="text-gray-700">{product.brand}</p>
              </div>
            )}

            {product.tags && product.tags.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
              <div>
                <p className="text-sm font-semibold text-gray-900">SKU</p>
                <p className="text-gray-700">{product.sku}</p>
              </div>
              {product.weightGrams && (
                <div>
                  <p className="text-sm font-semibold text-gray-900">Weight</p>
                  <p className="text-gray-700">{product.weightGrams}g</p>
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-gray-900">Stock Status</p>
                <p className={`font-medium ${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stockQuantity > 0 ? `In Stock (${product.stockQuantity})` : 'Out of Stock'}
                </p>
              </div>
              {product.lowStock && (
                <div>
                  <p className="text-sm font-semibold text-gray-900">Availability</p>
                  <p className="text-yellow-600 font-medium">Low Stock</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <ErrorBoundary>
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductContent slug={slug} />
      </Suspense>
    </ErrorBoundary>
  );
}
