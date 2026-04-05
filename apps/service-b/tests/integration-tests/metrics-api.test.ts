import request from 'supertest';
import app from '../../src/app';
import { NextFunction, Request, Response } from 'express';
import client from 'prom-client';
import * as metrics from '../../src/metrics/metrics';

jest.mock('@all/shared', () => ({
  limiter: (req: Request, res: Response, next: NextFunction) => next(),
  logger: {
    error: jest.fn(),
    info: jest.fn(),
  },
}));

// added pre register metrics to avoid empty /metrics
beforeAll(() => {
  client.register.clear();

  client.register.registerMetric(metrics.totalJobProcessed);
  client.register.registerMetric(metrics.totalJobErrors);
  client.register.registerMetric(metrics.jobProcessingTimeSeconds);
});

describe('service-b apis', () => {
  // testing health api
  it('should return health', async () => {
    const res = await request(app).get('/health');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('OK');
  });

  //   testing metrics api
  it('should return metrics', async () => {
    const res = await request(app).get('/metrics');

    expect(res.statusCode).toBe(200);

    expect(res.text).toContain('jobs_processed_total');
    expect(res.text).toContain('job_errors_total');
    expect(res.text).toContain('job_processing_time_seconds');
  });
});
