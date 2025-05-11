import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    await connectToDatabase();
    return NextResponse.json({ status: 'Database connection successful' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Database connection failed' },
      { status: 500 },
    );
  }
} 