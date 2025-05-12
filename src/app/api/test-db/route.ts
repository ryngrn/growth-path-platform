import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/server/mongodb';

export async function GET() {
  try {
    const db = await connectToDatabase();
    
    if (!db || !db.connection.db) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 },
      );
    }

    // Try to ping the database
    await db.connection.db.admin().ping();

    return NextResponse.json({
      status: 'success',
      message: 'MongoDB connection successful',
      details: {
        host: db.connection.host,
        name: db.connection.name,
        readyState: db.connection.readyState,
      },
    });
  } catch (error) {
    console.error('MongoDB connection test failed:', error);
    return NextResponse.json(
      { 
        error: 'Database connection test failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
} 