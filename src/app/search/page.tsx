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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-roca text-3xl">Find Paths</h1>
          <Link href="/dashboard" className="btn-secondary">
            Back to Dashboard
          </Link>
        </div>

        <div className="mb-6">
          <input
            type="text"
            className="input mb-4"
            placeholder="Search paths..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
            <div key={path.id} className="card">
              <h2 className="font-roca text-2xl mb-2">{path.name}</h2>
              <p className="text-gray-600 mb-4">{path.description}</p>
              <div className="space-y-4">
                {path.skills.map((skill) => (
                  <div key={skill.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{skill.name}</h3>
                        <p className="text-sm text-gray-600">{skill.description}</p>
                      </div>
                      <span className="text-sm text-gray-500">
                        Ages {skill.ageRange.min}-{skill.ageRange.max}
                      </span>
                    </div>
                    <button className="btn-primary w-full">Add to Child's Path</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 