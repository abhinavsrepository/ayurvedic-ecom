'use client';

import { AlertCircle, Smartphone } from 'lucide-react';

export default function DeviceAnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Device Analytics</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Track user sessions and conversions by device type
        </p>
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mb-4">
            <Smartphone className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-2">
            Device Analytics Coming Soon
          </h2>
          <p className="text-blue-700 dark:text-blue-400 max-w-md">
            Device analytics tracking is not yet implemented in the backend. This feature will provide insights into mobile, desktop, and tablet usage patterns.
          </p>
        </div>
      </div>

      {/* Feature Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 opacity-50">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Mobile Sessions</p>
            <Smartphone className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-400">--</p>
          <p className="text-xs text-gray-500 mt-1">Coming soon</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 opacity-50">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Desktop Sessions</p>
            <Smartphone className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-400">--</p>
          <p className="text-xs text-gray-500 mt-1">Coming soon</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 opacity-50">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Tablet Sessions</p>
            <Smartphone className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-400">--</p>
          <p className="text-xs text-gray-500 mt-1">Coming soon</p>
        </div>
      </div>
    </div>
  );
}
