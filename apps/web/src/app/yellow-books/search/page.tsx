import { Suspense } from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Search, MapPin, Filter, ArrowLeft } from 'lucide-react';
import { organizationService } from '../../../services/organizationService';
import { Card, CardContent, CardHeader } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { MapIsland } from './ClientMapIsland';

export const metadata: Metadata = {
  title: 'Дэвшилтэд хайлт - Yellow Books',
  description: 'Газрын зураг дээр бизнесүүдийг хайж олох',
};

// Server-side search results
async function SearchResults({ 
  query, 
  category 
}: { 
  query?: string; 
  category?: string;
}) {
  const organizations = await organizationService.getOrganizations(category, query);
  
  if (organizations.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
        <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Хайлтын үр дүн олдсонгүй
        </h3>
        <p className="text-gray-600">
          Өөр хайлтын нөхцөл оруулж үзнэ үү
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results count */}
      <div className="flex items-center justify-between bg-white px-6 py-4 rounded-lg border border-gray-200">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-yellow-600" />
          <span className="font-medium text-gray-900">
            {organizations.length} бизнес олдлоо
          </span>
        </div>
        {query && (
          <span className="text-sm text-gray-600">
            Хайлт: <span className="font-medium">&quot;{query}&quot;</span>
          </span>
        )}
      </div>

      {/* Client-side map island - hydrates on client */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-yellow-600" />
          Газрын зураг дээрх байршил
        </h2>
        <MapIsland organizations={organizations} />
        <p className="text-xs text-gray-500 mt-3 text-center">
          💡 Marker дээр дарж дэлгэрэнгүй мэдээлэл үзнэ үү
        </p>
      </div>

      {/* Results grid */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Жагсаалт</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {organizations.map((org) => (
            <Link key={org.id} href={`/yellow-books/${org.id}`}>
              <Card className="hover:shadow-lg transition-all duration-200 border-gray-200 hover:border-yellow-300 h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{org.logo}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-yellow-600 transition-colors">
                        {org.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {org.category}
                        </Badge>
                        {org.featured && (
                          <Badge className="text-xs bg-yellow-400 text-yellow-900">
                            Онцлох
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {org.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <MapPin className="w-3 h-3" />
                    <span className="line-clamp-1">{org.address}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// Loading skeleton
function SearchSkeleton() {
  return (
    <div className="space-y-6">
      <div className="bg-white px-6 py-4 rounded-lg border border-gray-200 animate-pulse">
        <div className="h-6 w-48 bg-gray-200 rounded"></div>
      </div>
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="h-6 w-64 bg-gray-200 rounded mb-4"></div>
        <div className="w-full h-[500px] bg-gray-100 rounded-lg animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
            <div className="flex gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string };
}) {
  // Extract search parameters
  const query = searchParams.q;
  const category = searchParams.category;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link 
            href="/yellow-books" 
            className="inline-flex items-center text-yellow-600 hover:text-yellow-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Yellow Books руу буцах
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <Search className="w-8 h-8 text-yellow-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Дэвшилтэд хайлт
              </h1>
              <p className="text-gray-600">
                Газрын зураг дээр бизнесүүдийг хайж олох
              </p>
            </div>
          </div>

          {/* Search form - client-side for better UX */}
          <form method="get" className="flex gap-3">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Бизнес, үйлчилгээ хайх..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-medium rounded-lg transition-colors"
            >
              Хайх
            </button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results with Suspense for streaming */}
        <Suspense fallback={<SearchSkeleton />}>
          <SearchResults query={query} category={category} />
        </Suspense>

        {/* SSR Info Banner */}
        <div className="mt-8 bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-purple-900 mb-2">
            🔮 SSR (Server-Side Rendering) + Client Island
          </h3>
          <p className="text-sm text-purple-700">
            Энэ хуудас бүр хүсэлт бүрт server дээр render хийгдэнэ. Газрын зураг 
            client-side &quot;island&quot; болж hydrate хийгдэж, бусад контент server-side rendered. 
            Өгөгдөл үргэлж шинэлэг байна!
          </p>
        </div>
      </div>
    </div>
  );
}
