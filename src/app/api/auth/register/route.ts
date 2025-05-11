import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Child } from '@/models/Child';
import { Path } from '@/models/Path';

export async function POST(req: Request) {
  try {
    const { firstName, email, password } = await req.json();

    if (!firstName || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 },
      );
    }

    const hashedPassword = await hash(password, 12);

    const user = await User.create({
      name: firstName,
      email,
      password: hashedPassword,
    });

    const child = await Child.create({
      name: firstName,
      userId: user._id,
    });

    const defaultPath = await Path.findOne({ isDefault: true });
    if (defaultPath) {
      child.paths.push(defaultPath._id);
      await child.save();
    }

    return NextResponse.json(
      { message: 'User registered successfully' },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
} 