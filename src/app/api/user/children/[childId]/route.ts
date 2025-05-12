import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectToDatabase } from '@/lib/server/mongodb';
import { Child } from '@/models/Child';

export async function GET(
  request: Request,
  { params }: { params: { childId: string } },
) {
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

    const child = await Child.findOne({
      _id: params.childId,
      userId: session.user.id,
    });

    if (!child) {
      return NextResponse.json(
        { error: 'Child not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(child);
  } catch (error) {
    console.error('Error fetching child:', error);
    return NextResponse.json(
      { error: 'Failed to fetch child' },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { childId: string } },
) {
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

    const updates = await request.json();
    const child = await Child.findOneAndUpdate(
      {
        _id: params.childId,
        userId: session.user.id,
      },
      updates,
      { new: true },
    );

    if (!child) {
      return NextResponse.json(
        { error: 'Child not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(child);
  } catch (error) {
    console.error('Error updating child:', error);
    return NextResponse.json(
      { error: 'Failed to update child' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { childId: string } },
) {
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

    const child = await Child.findOneAndDelete({
      _id: params.childId,
      userId: session.user.id,
    });

    if (!child) {
      return NextResponse.json(
        { error: 'Child not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: 'Child deleted successfully' });
  } catch (error) {
    console.error('Error deleting child:', error);
    return NextResponse.json(
      { error: 'Failed to delete child' },
      { status: 500 },
    );
  }
} 