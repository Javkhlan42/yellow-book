import React, { useState, useEffect } from 'react';
import { organizationService } from '../services/organizationService';

interface CategoryFilterProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  className?: string;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  selectedCategory, 
  setSelectedCategory,
  className = ""
}) => {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await organizationService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback categories
        setCategories(['Бүх ангилал', 'Эрүүл мэнд', 'Ресторан', 'Технологи', 'Гэрийн үйлчилгээ', 'Хууль зүйн үйлчилгээ', 'Худалдаа']);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === category
              ? 'bg-yellow-400 text-yellow-900'
              : 'bg-white text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 border border-gray-200'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;