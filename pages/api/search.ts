import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { ensureGetMethod } from '../../lib/apiHelpers';
import { loadAllCeremonies } from '../../lib/oscarsData';

const querySchema = z
  .string()
  .trim()
  .min(1, 'Query parameter "q" is required. Example: /api/search?q=Nolan');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!ensureGetMethod(req, res)) return;

  const rawQ = Array.isArray(req.query.q) ? req.query.q[0] : req.query.q;
  const parsed = querySchema.safeParse(rawQ ?? '');
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0].message });
    return;
  }

  const query = parsed.data;
  const qLower = query.toLowerCase();
  const ceremonies = await loadAllCeremonies();
  const results: Array<{
    year: number;
    ceremonyDate: string;
    category: string;
    winner: Record<string, unknown>;
  }> = [];

  for (const ceremony of ceremonies) {
    for (const category of ceremony.categories) {
      const w = category.winner;
      const searchableParts = [
        category.name,
        w.title,
        w.film,
        w.person,
        w.writer,
        ...(w.directors || []),
        ...(w.cast || []),
        ...(w.writers || []),
      ]
        .filter((v): v is string => typeof v === 'string')
        .map((v) => v.toLowerCase());

      if (searchableParts.some((part) => part.includes(qLower))) {
        results.push({
          year: ceremony.year,
          ceremonyDate: ceremony.ceremonyDate,
          category: category.name,
          winner: w,
        });
      }
    }
  }

  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.status(200).json({
    query,
    count: results.length,
    results,
  });
}
