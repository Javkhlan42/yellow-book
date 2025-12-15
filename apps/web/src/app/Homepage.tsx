import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Search as SearchIcon } from 'lucide-react';
import SearchBar from './SearchBar';
import CategoryFilter from './CategoryFilter';
import OrganizationCard from './OrganizationCard';
import { organizationService } from '../services/organizationService';
import { Organization } from '../types/organization';
import { Button } from './ui/button';

interface HomepageProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const Homepage: React.FC<HomepageProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory
}) => {
  const [featuredOrganizations, setFeaturedOrganizations] = useState<Organization[]>([]);

  useEffect(() => {
    const fetchFeaturedOrganizations = async () => {
      try {
        const data = await organizationService.getFeaturedOrganizations();
        setFeaturedOrganizations(data);
      } catch (error) {
        console.error('Error fetching featured organizations:', error);
        // Fallback to empty array on error
        setFeaturedOrganizations([]);
      }
    };

    fetchFeaturedOrganizations();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-yellow-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Орон Нутгийн Бизнес
              <span className="block text-yellow-600">Эрэн Хайх</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Танай орчны шилдэг бизнесүүдийг олоорой. Зоогийн газраас эхлээд үйлчилгээ хүртэл, 
              бүх зүйлийг нэг газраас олоорой.
            </p>
          </div>

          {/* Search Section */}
          <div className="max-w-4xl mx-auto">
            <SearchBar 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              placeholder="Бизнес, үйлчилгээ, ангилал хайх..."
              className="mb-6"
            />
            
            <div className="flex justify-center">
              <Link href="/directory">
                <Button className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 px-8 py-3 text-lg">
                  <SearchIcon className="w-5 h-5 mr-2" />
                  Лавлах
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-yellow-600 mb-2">500+</div>
              <div className="text-gray-600">Орон Нутгийн Бизнес</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-600 mb-2">50+</div>
              <div className="text-gray-600">Ангилал</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-600 mb-2">10k+</div>
              <div className="text-gray-600">Сэтгэл Ханамжтай Үйлчлүүлэгч</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ангиллаар Хайх</h2>
            <p className="text-lg text-gray-600">Ангиллаар бизнес хайх эсвэл бүх сонголтыг үзэх</p>
          </div>
          
          <CategoryFilter 
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            className="justify-center mb-8"
          />
          
          <div className="text-center">
            <Link href="/directory">
              <Button variant="outline" className="border-yellow-400 text-yellow-600 hover:bg-yellow-50">
                Бүх Ангилал Үзэх
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Organizations */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Онцлох Бизнесүүд</h2>
              <p className="text-lg text-gray-600">Танай орчны шилдэг үнэлгээтэй бизнесүүд</p>
            </div>
            <Link href="/directory">
              <Button variant="outline" className="border-yellow-400 text-yellow-600 hover:bg-yellow-50">
                Бүгдийг Үзэх
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredOrganizations.map((organization) => (
              <OrganizationCard 
                key={organization.id} 
                organization={organization} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-yellow-900 mb-4">
            Дараагийн Дуртай Бизнесээ Олоход Бэлэн үү?
          </h2>
          <p className="text-lg text-yellow-800 mb-8 max-w-2xl mx-auto">
            Өдөр бүр YellowBook ашиглан гайхалтай орон нутгийн бизнесүүдийг олж байгаа 
            олон мянган сэтгэл ханамжтай үйлчлүүлэгчдэд нэгдээрэй.
          </p>
          <Link href="/directory">
            <Button className="bg-white text-yellow-600 hover:bg-gray-50 px-8 py-3 text-lg">
              Эхлэх
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Homepage;