import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Child from '@/models/Child';

export async function PUT(
  req: Request,
  { params }: { params: { childId: string } }
) {
  try {
    const session = await auth();
    if (!session || !session.user?.email) {
      return NextResponse.json({ status: 'error', message: 'Unauthorized' }, { status: 401 });
    }

    const { name, gender, birthday } = await req.json();
    if (!name || !birthday) {
      return NextResponse.json({ status: 'error', message: 'Name and birthday are required' }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ status: 'error', message: 'User not found' }, { status: 404 });
    }

    // Verify the child belongs to the user
    const child = await Child.findOne({ _id: params.childId, parent: user._id });
    if (!child) {
      return NextResponse.json({ status: 'error', message: 'Child not found' }, { status: 404 });
    }

    // Update the child
    const updatedChild = await Child.findByIdAndUpdate(
      params.childId,
      {
        name,
        gender: gender || undefined,
        birthday: new Date(birthday),
      },
      { new: true }
    );

    return NextResponse.json({ status: 'success', child: updatedChild });
  } catch (error) {
    console.error('Update child error:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to update child' }, { status: 500 });
  }
} 