'use client';

import React, { useState } from 'react';
import Header from '../Header';
import Directory from '../Directory';

export default function DirectoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Бүх ангилал');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Directory 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
    </div>
  );
}
