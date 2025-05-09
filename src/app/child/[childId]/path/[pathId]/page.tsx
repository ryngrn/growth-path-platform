'use client';

import { Box, Typography, Button, LinearProgress } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import Link from 'next/link';

interface PathData {
  name: string;
  description: string;
  ageRange: {
    min: number;
    max: number;
  };
  status: 'locked' | 'in_progress' | 'completed';
  score: number;
  timeSpent: number;
  lastAttempt: Date;
}

interface SkillData {
  name: string;
  description: string;
  ageRange: {
    min: number;
    max: number;
  };
  status: 'locked' | 'in_progress' | 'completed';
  score: number;
  timeSpent: number;
  lastAttempt: Date;
}

export default function ChildPath({ params }: { params: { childId: string; pathId: string } }) {
  // Mock data - replace with actual data fetching
  const path: PathData = {
    name: 'Mathematics',
    description: 'Basic arithmetic and problem-solving skills',
    ageRange: { min: 5, max: 7 },
    status: 'in_progress',
    score: 60,
    timeSpent: 1200,
    lastAttempt: new Date(),
  };

  const skills: SkillData[] = [
    {
      name: 'Addition',
      description: 'Adding numbers up to 100',
      ageRange: { min: 6, max: 8 },
      status: 'completed',
      score: 0,
      timeSpent: 0,
      lastAttempt: new Date(),
    },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 4 }}>
        <Link href={`/child/${params.childId}`}>
          <Button startIcon={<ArrowBack />}>Back to Paths</Button>
        </Link>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {path.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {path.description}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Age Range: {path.ageRange.min}-{path.ageRange.max} years
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Progress
        </Typography>
        <LinearProgress
          variant="determinate"
          value={path.score}
          sx={{ height: 10, borderRadius: 5 }}
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {path.score}% Complete
        </Typography>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          Skills
        </Typography>
        {skills.map((skill, index) => (
          <Box
            key={index}
            sx={{
              p: 2,
              mb: 2,
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
            }}
          >
            <Typography variant="subtitle1" gutterBottom>
              {skill.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {skill.description}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Age Range: {skill.ageRange.min}-{skill.ageRange.max} years
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
} 