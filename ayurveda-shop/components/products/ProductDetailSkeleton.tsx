export default function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery Skeleton */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg w-full" />
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-md"
              />
            ))}
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div className="space-y-6">
          {/* Breadcrumb */}
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48" />

          {/* Title */}
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />

          {/* Price */}
          <div className="flex items-center gap-4">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24" />
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
          </div>

          {/* Quantity Selector */}
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-32" />

          {/* Add to Cart Button */}
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-full" />

          {/* Additional Info */}
          <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-36" />
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="mt-16 space-y-6">
        <div className="flex gap-8 border-b border-gray-200 dark:border-gray-700">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24" />
          ))}
        </div>

        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}
