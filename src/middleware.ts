import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/verify-email'];
  const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
  const apiRoutes = pathname.startsWith('/api');

  // Allow API routes and static files
  if (apiRoutes) return NextResponse.next();

  // Check if user has a session token (NextAuth JWT cookie)
  const sessionToken =
    request.cookies.get('authjs.session-token')?.value ||
    request.cookies.get('__Secure-authjs.session-token')?.value ||
    request.cookies.get('next-auth.session-token')?.value ||
    request.cookies.get('__Secure-next-auth.session-token')?.value;

  const isLoggedIn = !!sessionToken;
  const isPublicRoute = publicRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);

  // If logged in and trying to access auth routes, redirect based on role
  if (isAuthRoute && isLoggedIn) {
    // We can't read the JWT payload here (it's encrypted), so just redirect to dashboard.
    // The auth.config.ts authorized callback will handle role-based redirect if needed.
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If not logged in and trying to access protected routes, redirect to login
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.[\\w]+$).*)'],
};
