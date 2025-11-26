import { Sparkles, Store } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <div className="h-10 w-72 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
              <div className="h-6 w-96 bg-gray-100 rounded animate-pulse"></div>
            </div>
            <div className="h-12 w-48 bg-yellow-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="flex gap-4">
            <div className="h-5 w-32 bg-gray-100 rounded animate-pulse"></div>
            <div className="h-5 w-32 bg-gray-100 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title */}
        <div className="h-8 w-48 bg-gray-200 rounded mb-6 animate-pulse"></div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-100 rounded"></div>
                <div className="h-4 bg-gray-100 rounded w-5/6"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-100 rounded w-4/5"></div>
                <div className="h-3 bg-gray-100 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Section Loading */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-8 border border-yellow-200">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
            <div className="h-8 w-56 bg-yellow-200 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-lg border border-yellow-300 p-6 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 bg-yellow-100 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-5 bg-yellow-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-100 rounded"></div>
                  <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Animated loading indicator */}
        <div className="mt-8 flex items-center justify-center">
          <div className="flex items-center gap-3 text-yellow-600">
            <Store className="w-6 h-6 animate-bounce" />
            <span className="text-lg font-medium">Бизнесүүдийг уншиж байна...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
