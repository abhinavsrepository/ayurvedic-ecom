/**
 * Dynamic Sitemap Generation
 *
 * Generates a comprehensive sitemap for all pages, products, categories, and blog posts.
 * This file is automatically picked up by Next.js and served at /sitemap.xml
 */

import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/seo/config';
import { getProducts } from '@/app/actions/products';

// Static pages configuration
const STATIC_PAGES = [
  {
    url: '',
    changeFrequency: 'daily' as const,
    priority: 1.0,
    lastModified: new Date(),
  },
  {
    url: '/shop',
    changeFrequency: 'hourly' as const,
    priority: 0.9,
    lastModified: new Date(),
  },
  {
    url: '/blog',
    changeFrequency: 'daily' as const,
    priority: 0.8,
    lastModified: new Date(),
  },
  {
    url: '/contact',
    changeFrequency: 'monthly' as const,
    priority: 0.5,
    lastModified: new Date(),
  },
  {
    url: '/dosha-quiz',
    changeFrequency: 'weekly' as const,
    priority: 0.7,
    lastModified: new Date(),
  },
];

// Categories for sitemap
const CATEGORIES = [
  'Supplements',
  'Oils & Ghee',
  'Skincare',
  'Hair Care',
  'Tea & Herbs',
  'Wellness',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.url;

  try {
    // Fetch all active products from the API
    const productsResponse = await getProducts({ page: 0, size: 1000, status: 'active' });
    const products = productsResponse.content;

    // Generate product URLs
    const productUrls: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: product.isFeatured ? 0.8 : 0.6,
    }));

    // Generate category URLs
    const categoryUrls: MetadataRoute.Sitemap = CATEGORIES.map((category) => ({
      url: `${baseUrl}/shop?category=${encodeURIComponent(category)}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    }));

    // Generate static page URLs
    const staticUrls: MetadataRoute.Sitemap = STATIC_PAGES.map((page) => ({
      url: `${baseUrl}${page.url}`,
      lastModified: page.lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    }));

    // TODO: Add blog posts when blog API is available
    // const blogPosts = await getBlogPosts();
    // const blogUrls = blogPosts.map(post => ({
    //   url: `${baseUrl}/blog/${post.slug}`,
    //   lastModified: new Date(post.updatedAt),
    //   changeFrequency: 'weekly',
    //   priority: 0.7,
    // }));

    // Combine all URLs
    return [...staticUrls, ...categoryUrls, ...productUrls];
  } catch (error) {
    console.error('Error generating sitemap:', error);

    // Return at least static pages if product fetch fails
    return STATIC_PAGES.map((page) => ({
      url: `${baseUrl}${page.url}`,
      lastModified: page.lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    }));
  }
}
