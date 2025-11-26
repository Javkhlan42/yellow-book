import { Building2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="h-5 w-48 bg-gray-100 rounded mb-4 animate-pulse"></div>
          
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex items-start space-x-4">
              <div className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="flex-1 space-y-3">
                <div className="h-9 w-96 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex gap-3">
                  <div className="h-6 w-24 bg-gray-100 rounded-full animate-pulse"></div>
                  <div className="h-6 w-24 bg-yellow-100 rounded-full animate-pulse"></div>
                </div>
                <div className="h-6 w-full max-w-lg bg-gray-100 rounded animate-pulse"></div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="h-10 w-32 bg-yellow-200 rounded-lg animate-pulse"></div>
              <div className="h-10 w-32 bg-gray-100 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="h-6 w-32 bg-gray-200 rounded mb-4 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-100 rounded w-5/6 animate-pulse"></div>
              </div>
            </div>

            {/* Services Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="h-6 w-32 bg-gray-200 rounded mb-4 animate-pulse"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-12 bg-gray-50 rounded-lg animate-pulse"></div>
                ))}
              </div>
            </div>

            {/* Map Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="h-6 w-32 bg-gray-200 rounded mb-4 animate-pulse"></div>
              <div className="w-full h-[400px] bg-gray-100 rounded-lg animate-pulse mb-4"></div>
              <div className="h-4 w-full bg-gray-100 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="h-6 w-40 bg-gray-200 rounded mb-4 animate-pulse"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-5 bg-gray-100 rounded animate-pulse"></div>
                ))}
              </div>
            </div>

            {/* Hours Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="h-6 w-32 bg-gray-200 rounded mb-4 animate-pulse"></div>
              <div className="h-5 bg-gray-100 rounded animate-pulse"></div>
            </div>

            {/* Actions Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="h-6 w-40 bg-gray-200 rounded mb-4 animate-pulse"></div>
              <div className="space-y-3">
                <div className="h-10 bg-yellow-100 rounded-lg animate-pulse"></div>
                <div className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
                <div className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading indicator */}
        <div className="mt-8 flex items-center justify-center">
          <div className="flex items-center gap-3 text-gray-600">
            <Building2 className="w-6 h-6 animate-pulse" />
            <span className="text-lg font-medium">Дэлгэрэнгүй мэдээлэл уншиж байна...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
