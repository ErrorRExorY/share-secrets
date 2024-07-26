import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const publicDomain = process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3003';
  //console.log(`Request URL: ${request.url}`);

  const response = NextResponse.next();

  // Set security headers
  response.headers.set('Content-Security-Policy', `default-src '${publicDomain}'; script-src '${publicDomain}'; style-src '${publicDomain}' 'unsafe-inline'; img-src '${publicDomain}' data:; font-src '${publicDomain}';`);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'no-referrer');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  return response;
}

// Middleware configuration to run on all API routes and pages
export const config = {
  matcher: ['/api/:path*'],
};
