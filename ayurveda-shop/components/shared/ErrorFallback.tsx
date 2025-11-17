'use client';

import { AlertTriangle, Home } from 'lucide-react';
import Link from 'next/link';

interface ErrorFallbackProps {
  error?: Error | string;
  reset?: () => void;
  showHomeButton?: boolean;
}

export default function ErrorFallback({
  error,
  reset,
  showHomeButton = true,
}: ErrorFallbackProps) {
  const errorMessage = typeof error === 'string' ? error : error?.message || 'Something went wrong';

  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-8 max-w-md w-full">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/50 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h2 className="text-xl font-semibold text-yellow-900 dark:text-yellow-300 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-yellow-700 dark:text-yellow-400 mb-6">{errorMessage}</p>
          <div className="flex gap-3">
            {reset && (
              <button
                onClick={reset}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
              >
                Try Again
              </button>
            )}
            {showHomeButton && (
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                Go Home
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
