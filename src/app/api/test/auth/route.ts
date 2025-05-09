import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const session = await auth();
    return NextResponse.json({
      status: 'success',
      authenticated: !!session,
      user: session?.user,
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to check authentication status',
    });
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