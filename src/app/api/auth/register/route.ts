import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    console.log('Starting registration process...');
    const body = await request.json();
    const { name, email, password } = body as RegisterRequest;
    console.log('Received registration data:', { name, email, passwordLength: password?.length });

    // Validate input
    if (!name || !email || !password) {
      console.log('Missing required fields:', { name: !!name, email: !!email, password: !!password });
      return NextResponse.json(
        { error: 'Name, email and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email);
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password length (matching User model requirement)
    if (password.length < 8) {
      console.log('Password too short:', password.length);
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    console.log('Connecting to database...');
    // Connect to database
    await connectToDatabase();
    console.log('Database connected successfully');

    // Check if user already exists
    console.log('Checking for existing user with email:', email);
    const existingUser = await User.findOne({ email }).select('email');
    if (existingUser) {
      console.log('User already exists with email:', email);
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    console.log('Creating new user...');
    // Create new user (password will be hashed by the pre-save hook)
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password // Model's pre-save hook will hash this
    });
    console.log('User created successfully:', user._id);

    // Remove sensitive data from response
    const userObj = user.toJSON();
    console.log('User object before removing password:', Object.keys(userObj));
    const { password: _, ...userWithoutPassword } = userObj;
    console.log('User object after removing password:', Object.keys(userWithoutPassword));

    return NextResponse.json(
      { 
        message: 'User registered successfully', 
        user: userWithoutPassword 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      code: (error as any)?.code,
      keyPattern: (error as any)?.keyPattern,
      keyValue: (error as any)?.keyValue
    });
    
    // Handle mongoose validation errors
    if (error instanceof Error) {
      if (error.name === 'ValidationError') {
        return NextResponse.json(
          { error: 'Invalid input data. Please check all required fields.' },
          { status: 400 }
        );
      }
      
      // Handle unique constraint violation
      if ((error as any).code === 11000) {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: error.message || 'Error registering user. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Error registering user. Please try again.' },
      { status: 500 }
    );
  }
}
