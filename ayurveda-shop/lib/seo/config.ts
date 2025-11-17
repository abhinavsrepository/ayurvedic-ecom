/**
 * Enterprise SEO Configuration
 *
 * This file contains all SEO-related configuration for the Ayurveda e-commerce platform.
 * It provides centralized metadata, structured data templates, and SEO utilities.
 */

import { Metadata } from 'next';

// ========================================
// SITE CONFIGURATION
// ========================================

export const SITE_CONFIG = {
  name: 'Ayurveda Haven',
  title: 'Ayurveda Haven - Pure Herbal & Natural Wellness Products',
  description: 'Discover the healing power of Ayurveda. Premium herbal supplements, natural oils, and wellness products for holistic health. 100% organic, cruelty-free, and sustainably sourced.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://ayurvedahaven.com',
  ogImage: '/og-image.jpg',
  twitterHandle: '@AyurvedaHaven',
  twitterCard: 'summary_large_image' as const,
  locale: 'en_US',
  type: 'website' as const,
  keywords: [
    'ayurveda',
    'herbal products',
    'natural wellness',
    'organic supplements',
    'ayurvedic medicine',
    'herbal oils',
    'holistic health',
    'natural remedies',
    'ayurvedic skincare',
    'organic wellness',
  ],
  author: 'Ayurveda Haven',
  email: 'info@ayurvedahaven.com',
  phone: '+91 123 456 7890',
  address: {
    streetAddress: '123 Wellness Street',
    addressLocality: 'Mumbai',
    addressRegion: 'MH',
    postalCode: '400001',
    addressCountry: 'IN',
  },
  social: {
    facebook: 'https://facebook.com/ayurvedahaven',
    instagram: 'https://instagram.com/ayurvedahaven',
    twitter: 'https://twitter.com/ayurvedahaven',
    youtube: 'https://youtube.com/@ayurvedahaven',
    linkedin: 'https://linkedin.com/company/ayurvedahaven',
  },
  foundingDate: '2020-01-01',
  priceRange: '₹₹',
  aggregateRating: {
    ratingValue: 4.8,
    reviewCount: 2847,
    bestRating: 5,
    worstRating: 1,
  },
};

// ========================================
// DEFAULT METADATA
// ========================================

export const DEFAULT_METADATA: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: SITE_CONFIG.title,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.keywords,
  authors: [{ name: SITE_CONFIG.author, url: SITE_CONFIG.url }],
  creator: SITE_CONFIG.author,
  publisher: SITE_CONFIG.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: SITE_CONFIG.locale,
    url: SITE_CONFIG.url,
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.name,
      },
    ],
  },
  twitter: {
    card: SITE_CONFIG.twitterCard,
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    site: SITE_CONFIG.twitterHandle,
    creator: SITE_CONFIG.twitterHandle,
    images: [SITE_CONFIG.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    bing: process.env.NEXT_PUBLIC_BING_VERIFICATION,
  },
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  category: 'Health & Wellness',
};

// ========================================
// PAGE-SPECIFIC METADATA GENERATORS
// ========================================

export function generatePageMetadata({
  title,
  description,
  path = '',
  keywords = [],
  ogImage,
  noIndex = false,
  type = 'website',
}: {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  ogImage?: string;
  noIndex?: boolean;
  type?: 'website' | 'article' | 'product';
}): Metadata {
  const url = `${SITE_CONFIG.url}${path}`;
  const image = ogImage || SITE_CONFIG.ogImage;

  return {
    title,
    description,
    keywords: [...SITE_CONFIG.keywords, ...keywords],
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: SITE_CONFIG.twitterHandle,
      creator: SITE_CONFIG.twitterHandle,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export function generateProductMetadata({
  name,
  description,
  slug,
  price,
  image,
  category,
  brand,
  rating,
  reviewCount,
  inStock,
  seoTitle,
  seoDescription,
}: {
  name: string;
  description: string;
  slug: string;
  price: number;
  image?: string;
  category?: string;
  brand?: string;
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
  seoTitle?: string;
  seoDescription?: string;
}): Metadata {
  const title = seoTitle || `${name} - ${category || 'Ayurvedic Products'}`;
  const desc = seoDescription || description;
  const url = `${SITE_CONFIG.url}/product/${slug}`;

  return {
    title,
    description: desc,
    keywords: [
      name,
      category || '',
      brand || '',
      'ayurvedic',
      'natural',
      'organic',
      'herbal',
    ].filter(Boolean),
    openGraph: {
      type: 'product' as any,
      url,
      title,
      description: desc,
      siteName: SITE_CONFIG.name,
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 1200,
              alt: name,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      site: SITE_CONFIG.twitterHandle,
      creator: SITE_CONFIG.twitterHandle,
      images: image ? [image] : [],
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export function generateBlogMetadata({
  title,
  description,
  slug,
  image,
  publishedTime,
  modifiedTime,
  author,
  tags = [],
}: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
}): Metadata {
  const url = `${SITE_CONFIG.url}/blog/${slug}`;

  return {
    title,
    description,
    keywords: [...SITE_CONFIG.keywords, ...tags],
    authors: author ? [{ name: author }] : [{ name: SITE_CONFIG.author }],
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      siteName: SITE_CONFIG.name,
      publishedTime,
      modifiedTime,
      authors: author ? [author] : [SITE_CONFIG.author],
      tags,
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: SITE_CONFIG.twitterHandle,
      creator: SITE_CONFIG.twitterHandle,
      images: image ? [image] : [],
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// ========================================
// BREADCRUMB UTILITIES
// ========================================

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbList(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_CONFIG.url}${item.url}`,
    })),
  };
}

// ========================================
// FAQ SCHEMA UTILITIES
// ========================================

export interface FAQItem {
  question: string;
  answer: string;
}

export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// ========================================
// ORGANIZATION SCHEMA
// ========================================

export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_CONFIG.url}/#organization`,
  name: SITE_CONFIG.name,
  url: SITE_CONFIG.url,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_CONFIG.url}/logo.png`,
    width: 512,
    height: 512,
  },
  image: {
    '@type': 'ImageObject',
    url: SITE_CONFIG.ogImage,
  },
  description: SITE_CONFIG.description,
  email: SITE_CONFIG.email,
  telephone: SITE_CONFIG.phone,
  address: {
    '@type': 'PostalAddress',
    ...SITE_CONFIG.address,
  },
  sameAs: Object.values(SITE_CONFIG.social),
  foundingDate: SITE_CONFIG.foundingDate,
  aggregateRating: {
    '@type': 'AggregateRating',
    ...SITE_CONFIG.aggregateRating,
  },
};

// ========================================
// LOCAL BUSINESS SCHEMA
// ========================================

export const LOCAL_BUSINESS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  '@id': `${SITE_CONFIG.url}/#localbusiness`,
  name: SITE_CONFIG.name,
  image: SITE_CONFIG.ogImage,
  url: SITE_CONFIG.url,
  telephone: SITE_CONFIG.phone,
  email: SITE_CONFIG.email,
  priceRange: SITE_CONFIG.priceRange,
  address: {
    '@type': 'PostalAddress',
    ...SITE_CONFIG.address,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '09:00',
      closes: '14:00',
    },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ...SITE_CONFIG.aggregateRating,
  },
  sameAs: Object.values(SITE_CONFIG.social),
};

// ========================================
// WEBSITE SCHEMA
// ========================================

export const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_CONFIG.url}/#website`,
  url: SITE_CONFIG.url,
  name: SITE_CONFIG.name,
  description: SITE_CONFIG.description,
  publisher: {
    '@id': `${SITE_CONFIG.url}/#organization`,
  },
  potentialAction: [
    {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_CONFIG.url}/shop?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  ],
};

// ========================================
// REVALIDATION SETTINGS
// ========================================

export const REVALIDATION_TIMES = {
  // Static pages - revalidate daily
  static: 86400, // 24 hours

  // Homepage - revalidate every 30 minutes
  homepage: 1800, // 30 minutes

  // Product pages - revalidate every hour
  product: 3600, // 1 hour

  // Category/Shop pages - revalidate every 30 minutes
  category: 1800, // 30 minutes

  // Blog posts - revalidate every 6 hours
  blog: 21600, // 6 hours

  // Blog listing - revalidate every hour
  blogList: 3600, // 1 hour
};

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Clean and truncate text for SEO descriptions
 */
export function truncateDescription(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) return text;

  const truncated = text.substring(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(' ');

  return truncated.substring(0, lastSpace) + '...';
}

/**
 * Generate structured data JSON-LD script tag
 */
export function jsonLdScriptProps<T extends Record<string, any>>(data: T) {
  return {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: { __html: JSON.stringify(data) },
  };
}

/**
 * Get absolute URL from path
 */
export function getAbsoluteUrl(path: string): string {
  return `${SITE_CONFIG.url}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Generate image URL for OG/Twitter
 */
export function getOgImageUrl(path?: string): string {
  if (!path) return `${SITE_CONFIG.url}${SITE_CONFIG.ogImage}`;

  // If it's already an absolute URL, return it
  if (path.startsWith('http')) return path;

  // Otherwise, make it absolute
  return `${SITE_CONFIG.url}${path.startsWith('/') ? path : `/${path}`}`;
}
