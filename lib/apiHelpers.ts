import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Ensures the incoming request uses HTTP GET.
 * Sends 405 Method Not Allowed and returns false otherwise.
 */
export function ensureGetMethod(req: NextApiRequest, res: NextApiResponse): boolean {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ error: 'Method not allowed. Use GET.' });
    return false;
  }
  return true;
}
