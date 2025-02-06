import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Add paths that require authentication
const protectedPaths = [
  '/profile',
  '/orders',
  '/checkout',
];

// Add paths that require admin role
const adminPaths = [
  '/admin',
  '/admin/products',
  '/admin/orders',
  '/admin/users',
];

// Add paths that should be accessible only to non-authenticated users
const authPaths = [
  '/login',
  '/register',
];

interface JWTPayload {
  userId: string;
  role?: string;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from cookie
  const token = request.cookies.get('token')?.value;

  // Check if the path requires authentication
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  const isAdminPath = adminPaths.some(path => pathname.startsWith(path));
  const isAuthPath = authPaths.some(path => pathname.startsWith(path));

  try {
    if (!token) {
      // If no token and trying to access protected route
      if (isProtectedPath || isAdminPath) {
        const url = new URL('/login', request.url);
        url.searchParams.set('from', pathname);
        return NextResponse.redirect(url);
      }
      
      // Allow access to auth paths if not authenticated
      if (isAuthPath) {
        return NextResponse.next();
      }
    } else {
      // Verify token
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
      const { payload } = await jwtVerify(token, secret);

      // If authenticated user tries to access auth paths
      if (isAuthPath) {
        return NextResponse.redirect(new URL('/', request.url));
      }

      // Check admin access
      if (isAdminPath && payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }

      // Add user info to headers for the API routes
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', payload.userId as string);
      requestHeaders.set('x-user-role', payload.role as string);

      return NextResponse.next({
        headers: requestHeaders,
      });
    }

    // Allow access to public routes
    return NextResponse.next();
  } catch (error) {
    // If token is invalid, clear it and redirect to login
    if (isProtectedPath || isAdminPath) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
