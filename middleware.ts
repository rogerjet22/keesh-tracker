import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/api/shippo/webhook'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public paths (webhooks)
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) return NextResponse.next();

  const authHeader = req.headers.get('authorization') || '';
  const [scheme, encoded] = authHeader.split(' ');

  if (scheme === 'Basic' && encoded) {
    try {
      const decoded = typeof atob === 'function' ? atob(encoded) : Buffer.from(encoded, 'base64').toString();
      const [user, pass] = decoded.split(':');
      const BASIC_USER = process.env.BASIC_AUTH_USER || '';
      const BASIC_PASS = process.env.BASIC_AUTH_PASS || '';
      if (user === BASIC_USER && pass === BASIC_PASS) {
        return NextResponse.next();
      }
    } catch (e) {
      // fallthrough to return auth challenge
    }
  }

  const res = new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Protected"',
    },
  });

  return res;
}

export const config = {
  matcher: '/:path*',
};
