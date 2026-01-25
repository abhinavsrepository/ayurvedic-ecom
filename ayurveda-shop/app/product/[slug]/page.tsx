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
import StructuredData, { generateProductSchema, generateFAQSchema, MultipleStructuredData } from '@/components/seo/StructuredData';
import { REVALIDATION_TIMES, SITE_CONFIG, getAbsoluteUrl } from '@/lib/seo/config';
import {
  Shield,
  Truck,
  RefreshCw,
  Award,
  Leaf,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

// Enable ISR with 1 hour revalidation for better SEO performance
export const revalidate = 3600; // 1 hour

// FAQ Item Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group border border-gray-200 rounded-lg overflow-hidden">
      <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
        <h3 className="font-semibold text-gray-900 pr-4">{question}</h3>
        <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0 group-open:rotate-180 transition-transform" />
      </summary>
      <div className="p-4 bg-white">
        <p className="text-gray-700 leading-relaxed">{answer}</p>
      </div>
    </details>
  );
}

// Generate static params for popular products
export async function generateStaticParams() {
  try {
    const products = await getProducts({ page: 0, size: 20, status: 'ACTIVE' });
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
      type: 'website',
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
    description: product.shortDescription || product.description?.substring(0, 200) || '',
    image: product.images.length > 0 ? product.images[0].url : undefined,
    sku: product.sku,
    brand: product.brand || 'Ayurveda Haven',
    price: product.price,
    currency: 'INR',
    availability: product.stockQuantity > 0 ? 'InStock' : 'OutOfStock',
    url: getAbsoluteUrl(`/product/${slug}`),
    rating: product.rating,
    reviewCount: product.reviewCount,
    category: product.category,
  });

  // Generate FAQ structured data for SEO
  const faqSchema = generateFAQSchema([
    {
      question: `Is ${product.name} safe for daily use?`,
      answer: `Yes, ${product.name} is made with 100% natural Ayurvedic ingredients and is safe for regular use as directed. However, we recommend performing a patch test before first use and consulting with a healthcare professional if you have any specific health conditions or are taking medications.`,
    },
    {
      question: 'What is the shelf life of this product?',
      answer: (product as any).shelfLife 
        ? `The shelf life of ${product.name} is ${(product as any).shelfLife}. Store in a cool, dry place away from direct sunlight for maximum effectiveness.`
        : `Our Ayurvedic products typically have a shelf life of 24-36 months from the date of manufacture. Check the packaging for the exact expiry date.`,
    },
    {
      question: 'How long will it take to see results?',
      answer: 'Ayurvedic remedies work holistically with your body\'s natural processes. While some people notice improvements within 2-4 weeks, we recommend using the product consistently for at least 2-3 months for optimal results.',
    },
    {
      question: 'Can I use this product with other medications?',
      answer: 'While our products are made from natural ingredients, we recommend consulting with your healthcare provider before combining with any prescription medications.',
    },
    {
      question: 'Is this product vegan and cruelty-free?',
      answer: `${product.name} is made with plant-based Ayurvedic ingredients. Check our certifications for specific vegan and cruelty-free status.`,
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Product and FAQ Structured Data for SEO */}
      <MultipleStructuredData schemas={[productSchema, faqSchema]} />

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
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Details</h2>
          <div className="prose max-w-none">
            {/* Long Description with proper formatting */}
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {product.description}
            </div>

            {product.brand && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900">Brand</h3>
                <p className="text-gray-700">{product.brand}</p>
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
              {(product as any).shelfLife && (
                <div>
                  <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                    <Clock className="w-4 h-4" /> Shelf Life
                  </p>
                  <p className="text-gray-700">{(product as any).shelfLife}</p>
                </div>
              )}
              {(product as any).madeIn && (
                <div>
                  <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> Made In
                  </p>
                  <p className="text-gray-700">{(product as any).madeIn}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        {product.benefits && product.benefits.length > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <CheckCircle className="w-7 h-7 text-green-600" />
              Key Benefits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-white/70 rounded-lg p-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-gray-700 font-medium">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ingredients Section */}
        {product.ingredients && product.ingredients.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Leaf className="w-7 h-7 text-green-600" />
              Natural Ingredients
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {product.ingredients.map((ingredient, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-green-50 rounded-lg px-4 py-3"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-gray-700 text-sm">{ingredient}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* How to Use Section */}
        {product.usage && (
          <div className="bg-amber-50 rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <RefreshCw className="w-7 h-7 text-amber-600" />
              How to Use
            </h2>
            <div className="bg-white/70 rounded-xl p-6">
              <p className="text-gray-700 leading-relaxed">{product.usage}</p>
            </div>
          </div>
        )}

        {/* Warnings Section */}
        {(product as any).warnings && (
          <div className="bg-red-50 rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <AlertTriangle className="w-7 h-7 text-red-500" />
              Important Information
            </h2>
            <div className="bg-white/70 rounded-xl p-6 border-l-4 border-red-400">
              <p className="text-gray-700 leading-relaxed">{(product as any).warnings}</p>
            </div>
          </div>
        )}

        {/* Certifications Section */}
        {(product as any).certifications && (product as any).certifications.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Award className="w-7 h-7 text-blue-600" />
              Quality Certifications
            </h2>
            <div className="flex flex-wrap gap-3">
              {(product as any).certifications.map((cert: string, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2"
                >
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-800 font-medium text-sm">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags/Keywords */}
        {product.tags && product.tags.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Topics</h2>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-full hover:bg-green-100 hover:text-green-800 transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <FAQItem
              question={`Is ${product.name} safe for daily use?`}
              answer={`Yes, ${product.name} is made with 100% natural Ayurvedic ingredients and is safe for regular use as directed. However, we recommend performing a patch test before first use and consulting with a healthcare professional if you have any specific health conditions or are taking medications.`}
            />
            <FAQItem
              question="What is the shelf life of this product?"
              answer={(product as any).shelfLife 
                ? `The shelf life of ${product.name} is ${(product as any).shelfLife}. Store in a cool, dry place away from direct sunlight for maximum effectiveness.`
                : `Our Ayurvedic products typically have a shelf life of 24-36 months from the date of manufacture. Check the packaging for the exact expiry date. Store in a cool, dry place away from direct sunlight.`
              }
            />
            <FAQItem
              question="How long will it take to see results?"
              answer="Ayurvedic remedies work holistically with your body's natural processes. While some people notice improvements within 2-4 weeks, we recommend using the product consistently for at least 2-3 months for optimal results. Individual results may vary based on body constitution (dosha) and lifestyle factors."
            />
            <FAQItem
              question="Can I use this product with other medications?"
              answer="While our products are made from natural ingredients, we recommend consulting with your healthcare provider before combining with any prescription medications, especially for conditions like diabetes, blood pressure, or if you are pregnant or nursing."
            />
            <FAQItem
              question="Is this product vegan and cruelty-free?"
              answer={`${product.name} is made with plant-based Ayurvedic ingredients. ${(product as any).certifications?.includes('100% Vegan') || (product as any).certifications?.includes('Cruelty-Free') ? 'This product is certified vegan and cruelty-free.' : 'Please check the certifications section above for specific details about this product.'}`}
            />
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
