import React, { useState, useEffect } from 'react';
import { Filter, Grid } from 'lucide-react';
import SearchBar from './SearchBar';
import CategoryFilter from './CategoryFilter';
import OrganizationCard from './OrganizationCard';
import { organizationService } from '../services/organizationService';
import { Organization } from '../types/organization';
import { Button } from './ui/button';

interface DirectoryProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const Directory: React.FC<DirectoryProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory
}) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setLoading(true);
        const data = await organizationService.getOrganizations(
          selectedCategory,
          searchQuery
        );
        setOrganizations(data);
      } catch (error) {
        console.error('Error fetching organizations:', error);
        setOrganizations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Бизнесийн Лавлах</h1>
            <p className="text-lg text-gray-600">
              Таны орон нутагт {organizations.length}+ бизнес олоорой
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <SearchBar 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              placeholder="Бизнес, үйлчилгээ, ангилал хайх..."
            />
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center mb-4 lg:mb-0">
                <Filter className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-700">Ангиллаар шүүх:</span>
              </div>
              <CategoryFilter 
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                className="lg:max-w-4xl"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {organizations.length} үр дүн
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">Уншиж байна...</div>
          </div>
        ) : organizations.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Grid className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Бизнес олдсонгүй</h3>
            <p className="text-gray-600 mb-4">
              Хайлтын нөхцөл эсвэл ангиллыг өөрчилж үзнэ үү.
            </p>
            <Button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Бүх ангилал');
              }}
              variant="outline"
              className="border-yellow-400 text-yellow-600 hover:bg-yellow-50"
            >
              Шүүлтүүр цэвэрлэх
            </Button>
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {searchQuery ? `"${searchQuery}"-ийн хайлтын үр дүн` : 'Бүх Бизнес'}
                </h2>
                {selectedCategory !== 'Бүх ангилал' && (
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedCategory} ангилалд
                  </p>
                )}
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {organizations.map((organization) => (
                <OrganizationCard 
                  key={organization.id} 
                  organization={organization} 
                />
              ))}
            </div>

            {/* Load More Button (placeholder for pagination) */}
            {organizations.length >= 9 && (
              <div className="text-center mt-12">
                <Button 
                  variant="outline"
                  className="border-yellow-400 text-yellow-600 hover:bg-yellow-50"
                >
                  Илүү олон үр дүн
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Directory;