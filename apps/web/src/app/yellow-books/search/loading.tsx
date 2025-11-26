import { Search } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-5 w-48 bg-gray-100 rounded mb-4 animate-pulse"></div>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-yellow-200 rounded animate-pulse"></div>
            <div className="flex-1">
              <div className="h-9 w-64 bg-gray-200 rounded mb-2 animate-pulse"></div>
              <div className="h-6 w-96 bg-gray-100 rounded animate-pulse"></div>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1 h-12 bg-gray-100 rounded-lg animate-pulse"></div>
            <div className="h-12 w-32 bg-yellow-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results count skeleton */}
        <div className="bg-white px-6 py-4 rounded-lg border border-gray-200 mb-6 animate-pulse">
          <div className="h-6 w-48 bg-gray-200 rounded"></div>
        </div>

        {/* Map skeleton */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
          <div className="h-6 w-64 bg-gray-200 rounded mb-4 animate-pulse"></div>
          <div className="w-full h-[500px] bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center border-2 border-blue-200">
            <div className="text-center">
              <Search className="w-16 h-16 text-blue-300 mx-auto mb-4 animate-pulse" />
              <p className="text-blue-400 text-lg font-medium">Газрын зураг уншиж байна...</p>
              <p className="text-blue-300 text-sm mt-2">Бизнесүүдийг байршлаар нь харуулж байна</p>
            </div>
          </div>
        </div>

        {/* Results grid skeleton */}
        <div>
          <div className="h-8 w-32 bg-gray-200 rounded mb-4 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2 mb-3">
                  <div className="h-4 bg-gray-100 rounded"></div>
                  <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                </div>
                <div className="h-3 bg-gray-100 rounded w-4/5"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Loading indicator */}
        <div className="mt-8 flex items-center justify-center">
          <div className="flex items-center gap-3 text-purple-600">
            <Search className="w-6 h-6 animate-bounce" />
            <span className="text-lg font-medium">Хайлтын үр дүнг боловсруулж байна...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
