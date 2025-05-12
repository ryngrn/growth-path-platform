import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectToDatabase } from '@/lib/server/mongodb';
import { User } from '@/models/User';
import { hash } from 'bcryptjs';

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 },
      );
    }

    return NextResponse.json({
      authenticated: true,
      session: {
        user: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
        },
        expires: session.expires,
      },
    });
  } catch (error) {
    console.error('Auth test error:', error);
    return NextResponse.json(
      { error: 'Failed to check authentication status' },
      { status: 500 },
    );
  }
}

export async function POST() {
  try {
    await connectToDatabase();

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
    const hashedPassword = await hash('test123', 10);
    await User.create({
      name: 'Test User',
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
    return NextResponse.json(
      { error: 'Failed to create test user' },
      { status: 500 },
    );
  }
} 