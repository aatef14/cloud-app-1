import { NextResponse, type NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect the /dashboard route
  if (pathname.startsWith('/dashboard')) {
    const session = await getSession();
    if (!session) {
      // Redirect to login page if not authenticated
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Allow access to auth pages only if not logged in
  if (pathname.startsWith('/login') || pathname.startsWith('/signup')) {
    const session = await getSession();
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
};
