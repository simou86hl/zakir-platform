import type { NextAuthConfig } from 'next-auth';

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
    verifyRequest: '/verify-email',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/verify-email'];
      const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
      const onboardingRoutes = ['/select-country', '/select-grade', '/select-plan'];
      const adminRoutes = ['/admin'];

      const isPublicRoute = publicRoutes.includes(pathname);
      const isAuthRoute = authRoutes.includes(pathname);
      const isAdminRoute = adminRoutes.some(r => pathname.startsWith(r));
      const isOnboardingRoute = onboardingRoutes.some(r => pathname.startsWith(r));
      const isApiRoute = pathname.startsWith('/api');

      if (isApiRoute) return true;
      if (isAuthRoute && isLoggedIn) return Response.redirect(new URL('/dashboard', nextUrl));
      if (!isLoggedIn && !isPublicRoute) return false;

      const hasProfile = (auth?.user as any)?.hasProfile;
      if (isLoggedIn && !hasProfile && !isOnboardingRoute && !isAuthRoute && !isPublicRoute) {
        return Response.redirect(new URL('/select-country', nextUrl));
      }

      const userRole = (auth?.user as any)?.role;
      if (isAdminRoute && !['ADMIN', 'SUPER_ADMIN'].includes(userRole || '')) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.hasProfile = (user as any).hasProfile;
        token.firstName = (user as any).firstName;
        token.lastName = (user as any).lastName;
        token.avatar = (user as any).avatar;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
        (session.user as any).hasProfile = token.hasProfile;
        (session.user as any).firstName = token.firstName;
        (session.user as any).lastName = token.lastName;
        (session.user as any).avatar = token.avatar;
      }
      return session;
    },
  },
  session: { strategy: 'jwt' },
};
