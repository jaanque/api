import type { NextApiRequest, NextApiResponse } from 'next';
import yearsHandler from '../pages/api/years';
import yearHandler from '../pages/api/year/[year]';
import movieHandler from '../pages/api/movie/[title]';
import searchHandler from '../pages/api/search';
import healthHandler from '../pages/api/health';

function createMockRes() {
  const headers: Record<string, string> = {};
  let statusCode = 200;
  let body: unknown = null;

  const res = {
    setHeader(name: string, value: string) {
      headers[name] = value;
      return res;
    },
    status(code: number) {
      statusCode = code;
      return res;
    },
    json(data: unknown) {
      body = data;
      return res;
    },
  } as unknown as NextApiResponse;

  return {
    res,
    getStatus: () => statusCode,
    getBody: () => body,
    getHeaders: () => headers,
  };
}

describe('OscarsHub API handlers', () => {
  it('GET /api/years returns available years', async () => {
    const req = { method: 'GET', query: {} } as NextApiRequest;
    const mock = createMockRes();
    await yearsHandler(req, mock.res);
    expect(mock.getStatus()).toBe(200);
    expect(mock.getBody()).toEqual(expect.arrayContaining(['2020', '2024']));
  });

  it('GET /api/year/2024 returns 2024 ceremony data', async () => {
    const req = { method: 'GET', query: { year: '2024' } } as unknown as NextApiRequest;
    const mock = createMockRes();
    await yearHandler(req, mock.res);
    expect(mock.getStatus()).toBe(200);
    expect((mock.getBody() as { year: number }).year).toBe(2024);
  });

  it('GET /api/year/abc returns 400 on invalid year format', async () => {
    const req = { method: 'GET', query: { year: 'abc' } } as unknown as NextApiRequest;
    const mock = createMockRes();
    await yearHandler(req, mock.res);
    expect(mock.getStatus()).toBe(400);
  });

  it('GET /api/year/1999 returns 404', async () => {
    const req = { method: 'GET', query: { year: '1999' } } as unknown as NextApiRequest;
    const mock = createMockRes();
    await yearHandler(req, mock.res);
    expect(mock.getStatus()).toBe(404);
  });

  it('GET /api/movie/Oppenheimer returns film details and wins', async () => {
    const req = { method: 'GET', query: { title: 'Oppenheimer' } } as unknown as NextApiRequest;
    const mock = createMockRes();
    await movieHandler(req, mock.res);
    expect(mock.getStatus()).toBe(200);
    const data = mock.getBody() as { title: string; totalWins: number };
    expect(data.title).toBe('Oppenheimer');
    expect(data.totalWins).toBeGreaterThan(0);
  });

  it('GET /api/movie/UnknownFilm123 returns 404', async () => {
    const req = { method: 'GET', query: { title: 'UnknownFilm123' } } as unknown as NextApiRequest;
    const mock = createMockRes();
    await movieHandler(req, mock.res);
    expect(mock.getStatus()).toBe(404);
  });

  it('GET /api/search?q=Nolan returns matching results', async () => {
    const req = { method: 'GET', query: { q: 'Nolan' } } as unknown as NextApiRequest;
    const mock = createMockRes();
    await searchHandler(req, mock.res);
    expect(mock.getStatus()).toBe(200);
    const data = mock.getBody() as { count: number };
    expect(data.count).toBeGreaterThan(0);
  });

  it('GET /api/search without q returns 400', async () => {
    const req = { method: 'GET', query: {} } as NextApiRequest;
    const mock = createMockRes();
    await searchHandler(req, mock.res);
    expect(mock.getStatus()).toBe(400);
  });

  it('GET /api/health returns status ok', () => {
    const req = { method: 'GET', query: {} } as NextApiRequest;
    const mock = createMockRes();
    healthHandler(req, mock.res);
    expect(mock.getStatus()).toBe(200);
    expect((mock.getBody() as { status: string }).status).toBe('ok');
  });

  it('POST /api/years returns 405 Method Not Allowed', async () => {
    const req = { method: 'POST', query: {} } as NextApiRequest;
    const mock = createMockRes();
    await yearsHandler(req, mock.res);
    expect(mock.getStatus()).toBe(405);
    expect(mock.getHeaders().Allow).toBe('GET');
  });
});
