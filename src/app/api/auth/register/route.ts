import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Child from '@/models/Child';
import Path from '@/models/Path';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, email, password, familyName, children, selectedPaths } = body;

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { status: 'error', message: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      firstName,
      email,
      password: hashedPassword,
      familyName,
    });

    // Create children
    const childPromises = children.map(async (child: any) => {
      const newChild = await Child.create({
        name: child.name,
        gender: child.gender,
        birthday: new Date(child.birthday),
        parent: user._id,
      });
      return newChild._id;
    });

    const childIds = await Promise.all(childPromises);

    // Update user with children
    await User.findByIdAndUpdate(user._id, {
      children: childIds,
    });

    // Create paths and associate with children
    const pathPromises = selectedPaths.map(async (pathId: string) => {
      const path = await Path.findOne({ id: pathId });
      if (path) {
        await Path.findByIdAndUpdate(path._id, {
          $push: { children: { $each: childIds } },
        });
      }
    });

    await Promise.all(pathPromises);

    return NextResponse.json({
      status: 'success',
      message: 'User registered successfully',
      userId: user._id,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to register user' },
      { status: 500 }
    );
  }
} 