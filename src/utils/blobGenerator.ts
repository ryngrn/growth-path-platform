import { generateId } from './index';

export interface BlobShape {
  id: string;
  name: string;
  svg: string;
  createdAt: Date;
}

export function generateBlobShape(name: string): BlobShape {
  const points = generatePoints();
  const svg = generateSVG(points);
  
  return {
    id: generateId(),
    name,
    svg,
    createdAt: new Date(),
  };
}

function generatePoints(): number[][] {
  const numPoints = 8;
  const points: number[][] = [];
  
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2;
    const radius = 100 + Math.random() * 50;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    points.push([x, y]);
  }
  
  return points;
}

function generateSVG(points: number[][]): string {
  const path = points
    .map((point, i) => {
      const [x, y] = point;
      return `${i === 0 ? 'M' : 'L'} ${x + 150} ${y + 150}`;
    })
    .join(' ') + ' Z';

  return `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
    <path d="${path}" fill="currentColor" />
  </svg>`;
} 