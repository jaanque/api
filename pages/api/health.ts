import type { NextApiRequest, NextApiResponse } from 'next';
import { ensureGetMethod } from '../../lib/apiHelpers';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!ensureGetMethod(req, res)) return;

  res.status(200).json({
    status: 'ok',
    service: 'OscarsHub API',
    timestamp: new Date().toISOString(),
  });
}
