import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const start = Date.now();
  const response = NextResponse.next();

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';
  const method = request.method;
  const path = request.nextUrl.pathname;
  const query = request.nextUrl.search;
  const userAgent = request.headers.get('user-agent') || '-';
  const referer = request.headers.get('referer') || '-';
  const duration = Date.now() - start;

  const logEntry = JSON.stringify({
    timestamp: new Date().toISOString(),
    method,
    path: path + query,
    ip,
    userAgent,
    referer,
    durationMs: duration,
  });

  console.log(`[ACCESS] ${logEntry}`);

  return response;
}

export const config = {
  matcher: [
    /*
     * 静的ファイル (_next/static, _next/image, favicon 等) を除外し、
     * ページリクエストのみログを取る
     */
    '/((?!_next/static|_next/image|favicon\\.ico|favicon\\.png|favicon-16\\.png|apple-touch-icon\\.png|manifest\\.json|ogp\\.png|robots\\.txt|sitemap\\.xml|feed\\.xml|llms\\.txt|llms-full\\.txt).*)',
  ],
};
