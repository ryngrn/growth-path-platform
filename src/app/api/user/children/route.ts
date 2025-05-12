import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Child } from '@/models/Child';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
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

    const children = await Child.find({ userId: session.user.id });
    return NextResponse.json(children);
  } catch (error) {
    console.error('Error fetching children:', error);
    return NextResponse.json(
      { error: 'Failed to fetch children' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
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

    const data = await request.json();
    const child = await Child.create({
      ...data,
      userId: session.user.id,
    });

    return NextResponse.json(child, { status: 201 });
  } catch (error) {
    console.error('Error creating child:', error);
    return NextResponse.json(
      { error: 'Failed to create child' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ status: 'error', message: 'Unauthorized' }, { status: 401 });
    }

    const { childId } = await req.json();
    if (!childId) {
      return NextResponse.json({ status: 'error', message: 'Child ID is required' }, { status: 400 });
    }

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({ status: 'error', message: 'Database connection failed' }, { status: 500 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ status: 'error', message: 'User not found' }, { status: 404 });
    }

    // Remove child from user's children array
    user.children = user.children.filter((id: string) => id.toString() !== childId);
    await user.save();

    // Delete the child document
    await Child.findByIdAndDelete(childId);

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Delete child error:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to delete child' }, { status: 500 });
  }
} 