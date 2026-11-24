import type { NextApiRequest, NextApiResponse } from 'next';
import { readdir } from 'fs/promises';
import path from 'path';
import { ensureGetMethod } from '../../lib/apiHelpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!ensureGetMethod(req, res)) return;

  const dir = path.join(process.cwd(), 'data');
  const files = await readdir(dir);
  const years = files.filter((f) => f.endsWith('.json')).map((f) => f.replace('.json', ''));
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.status(200).json(years);
}
