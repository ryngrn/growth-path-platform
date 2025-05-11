import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Child from '@/models/Child';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ status: 'error', message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email }).populate('children');
    if (!user) {
      return NextResponse.json({ status: 'error', message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ status: 'success', children: user.children });
  } catch (error) {
    console.error('Fetch children error:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to fetch children' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
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

    const newChild = await Child.create({
      name,
      gender: gender || undefined,
      birthday: new Date(birthday),
      parent: user._id,
    });

    user.children = user.children || [];
    user.children.push(newChild._id);
    await user.save();

    return NextResponse.json({ status: 'success', child: newChild });
  } catch (error) {
    console.error('Add child error:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to add child' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ status: 'error', message: 'Unauthorized' }, { status: 401 });
    }

    const { childId } = await req.json();
    if (!childId) {
      return NextResponse.json({ status: 'error', message: 'Child ID is required' }, { status: 400 });
    }

    await connectDB();
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