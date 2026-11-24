import { NextRequest } from 'next/server';
import { middleware } from '../middleware';

function makeRequest(method: string, ip: string) {
  return new NextRequest('http://localhost:3000/api/years', {
    method,
    headers: { 'x-forwarded-for': ip },
  });
}

describe('API middleware (CORS & rate limiting)', () => {
  it('adds CORS headers to GET requests', () => {
    const res = middleware(makeRequest('GET', '10.0.0.1'));
    expect(res.status).toBe(200);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });

  it('responds 204 to OPTIONS preflight requests', () => {
    const res = middleware(makeRequest('OPTIONS', '10.0.0.2'));
    expect(res.status).toBe(204);
    expect(res.headers.get('Access-Control-Allow-Methods')).toBe('GET, OPTIONS');
  });

  it('returns 429 after 60 requests per minute from the same IP', () => {
    const ip = '10.0.0.99';
    for (let i = 0; i < 60; i++) {
      const res = middleware(makeRequest('GET', ip));
      expect(res.status).toBe(200);
    }
    const blocked = middleware(makeRequest('GET', ip));
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get('Retry-After')).toBeTruthy();
    expect(blocked.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });
});
