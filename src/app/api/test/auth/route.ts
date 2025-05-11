import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 },
      );
    }

    return NextResponse.json({
      authenticated: true,
      session,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function POST() {
  try {
    await connectDB();

    // Check if test user exists
    const testUser = await User.findOne({ email: 'test@example.com' });

    if (testUser) {
      return NextResponse.json({
        status: 'success',
        message: 'Test user already exists',
        credentials: {
          email: 'test@example.com',
          password: 'test123',
        },
      });
    }

    // Create test user
    const hashedPassword = await bcrypt.hash('test123', 10);
    await User.create({
      firstName: 'Test',
      familyName: 'User',
      email: 'test@example.com',
      password: hashedPassword,
    });

    return NextResponse.json({
      status: 'success',
      message: 'Test user created',
      credentials: {
        email: 'test@example.com',
        password: 'test123',
      },
    });
  } catch (error) {
    console.error('Create test user error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to create test user',
    });
  }
} 