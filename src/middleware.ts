import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { expectedToken, AUTH_COOKIE } from '@/lib/auth';

export async function middleware(req: NextRequest) {
  const password = process.env.APP_PASSWORD;

  // No password configured -> app is open (prevents accidental lockout).
  if (!password) return NextResponse.next();

  const token = req.cookies.get(AUTH_COOKIE)?.value;
  if (token && token === (await expectedToken(password))) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = '/login';
  url.searchParams.set('next', req.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export const config = {
  // Protect everything except the login page/route and static assets.
  matcher: ['/((?!login|api/login|api/logout|_next/static|_next/image|favicon.ico).*)'],
};