import { readdir, readFile } from 'fs/promises';
import path from 'path';

export interface CeremonyWinner {
  title?: string;
  film?: string;
  person?: string;
  releaseYear?: number;
  runtimeMinutes?: number;
  directors?: string[];
  cast?: string[];
  writers?: string[];
  writer?: string;
  imdbId?: string;
  posterUrl?: string;
  [key: string]: unknown;
}

export interface CeremonyCategory {
  name: string;
  winner: CeremonyWinner;
}

export interface CeremonyData {
  year: number;
  ceremonyDate: string;
  categories: CeremonyCategory[];
}

export async function loadAllCeremonies(): Promise<CeremonyData[]> {
  const dir = path.join(process.cwd(), 'data');
  const files = await readdir(dir);
  const jsonFiles = files.filter((f) => f.endsWith('.json')).sort();

  const ceremonies = await Promise.all(
    jsonFiles.map(async (file) => {
      const raw = await readFile(path.join(dir, file), 'utf-8');
      return JSON.parse(raw) as CeremonyData;
    })
  );

  return ceremonies;
}
