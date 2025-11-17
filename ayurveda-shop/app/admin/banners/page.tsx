'use client';

import { Image } from 'lucide-react';

export default function BannersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Banner Management</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Create and manage promotional banners
        </p>
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mb-4">
            <Image className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-2">
            Banner Management Coming Soon
          </h2>
          <p className="text-blue-700 dark:text-blue-400 max-w-md">
            Banner management is not yet implemented in the backend. This feature will allow you to create, schedule, and manage promotional banners across your site.
          </p>
        </div>
      </div>

      {/* Feature Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['Active Banners', 'Scheduled Banners', 'Banner Performance'].map((metric) => (
          <div key={metric} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 opacity-50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">{metric}</p>
              <Image className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-400">--</p>
            <p className="text-xs text-gray-500 mt-1">Coming soon</p>
          </div>
        ))}
      </div>
    </div>
  );
}
