import { Metadata } from 'next';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/shared/Hero";
import ProductGrid from "@/components/shared/ProductGrid";
import Testimonials from "@/components/shared/Testimonials";
import WisdomSection from "@/components/shared/WisdomSection";
import BeforeAfter from "@/components/shared/BeforeAfter";
import VideoTestimonials from "@/components/shared/VideoTestimonials";
import BannerDisplay from "@/components/frontend/BannerDisplay";
import { testimonials, wisdomPosts, beforeAfterData, videoTestimonials } from "@/lib/data/products";
import type { Product } from "@/components/product/ProductCard";
import { generatePageMetadata, REVALIDATION_TIMES, SITE_CONFIG } from '@/lib/seo/config';
import StructuredData, { generateArticleSchema, generateReviewSchema, generateVideoSchema } from '@/components/seo/StructuredData';
import { Suspense } from 'react';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

const mapBackendProduct = (backendProduct: any): Product => ({
  id: backendProduct.id,
  name: backendProduct.name,
  slug: backendProduct.slug,
  description: backendProduct.short_description || backendProduct.description || '',
  shortDescription: backendProduct.short_description || undefined,
  longDescription: backendProduct.description || undefined,
  price: Number(backendProduct.price),
  originalPrice: backendProduct.compare_at_price
    ? Number(backendProduct.compare_at_price)
    : undefined,
  image:
    backendProduct.image ||
    backendProduct.product_images?.[0]?.url ||
    'https://via.placeholder.com/400?text=Product',
  category: backendProduct.category || 'Uncategorized',
  inStock: backendProduct.status === 'ACTIVE',
  rating: backendProduct.rating || 0,
  reviewCount: backendProduct.review_count || 0,
  benefits: Array.isArray(backendProduct.benefits)
    ? backendProduct.benefits
    : [],
});

async function getHomepageProducts(): Promise<Product[]> {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/products?status=ACTIVE&size=8`,
      {
        next: { revalidate: 1800, tags: ['homepage-products'] },
      },
    );

    if (!response.ok) {
      throw new Error(`Products API returned ${response.status}`);
    }

    const payload = await response.json();
    const content = Array.isArray(payload?.content)
      ? payload.content
      : Array.isArray(payload)
        ? payload
        : [];
    return content.map(mapBackendProduct);
  } catch (error) {
    console.error('Failed to fetch homepage products:', error);
    return [];
  }
}

// Enable ISR - revalidate homepage every 30 minutes
export const revalidate = 1800; // 30 minutes

// Enhanced homepage metadata
export const metadata: Metadata = generatePageMetadata({
  title: 'Ayurveda Haven - Pure Herbal & Natural Wellness Products',
  description: 'Discover the healing power of Ayurveda. Premium herbal supplements, natural oils, and wellness products for holistic health. 100% organic, cruelty-free, and sustainably sourced. Free shipping on orders above ₹999.',
  path: '/',
  keywords: [
    'ayurvedic products',
    'herbal supplements',
    'natural wellness',
    'organic ayurveda',
    'ayurvedic oils',
    'natural skincare',
    'herbal remedies',
    'holistic health',
    'dosha balance',
    'ayurvedic medicine',
  ],
});

  // Generate FAQ schema for homepage
  const homepageFAQ = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Ayurveda?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ayurveda is an ancient Indian system of natural and holistic medicine. It uses natural herbs, oils, and lifestyle practices to promote health and wellness.',
        },
      },
      {
        '@type': 'Question',
        name: 'Are your products 100% natural?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, all our products are 100% natural, organic, and cruelty-free. We source our ingredients from trusted farms and use traditional Ayurvedic formulations.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you offer free shipping?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, we offer free shipping on all orders above ₹999. Orders below this amount have a nominal shipping fee.',
        },
      },
      {
        '@type': 'Question',
        name: 'How long does delivery take?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Typically, orders are delivered within 3-7 business days depending on your location. We use trusted courier partners to ensure safe delivery.',
        },
      },
  ],
  };

  // Generate review schemas for testimonials (helps with rich snippets)
  const reviewSchemas = testimonials.map(testimonial => 
    generateReviewSchema({
      productName: SITE_CONFIG.name,
      reviewBody: testimonial.text,
      rating: testimonial.rating,
      author: testimonial.name,
      datePublished: new Date().toISOString(),
    })
  );

  // Generate aggregate rating for overall website reviews
  const aggregateRating = {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    ratingValue: ((testimonials.reduce((sum, t) => sum + t.rating, 0)) / testimonials.length).toFixed(1),
    reviewCount: testimonials.length,
    bestRating: '5',
    worstRating: '1',
    itemReviewed: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
    },
  };

  // Generate video schemas for video testimonials (helps with video search results)
  const videoSchemas = videoTestimonials.map(video =>
    generateVideoSchema({
      name: video.caption,
      description: `Customer testimonial by ${video.customerName} about Ayurveda Haven products`,
      thumbnailUrl: video.thumbnail,
      uploadDate: new Date().toISOString(),
      duration: 'PT2M',
      contentUrl: video.videoUrl,
    })
  );

export default async function Home() {
  const homepageProducts = await getHomepageProducts();

  return (
    <div className="min-h-screen">
      {/* FAQ, Review, Aggregate Rating, and Video Structured Data */}
      <StructuredData data={homepageFAQ} />
      <Suspense fallback={null}>
        {reviewSchemas.map((schema, index) => (
          <StructuredData key={index} data={schema} />
        ))}
        {videoSchemas.map((schema, index) => (
          <StructuredData key={`video-${index}`} data={schema} />
        ))}
      </Suspense>
      <StructuredData data={aggregateRating} />

      <Navbar />

      <main id="main-content">
        {/* Hero Section */}
        <Hero />

        {/* Featured Products */}
        <ProductGrid
          products={homepageProducts}
          title="Featured Products"
          subtitle="Discover our bestselling Ayurvedic treasures crafted with care"
        />

        {/* Before/After Transformation - Acne Improvement */}
        <BeforeAfter
          beforeImage="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=1200&q=80"
          afterImage="https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1200&q=80"
          beforeLabel="Before Treatment"
          afterLabel="After 30 Days"
          title="Real Results: Acne & Skin Improvement"
          subtitle="See how our natural Ayurvedic products help achieve clear, radiant skin. Results from consistent use of Neem Face Pack and Turmeric treatments."
        />

        {/* Video Testimonials */}
        <VideoTestimonials
          videos={videoTestimonials}
          title="What People Say About Our Products!"
          subtitle="Real customers sharing their authentic Ayurvedic journey"
        />

        {/* Benefits Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
                Why Choose Ayurveda Haven?
              </h2>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                Your trusted partner in holistic wellness
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: "🌿",
                  title: "100% Natural",
                  description: "Pure herbal ingredients sourced from trusted farms"
                },
                {
                  icon: "✓",
                  title: "Certified Organic",
                  description: "Third-party tested and certified for purity"
                },
                {
                  icon: "🧘",
                  title: "Traditional Recipes",
                  description: "Time-tested Ayurvedic formulations"
                },
                {
                  icon: "🌍",
                  title: "Sustainable",
                  description: "Eco-friendly packaging and ethical sourcing"
                }
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="text-center p-8 bg-secondary rounded-2xl hover:shadow-lg transition-shadow"
                  role="article"
                  aria-labelledby={`benefit-${index}`}
                >
                  <div className="text-5xl mb-4" role="img" aria-label={benefit.title}>{benefit.icon}</div>
                  <h3 id={`benefit-${index}`} className="text-xl font-semibold text-foreground mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-text-secondary">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Middle Banner */}
        <section className="my-12 px-4">
          <BannerDisplay position="middle" autoPlay={true} interval={6000} />
        </section>

        {/* Ayurvedic Wisdom Blog */}
        <WisdomSection posts={wisdomPosts} />

        {/* Testimonials */}
        <Testimonials testimonials={testimonials} />

        {/* Footer Banner */}
        <section className="my-12 px-4">
          <BannerDisplay position="footer" autoPlay={false} />
        </section>

        {/* Popup Banner */}
        <BannerDisplay position="popup" />
      </main>

      <Footer />
    </div>
  );
}
