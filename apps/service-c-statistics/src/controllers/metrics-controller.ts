import { Request, Response } from 'express';
import client from 'prom-client';
import { logger } from '@all/shared';
import { getStats } from '../services/stats-service';
import {
  queueLengthGauge,
  totalJobsCompleted,
  totalJobsSubmitted,
} from '../metrics/metrics';

export async function setupMetrics(req: Request, res: Response) {
  try {
    const stats = await getStats();

    totalJobsSubmitted.set(stats.totalJobSubmitted);
    totalJobsCompleted.set(stats.totalJobsCompleted);
    queueLengthGauge.set(stats.queueLength);
    res.set('Content-Type', client.register.contentType);
    const metrics = await client.register.metrics();
    res.send(metrics);
  } catch (error) {
    logger.error({ err: error }, 'Failed to get metrics');
    res.status(500).send('failed to get metrics');
  }
}
