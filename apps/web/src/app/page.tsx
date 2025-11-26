'use client';

import React, { useState } from 'react';
import Header from './Header';
import Homepage from './Homepage';

export default function Page() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Homepage 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
    </div>
  );
}
