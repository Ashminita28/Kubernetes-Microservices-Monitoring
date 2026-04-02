import { Request, Response } from 'express';
import { getStats } from '../services/stats-service';
import { logger } from '@all/shared';

export const statsHandler = async (req: Request, res: Response) => {
  try {
    const stats = await getStats();
    res.status(200).json(stats);
  } catch (error) {
    logger.error({ err: error }, 'failed to fetch stats');
    res.status(500).json({
      error: 'failed to fetch stats',
    });
  }
};
