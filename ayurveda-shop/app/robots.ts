/**
 * Robots.txt Configuration
 *
 * Defines which pages search engines can and cannot crawl.
 * This file is automatically picked up by Next.js and served at /robots.txt
 */

import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/seo/config';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE_CONFIG.url;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/api/*',
          '/cart',
          '/checkout',
          '/order-success',
          '/_next/*',
          '/test-*',
          '/*.json$',
          '/*?*sort=*',
          '/*?*page=*',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin', '/admin/*', '/api/*', '/cart', '/checkout'],
        crawlDelay: 0,
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
        disallow: ['/admin', '/admin/*'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/admin', '/admin/*', '/api/*', '/cart', '/checkout'],
        crawlDelay: 1,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
