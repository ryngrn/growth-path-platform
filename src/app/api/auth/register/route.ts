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

    if (!firstName || !email || !password) {
      return NextResponse.json(
        { status: 'error', message: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('Connected to MongoDB successfully');

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
    console.log('Creating user...');
    const user = await User.create({
      firstName,
      email,
      password: hashedPassword,
      familyName,
    });
    console.log('User created successfully:', user._id);

    // Create children
    console.log('Creating children...');
    const childPromises = children.map(async (child: any) => {
      try {
        const newChild = await Child.create({
          name: child.name,
          gender: child.gender,
          birthday: new Date(child.birthday),
          parent: user._id,
        });
        return newChild._id;
      } catch (error) {
        console.error('Error creating child:', error);
        throw error;
      }
    });

    const childIds = await Promise.all(childPromises);
    console.log('Children created successfully:', childIds);

    // Update user with children
    console.log('Updating user with children...');
    await User.findByIdAndUpdate(user._id, {
      children: childIds,
    });
    console.log('User updated with children successfully');

    // Create paths and associate with children
    console.log('Associating paths with children...');
    const pathPromises = selectedPaths.map(async (pathId: string) => {
      try {
        const path = await Path.findOne({ id: pathId });
        if (path) {
          await Path.findByIdAndUpdate(path._id, {
            $push: { children: { $each: childIds } },
          });
        }
      } catch (error) {
        console.error('Error associating path:', error);
        throw error;
      }
    });

    await Promise.all(pathPromises);
    console.log('Paths associated with children successfully');

    return NextResponse.json({
      status: 'success',
      message: 'User registered successfully',
      userId: user._id,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to register user',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 