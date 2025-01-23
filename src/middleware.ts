import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Add paths that require authentication
const protectedPaths = [
  '/profile',
  '/orders',
];

// Add paths that require admin role
const adminPaths = [
  '/admin',
];

// Add paths that should be accessible only to non-authenticated users
const authPaths = [
  '/login',
];

interface JWTPayload {
  role?: string;
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  
  let isAuthenticated = false;
  let userRole = '';
  
  if (token) {
    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || 'your-secret-key'
      );
      const { payload } = await jwtVerify(token, secret);
      isAuthenticated = true;
      userRole = (payload as JWTPayload).role || '';
    } catch {
      isAuthenticated = false;
    }
  }

  const path = request.nextUrl.pathname;

  // Check if the path requires admin role
  if (adminPaths.some(p => path.startsWith(p))) {
    if (!isAuthenticated) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('from', path);
      return NextResponse.redirect(redirectUrl);
    }
    
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Check if the path is protected and user is not authenticated
  if (protectedPaths.some(p => path.startsWith(p)) && !isAuthenticated) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('from', path);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect authenticated users away from auth pages
  if (authPaths.includes(path) && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
