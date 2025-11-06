'use server';

import { NextResponse, type NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';

const PROTECTED_ROUTES = ['/dashboard'];
const AUTH_ROUTES = ['/login', '/signup'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getSession();

  // If user is logged in:
  if (session) {
    // Redirect from auth pages to the dashboard
    if (AUTH_ROUTES.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // If on the root path, redirect to dashboard
    if (pathname === '/') {
       return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // If user is not logged in:
  if (!session) {
     // Protect the dashboard and its sub-paths
    if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - api (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   */
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
