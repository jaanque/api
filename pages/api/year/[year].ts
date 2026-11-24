import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { readFile } from 'fs/promises';
import { z } from 'zod';
import { ensureGetMethod } from '../../../lib/apiHelpers';

const yearSchema = z.string().regex(/^\d{4}$/, 'Year must be a 4-digit number');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!ensureGetMethod(req, res)) return;

  const parsed = yearSchema.safeParse(Array.isArray(req.query.year) ? req.query.year[0] : req.query.year);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0].message });
    return;
  }

  const year = parsed.data;
  const filePath = path.join(process.cwd(), 'data', `${year}.json`);
  try {
    const raw = await readFile(filePath, 'utf-8');
    const data = JSON.parse(raw);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.status(200).json(data);
  } catch {
    res.status(404).json({ error: `Data for year ${year} not found.` });
  }
}
