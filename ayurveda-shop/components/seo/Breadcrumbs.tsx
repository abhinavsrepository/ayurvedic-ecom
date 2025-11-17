/**
 * Breadcrumbs Component with Schema.org Support
 *
 * Renders visual breadcrumbs with proper SEO markup and JSON-LD structured data.
 */

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import StructuredData from './StructuredData';
import { generateBreadcrumbList, type BreadcrumbItem } from '@/lib/seo/config';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Breadcrumbs Component
 *
 * Displays breadcrumb navigation with SEO-friendly markup and JSON-LD schema.
 *
 * @param items - Array of breadcrumb items with name and url
 * @param className - Optional CSS classes for styling
 *
 * @example
 * ```tsx
 * <Breadcrumbs
 *   items={[
 *     { name: 'Shop', url: '/shop' },
 *     { name: 'Category', url: '/shop/category' },
 *     { name: 'Product', url: '/product/slug' },
 *   ]}
 * />
 * ```
 */
export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  // Always include Home as the first item
  const allItems: BreadcrumbItem[] = [{ name: 'Home', url: '/' }, ...items];

  // Generate JSON-LD schema
  const breadcrumbSchema = generateBreadcrumbList(allItems);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <StructuredData data={breadcrumbSchema} />

      {/* Visual Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center space-x-2 text-sm ${className}`}
      >
        <ol className="flex items-center space-x-2" itemScope itemType="https://schema.org/BreadcrumbList">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1;
            const isHome = index === 0;

            return (
              <li
                key={item.url}
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
                className="flex items-center"
              >
                {index > 0 && (
                  <ChevronRight
                    className="w-4 h-4 mx-2 text-gray-400"
                    aria-hidden="true"
                  />
                )}

                {isLast ? (
                  <span
                    itemProp="name"
                    className="text-gray-900 font-medium"
                    aria-current="page"
                  >
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.url}
                    itemProp="item"
                    className="text-gray-600 hover:text-primary transition-colors flex items-center gap-1"
                  >
                    {isHome && <Home className="w-4 h-4" aria-hidden="true" />}
                    <span itemProp="name">{item.name}</span>
                  </Link>
                )}

                <meta itemProp="position" content={String(index + 1)} />
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

/**
 * Simple breadcrumb generator from URL path
 */
export function generateBreadcrumbsFromPath(pathname: string): BreadcrumbItem[] {
  const paths = pathname.split('/').filter(Boolean);

  return paths.map((path, index) => {
    const url = `/${paths.slice(0, index + 1).join('/')}`;
    const name = path
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return { name, url };
  });
}
