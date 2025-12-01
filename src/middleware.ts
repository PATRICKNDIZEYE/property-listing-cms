import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === 'ADMIN';
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');

    // If accessing admin routes without admin role, redirect to admin login
    if (isAdminRoute && !isAdmin) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
        
        // Allow access to admin login page without auth
        if (req.nextUrl.pathname === '/admin/login') {
          return true;
        }

        // Require auth for admin routes
        if (isAdminRoute) {
          return !!token && token.role === 'ADMIN';
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/admin/:path*'],
};

