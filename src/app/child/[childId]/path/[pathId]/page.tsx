'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Skill {
  id: string;
  name: string;
  description: string;
  ageRange: {
    min: number;
    max: number;
  };
  scormData: {
    status: 'not attempted' | 'incomplete' | 'completed' | 'passed' | 'failed';
    score?: number;
    timeSpent: number;
    lastAttempt?: Date;
  };
}

export default function ChildPath({
  params,
}: {
  params: { childId: string; pathId: string };
}) {
  // TODO: Replace with actual data from API
  const [childName] = useState('Jack');
  const [pathName] = useState('Cooking');
  const [skills] = useState<Skill[]>([
    {
      id: 'sandwich',
      name: 'Making Sandwiches',
      description: 'Learn to make simple sandwiches',
      ageRange: { min: 5, max: 7 },
      scormData: {
        status: 'incomplete',
        score: 60,
        timeSpent: 1200,
        lastAttempt: new Date('2024-03-15'),
      },
    },
    {
      id: 'microwave',
      name: 'Using the Microwave',
      description: 'Learn to safely use a microwave',
      ageRange: { min: 7, max: 9 },
      scormData: {
        status: 'not attempted',
        timeSpent: 0,
      },
    },
  ]);

  const getStatusColor = (status: Skill['scormData']['status']) => {
    switch (status) {
      case 'completed':
      case 'passed':
        return 'bg-green-100 text-green-800';
      case 'incomplete':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-roca text-3xl">{childName}'s {pathName} Path</h1>
            <p className="text-gray-600">Track progress and learn new skills</p>
          </div>
          <Link href="/dashboard" className="btn-secondary">
            Back to Dashboard
          </Link>
        </div>

        <div className="space-y-6">
          {skills.map((skill) => (
            <div key={skill.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="font-roca text-xl mb-2">{skill.name}</h2>
                  <p className="text-gray-600">{skill.description}</p>
                </div>
                <span className="text-sm text-gray-500">
                  Ages {skill.ageRange.min}-{skill.ageRange.max}
                </span>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                    skill.scormData.status
                  )}`}
                >
                  {skill.scormData.status.charAt(0).toUpperCase() +
                    skill.scormData.status.slice(1)}
                </span>
                {skill.scormData.score && (
                  <span className="text-sm text-gray-600">
                    Score: {skill.scormData.score}%
                  </span>
                )}
                {skill.scormData.lastAttempt && (
                  <span className="text-sm text-gray-600">
                    Last attempt: {skill.scormData.lastAttempt.toLocaleDateString()}
                  </span>
                )}
              </div>

              <div className="flex gap-4">
                <button className="btn-primary flex-1">Start Learning</button>
                <button className="btn-secondary flex-1">View Resources</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 