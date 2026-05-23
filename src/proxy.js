import { NextResponse } from 'next/server';

export function proxy(request) {
  const isAuth = request.cookies.get('event_auth')?.value === 'true';
  const userRole = request.cookies.get('user_role')?.value;
  const { pathname } = request.nextUrl;

  // Protect the volunteer page
  if (pathname === '/volunteer') {
    if (!isAuth || userRole !== 'volunteer') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Redirect to volunteer page if already logged in and trying to go to login
  if (pathname === '/login') {
    if (isAuth && userRole === 'volunteer') {
      return NextResponse.redirect(new URL('/volunteer', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/volunteer', '/login'],
};
