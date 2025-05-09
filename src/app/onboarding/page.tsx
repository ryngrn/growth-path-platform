'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card } from '@/components/card';
import { ContextAlert } from '@/components/context-alert';

interface Child {
  name: string;
  gender: 'female' | 'male' | 'other';
  birthday: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [error, setError] = useState('');
  const [children, setChildren] = useState<Child[]>([]);

  const addChild = () => {
    setChildren([...children, { name: '', gender: 'female', birthday: '' }]);
  };

  const updateChild = (index: number, field: string, value: string) => {
    const newChildren = [...children];
    newChildren[index] = { ...newChildren[index], [field]: value } as Child;
    setChildren(newChildren);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/user/children', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ children }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to save children');
      }

      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (status === 'unauthenticated') {
    router.replace('/');
    return null;
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <h1 className="text-2xl font-bold text-center mb-6">
              Tell Us About Your Children
            </h1>

            {error && (
              <ContextAlert
                message={error}
                type="error"
                className="mb-4"
              />
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {children.map((child, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1 text-left">
                        Name
                      </label>
                      <input
                        type="text"
                        value={child.name}
                        onChange={(e) => updateChild(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md text-black"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1 text-left">
                        Gender
                      </label>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => updateChild(index, 'gender', 'female')}
                          className={`flex-1 py-2 px-4 rounded-md border ${
                            child.gender === 'female'
                              ? 'bg-[#EF4136] text-white border-[#EF4136]'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          Female
                        </button>
                        <button
                          type="button"
                          onClick={() => updateChild(index, 'gender', 'male')}
                          className={`flex-1 py-2 px-4 rounded-md border ${
                            child.gender === 'male'
                              ? 'bg-[#EF4136] text-white border-[#EF4136]'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          Male
                        </button>
                        <button
                          type="button"
                          onClick={() => updateChild(index, 'gender', 'other')}
                          className={`flex-1 py-2 px-4 rounded-md border ${
                            child.gender === 'other'
                              ? 'bg-[#EF4136] text-white border-[#EF4136]'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          Other
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1 text-left">
                        Birthday
                      </label>
                      <input
                        type="date"
                        value={child.birthday}
                        onChange={(e) => updateChild(index, 'birthday', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addChild}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200"
              >
                Add Another Child
              </button>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                disabled={children.length === 0}
              >
                Continue to Dashboard
              </button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
} 