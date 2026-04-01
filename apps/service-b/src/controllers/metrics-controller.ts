import { Request, Response } from 'express';
import { logger } from '@all/shared';
import client from 'prom-client';

export async function setupMetricsServer(req: Request, res: Response) {
  try {
    res.set('Content-Type', client.register.contentType);
    const metrics = await client.register.metrics();
    res.send(metrics);
  } catch (error) {
    logger.error({ err: error }, 'Failed to get metrics');
    res.status(500).send('Failed to get metrics');
  }
}
