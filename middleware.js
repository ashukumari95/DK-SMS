import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET || 'fallback_secret_for_development_only_12345';
const key = new TextEncoder().encode(secretKey);

// Paths that don't require authentication
const publicPaths = ['/login', '/forgot-password', '/api/auth/login', '/api/auth/forgot-password', '/api/auth/reset-password', '/api/auth/captcha', '/portal/login', '/api/auth/portal-login'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Static files and Next.js internals
  if (pathname.startsWith('/_next') || pathname.startsWith('/favicon.ico')) {
    return NextResponse.next();
  }

  const isPublicPath = publicPaths.includes(pathname);
  
  // Get session cookie
  const session = request.cookies.get('session')?.value;

  // Verify session
  let payload = null;
  let isValidSession = false;
  if (session) {
    try {
      const decoded = await jwtVerify(session, key, { algorithms: ['HS256'] });
      payload = decoded.payload;
      isValidSession = true;
    } catch (error) {
      // Invalid token
      isValidSession = false;
    }
  }

  // Redirect unauthenticated users to appropriate login
  if (!isValidSession && !isPublicPath) {
    if (pathname === '/' || pathname.startsWith('/portal')) {
      return NextResponse.redirect(new URL('/portal/login', request.url));
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect root to portal/login if someone explicitly visits /
  if (pathname === '/' && !isValidSession) {
    return NextResponse.redirect(new URL('/portal/login', request.url));
  }


  // Handle authenticated routing based on roles
  if (isValidSession) {
    const isStudent = payload.role === 'Student';
    
    // Redirect away from login pages if already logged in
    if (pathname === '/login' || pathname === '/forgot-password' || pathname === '/portal/login') {
      if (isStudent) {
        return NextResponse.redirect(new URL('/portal', request.url));
      } else {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    // Block students from admin dashboard
    if (isStudent && !pathname.startsWith('/portal') && !pathname.startsWith('/api')) {
      return NextResponse.redirect(new URL('/portal', request.url));
    }

    // Block admins from student portal
    if (!isStudent && pathname.startsWith('/portal') && !pathname.startsWith('/api')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
