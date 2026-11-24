import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { ensureGetMethod } from '../../../lib/apiHelpers';
import { loadAllCeremonies, CeremonyWinner } from '../../../lib/oscarsData';

const titleSchema = z.string().trim().min(1, 'Movie title is required.');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!ensureGetMethod(req, res)) return;

  const rawTitle = Array.isArray(req.query.title) ? req.query.title[0] : req.query.title;
  const parsed = titleSchema.safeParse(rawTitle ?? '');
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0].message });
    return;
  }

  const titleQuery = parsed.data.toLowerCase();
  const ceremonies = await loadAllCeremonies();
  const wins: Array<{ year: number; category: string; winner: CeremonyWinner }> = [];
  let details: CeremonyWinner | null = null;

  for (const ceremony of ceremonies) {
    for (const category of ceremony.categories) {
      const filmName = (category.winner.title || category.winner.film || '').toLowerCase();
      if (filmName && (filmName === titleQuery || filmName.includes(titleQuery))) {
        wins.push({
          year: ceremony.year,
          category: category.name,
          winner: category.winner,
        });
        if (category.winner.title && !details) {
          details = category.winner;
        }
      }
    }
  }

  if (wins.length === 0) {
    res.status(404).json({ error: `Movie "${parsed.data}" not found.` });
    return;
  }

  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.status(200).json({
    title: details?.title || wins[0].winner.film || parsed.data,
    details,
    totalWins: wins.length,
    wins,
  });
}
