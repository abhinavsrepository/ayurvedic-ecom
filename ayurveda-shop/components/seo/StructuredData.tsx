/**
 * Structured Data (JSON-LD) Component
 *
 * This component renders JSON-LD structured data for SEO.
 * It supports various schema types including Product, Article, Organization, etc.
 */

import Script from 'next/script';

interface StructuredDataProps {
  data: Record<string, any> | Record<string, any>[];
}

/**
 * StructuredData Component
 *
 * Renders JSON-LD structured data in a Next.js Script component
 * for optimal performance and SEO.
 *
 * @param data - The structured data object(s) to render
 *
 * @example
 * ```tsx
 * <StructuredData data={productSchema} />
 * ```
 */
export default function StructuredData({ data }: StructuredDataProps) {
  return (
    <Script
      id={`structured-data-${typeof data === 'object' && !Array.isArray(data) && data['@type'] ? data['@type'] : 'json-ld'}`}
      type="application/ld+json"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 0),
      }}
    />
  );
}

/**
 * Product Schema Generator
 */
export function generateProductSchema({
  name,
  description,
  image,
  sku,
  brand,
  price,
  currency = 'INR',
  availability,
  url,
  rating,
  reviewCount,
  category,
}: {
  name: string;
  description: string;
  image?: string;
  sku: string;
  brand?: string;
  price: number;
  currency?: string;
  availability: 'InStock' | 'OutOfStock' | 'PreOrder';
  url: string;
  rating?: number;
  reviewCount?: number;
  category?: string;
}) {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    sku,
    url,
    category,
    offers: {
      '@type': 'Offer',
      price: price.toString(),
      priceCurrency: currency,
      availability: `https://schema.org/${availability}`,
      url,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
    },
  };

  if (image) {
    schema.image = Array.isArray(image) ? image : [image];
  }

  if (brand) {
    schema.brand = {
      '@type': 'Brand',
      name: brand,
    };
  }

  if (rating && reviewCount) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: rating.toString(),
      reviewCount: reviewCount.toString(),
      bestRating: '5',
      worstRating: '1',
    };
  }

  return schema;
}

/**
 * Article/Blog Schema Generator
 */
export function generateArticleSchema({
  title,
  description,
  image,
  datePublished,
  dateModified,
  author,
  url,
  publisherName = 'Ayurveda Haven',
  publisherLogo = '/logo.png',
}: {
  title: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  url: string;
  publisherName?: string;
  publisherLogo?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: image ? [image] : [],
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: publisherName,
      logo: {
        '@type': 'ImageObject',
        url: publisherLogo,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}

/**
 * Review Schema Generator
 */
export function generateReviewSchema({
  productName,
  reviewBody,
  rating,
  author,
  datePublished,
}: {
  productName: string;
  reviewBody: string;
  rating: number;
  author: string;
  datePublished: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'Product',
      name: productName,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: rating.toString(),
      bestRating: '5',
      worstRating: '1',
    },
    reviewBody,
    author: {
      '@type': 'Person',
      name: author,
    },
    datePublished,
  };
}

/**
 * Video Schema Generator
 */
export function generateVideoSchema({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  duration,
  contentUrl,
}: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration?: string; // ISO 8601 format, e.g., "PT1M30S" for 1 minute 30 seconds
  contentUrl?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name,
    description,
    thumbnailUrl,
    uploadDate,
    duration,
    contentUrl,
  };
}

/**
 * HowTo Schema Generator
 */
export function generateHowToSchema({
  name,
  description,
  image,
  totalTime,
  steps,
}: {
  name: string;
  description: string;
  image?: string;
  totalTime?: string; // ISO 8601 format, e.g., "PT30M" for 30 minutes
  steps: Array<{
    name: string;
    text: string;
    image?: string;
  }>;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    image: image ? [image] : [],
    totalTime,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      image: step.image,
    })),
  };
}

/**
 * Multiple Structured Data Component
 *
 * Use this when you need to render multiple schemas on a single page
 */
export function MultipleStructuredData({ schemas }: { schemas: Record<string, any>[] }) {
  return (
    <>
      {schemas.map((schema, index) => (
        <StructuredData key={index} data={schema} />
      ))}
    </>
  );
}
