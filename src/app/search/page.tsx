'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Path {
  id: string;
  name: string;
  description: string;
  category: string;
  skills: Array<{
    id: string;
    name: string;
    description: string;
    ageRange: {
      min: number;
      max: number;
    };
  }>;
}

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // TODO: Replace with actual data from API
  const paths: Path[] = [
    {
      id: 'cleaning',
      name: 'Cleaning',
      description: 'Learn essential cleaning and organization skills',
      category: 'basics',
      skills: [
        {
          id: 'make-bed',
          name: 'Making the Bed',
          description: 'Learn to make a neat and tidy bed',
          ageRange: { min: 4, max: 6 },
        },
        {
          id: 'vacuum',
          name: 'Vacuuming',
          description: 'Learn to safely use a vacuum cleaner',
          ageRange: { min: 6, max: 8 },
        },
      ],
    },
    {
      id: 'cooking',
      name: 'Cooking',
      description: 'Learn to prepare simple meals and snacks',
      category: 'life-skills',
      skills: [
        {
          id: 'sandwich',
          name: 'Making Sandwiches',
          description: 'Learn to make simple sandwiches',
          ageRange: { min: 5, max: 7 },
        },
        {
          id: 'microwave',
          name: 'Using the Microwave',
          description: 'Learn to safely use a microwave',
          ageRange: { min: 7, max: 9 },
        },
      ],
    },
  ];

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'basics', name: 'Basics' },
    { id: 'life-skills', name: 'Life Skills' },
    { id: 'sports', name: 'Sports' },
    { id: 'tech', name: 'Technology' },
  ];

  const filteredPaths = paths.filter((path) => {
    const matchesSearch = path.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      path.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || path.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-semibold text-[#141313]">Discover Learning Paths</h1>
          </div>

          <div className="mb-6">
            <input
              type="text"
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ef5e2f] focus:border-transparent text-gray-900 mb-4"
              placeholder="Search paths..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-[#ef5e2f] text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {filteredPaths.map((path) => (
              <div key={path.id} className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-[#141313] mb-2">{path.name}</h2>
                <p className="text-gray-600 mb-4">{path.description}</p>
                <div className="space-y-4">
                  {path.skills.map((skill) => (
                    <div key={skill.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-[#141313]">{skill.name}</h3>
                          <p className="text-sm text-gray-600">{skill.description}</p>
                        </div>
                        <span className="text-sm text-gray-500">
                          Ages {skill.ageRange.min}-{skill.ageRange.max}
                        </span>
                      </div>
                      <button 
                        className="w-full px-4 py-2 bg-[#ef5e2f] text-white rounded-full hover:bg-[#d44d1f] transition-colors"
                      >
                        Add to Child's Path
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 