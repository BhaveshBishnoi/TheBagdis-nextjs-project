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
      
      try {
        const { payload } = await jwtVerify(token, secret) as { payload: JWTPayload };

        // Allow access to auth paths even when authenticated
        if (isAuthPath) {
          return NextResponse.next();
        }

        // If authenticated user tries to access auth paths
        if (isAuthPath) {
          // Redirect to appropriate dashboard based on role
          if (payload.role === 'admin') {
            return NextResponse.redirect(new URL('/admin', request.url));
          } else {
            return NextResponse.redirect(new URL('/products', request.url));
          }
        }

        // Check admin access
        if (isAdminPath && payload.role !== 'admin') {
          return NextResponse.redirect(new URL('/products', request.url));
        }

        // Add user info to headers for the API routes
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-user-id', payload.userId);
        requestHeaders.set('x-user-role', payload.role || 'user');

        return NextResponse.next({
          headers: requestHeaders,
        });
      } catch (jwtError) {
        // Token is invalid, clear it
        const response = NextResponse.next();
        response.cookies.delete('token');
        
        // Only redirect to login if trying to access protected routes
        if (isProtectedPath || isAdminPath) {
          const url = new URL('/login', request.url);
          url.searchParams.set('from', pathname);
          return NextResponse.redirect(url);
        }
        
        return response;
      }
    }

    // Allow access to public routes
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
