import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Always allow access to admin login page
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // For other admin routes, let NextAuth handle authentication
  // The layout will check for admin role
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

