import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory rate limiter (60 requests per minute per IP)
const LIMIT = 60;
const WINDOW_MS = 60 * 1000;
const ipMap = new Map<string, { count: number; reset: number }>();

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function applyCors(res: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(CORS_HEADERS)) {
    res.headers.set(key, value);
  }
  return res;
}

export function middleware(req: NextRequest) {
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const now = Date.now();
  const entry = ipMap.get(ip) ?? { count: 0, reset: now + WINDOW_MS };
  if (now > entry.reset) {
    entry.count = 0;
    entry.reset = now + WINDOW_MS;
  }
  entry.count += 1;
  ipMap.set(ip, entry);

  if (entry.count > LIMIT) {
    return applyCors(
      new NextResponse(JSON.stringify({ error: 'Rate limit exceeded' }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': `${Math.ceil((entry.reset - now) / 1000)}`,
        },
      })
    );
  }

  return applyCors(NextResponse.next());
}

export const config = {
  matcher: ['/api/:path*'],
};
