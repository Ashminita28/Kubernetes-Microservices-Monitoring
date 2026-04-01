import { Request, Response } from 'express';
import client from 'prom-client';

export async function setupMetricsServer(req: Request, res: Response) {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
}
