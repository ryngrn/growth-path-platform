import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectToDatabase } from '@/lib/server/mongodb';
import { User } from '@/models/User';

export async function updateUserProfile(data: { name: string; email: string }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 },
      );
    }

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 },
      );
    }

    const user = await User.findByIdAndUpdate(
      session.user.id,
      { name: data.name },
      { new: true },
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 },
    );
  }
} 