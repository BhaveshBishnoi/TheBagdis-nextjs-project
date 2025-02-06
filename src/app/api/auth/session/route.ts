import { NextRequest, NextResponse } from 'next/server';
import { Auth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    // Get token from cookie
    const cookieHeader = req.headers.get('cookie');
    const token = cookieHeader?.split(';')
      .find(c => c.trim().startsWith('token='))
      ?.split('=')[1];

    if (!token) {
      return NextResponse.json({ error: 'No session found' }, { status: 401 });
    }

    // Get user data from token
    const user = await Auth.getCurrentUser(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ error: 'Session error' }, { status: 401 });
  }
}
