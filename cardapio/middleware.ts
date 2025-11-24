import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  if (!process.env.JWT_SECRET) {
    throw new Error('Missing JWT_SECRET environment variable');
  }
  const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
  
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // Define paths that are public and don't require authentication
  const publicPaths = ['/login', '/register', '/api/auth/login', '/api/auth/register'];

  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  if (isPublicPath) {
    // If the user is logged in and tries to access a public path, redirect to home
    if (token) {
      try {
        await jwtVerify(token, JWT_SECRET);
        return NextResponse.redirect(new URL('/', request.url));
      } catch (error) {
        // If token is invalid, let them proceed to public path (e.g. login)
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  // If there's no token and the path is not public, handle appropriately
  if (!token) {
    if (pathname.startsWith('/api')) {
      return new NextResponse(JSON.stringify({ message: 'Authentication required' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verify the token for protected routes
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    // Check for admin role for admin routes
    if (pathname.startsWith('/admin')) {
        if (payload.role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }
  } catch (error) {
    // If token is invalid, handle appropriately
    if (pathname.startsWith('/api')) {
      return new NextResponse(JSON.stringify({ message: 'Invalid or expired token' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('token');
    return response;
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
