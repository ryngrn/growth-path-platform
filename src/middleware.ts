import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Public paths that don't require authentication
  const publicPaths = ['/', '/api/auth/register'];

  // Check if the request is for a public path
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname === path);

  // Allow access to public paths without authentication
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Check if the request is for an API route
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');

  // Get the session token from the cookie
  const sessionToken = request.cookies.get('next-auth.session-token');

  // For API routes, return 401 if not authenticated
  if (isApiRoute && !sessionToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // For non-API routes, redirect to login if not authenticated
  if (!sessionToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images).*)',
  ],
}; 