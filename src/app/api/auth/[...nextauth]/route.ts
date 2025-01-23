import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { sign, verify } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Here you would typically:
    // 1. Validate input
    // 2. Check if user exists in database
    // 3. Verify password
    // 4. Generate JWT token
    
    // Mock users for demonstration
    // In a real application, you would fetch this from your database
    const users = [
      {
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        password: '$2a$10$GQH2YH8jK8I2JZ1Q9Q9Y9O9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q',
        role: 'admin'
      },
      {
        id: '2',
        name: 'Normal User',
        email: 'user@example.com',
        password: '$2a$10$GQH2YH8jK8I2JZ1Q9Q9Y9O9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q',
        role: 'user'
      }
    ];

    const user = users.find(u => u.email === email);
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // In a real application, you would verify the password using bcrypt
    // const isValidPassword = await bcrypt.compare(password, user.password);
    // For demo, we'll skip password verification
    
    const token = sign({ 
      userId: user.id,
      role: user.role 
    }, JWT_SECRET, { expiresIn: '1d' });

    // Remove password from user object before sending
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ 
      user: userWithoutPassword,
      token 
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Authentication failed' },
      { status: 401 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { message: 'No token provided' },
        { status: 401 }
      );
    }

    const decoded = verify(token, JWT_SECRET);
    
    // Here you would typically:
    // 1. Get user from database using decoded token
    // 2. Return user data

    return NextResponse.json({ message: 'Valid token' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Invalid token' },
      { status: 401 }
    );
  }
}
