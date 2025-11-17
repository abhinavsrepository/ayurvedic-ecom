export default function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse"
        >
          {/* Image skeleton */}
          <div className="w-full h-64 bg-gray-200 dark:bg-gray-700" />

          <div className="p-4 space-y-3">
            {/* Title skeleton */}
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />

            {/* Description skeleton */}
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
            </div>

            {/* Price skeleton */}
            <div className="flex items-center justify-between pt-2">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20" />
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
