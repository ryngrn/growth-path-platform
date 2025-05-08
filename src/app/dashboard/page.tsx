'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Child {
  id: string;
  name: string;
  paths: Array<{
    id: string;
    name: string;
    progress: number;
  }>;
}

export default function Dashboard() {
  // TODO: Replace with actual data from API
  const [children] = useState<Child[]>([
    {
      id: '1',
      name: 'Jack',
      paths: [
        { id: 'cooking', name: 'Cooking', progress: 75 },
        { id: 'cleaning', name: 'Cleaning', progress: 30 },
      ],
    },
    {
      id: '2',
      name: 'Emma',
      paths: [
        { id: 'sports', name: 'Sports', progress: 90 },
        { id: 'tech', name: 'Computers & Tech', progress: 45 },
      ],
    },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-roca text-3xl">Family Dashboard</h1>
          <Link href="/search" className="btn-secondary">
            Find New Paths
          </Link>
        </div>

        <div className="space-y-6">
          {children.map((child) => (
            <div key={child.id} className="card">
              <h2 className="font-roca text-2xl mb-4">{child.name}'s Progress</h2>
              <div className="space-y-4">
                {child.paths.map((path) => (
                  <Link
                    key={path.id}
                    href={`/child/${child.id}/path/${path.id}`}
                    className="block p-4 border rounded-lg hover:border-primary-300 transition-colors"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{path.name}</h3>
                      <span className="text-sm text-gray-600">{path.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full"
                        style={{ width: `${path.progress}%` }}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 