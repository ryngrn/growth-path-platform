'use client';

import Link from 'next/link';
import { Card } from '@/components/card';
import { ContextAlert } from '@/components/context-alert';
import { RandomQuote } from '@/components/random-quote';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Welcome to GrowthPath</h1>
          <p className="text-gray-600 mb-4">
            Track your child's life skills development and help them grow.
          </p>
          <Link 
            href="/dashboard" 
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Get Started
          </Link>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <h2 className="text-xl font-semibold mb-4">Featured Quote</h2>
            <RandomQuote />
          </Card>

          <Card>
            <h2 className="text-xl font-semibold mb-4">Latest Updates</h2>
            <ContextAlert 
              message="New features coming soon! Stay tuned for updates."
              type="info"
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
