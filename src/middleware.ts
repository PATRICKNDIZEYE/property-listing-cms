import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Always allow access to admin login page
  if (pathname === '/admin/login') {
    const res = NextResponse.next();
    // Propagate current path to server layouts via header so they can make
    // path-aware decisions (e.g., allow /admin/login to render without redirect).
    res.headers.set('x-current-path', pathname);
    return res;
  }

  // Let the admin layout (server component) handle authentication and redirects.
  // Avoid performing session-cookie based redirects here to prevent redirect loops
  // and duplicate NEXT_REDIRECT handling. Middleware is intentionally minimal.
  const res = NextResponse.next();
  res.headers.set('x-current-path', pathname);
  return res;
}

export const config = {
  matcher: ['/admin/:path*'],
};

