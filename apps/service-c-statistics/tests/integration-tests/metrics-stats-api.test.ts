import request from 'supertest';
import app from '../../src/app';
import { NextFunction, Request, Response } from 'express';
import * as metrics from '../../src/metrics/metrics';
import { redis } from '@all/shared';

jest.mock('@all/shared', () => ({
  limiter: (req: Request, res: Response, next: NextFunction) => next(),
  redis: {
    llen: jest.fn(),
    keys: jest.fn(),
    hgetall: jest.fn(),
  },
  REDIS_KEY: { JOB_QUEUE: 'my_queue' },
  logger: { error: jest.fn(), info: jest.fn() },
}));

// aded pre register metrics to avoid empty /metrics
beforeAll(() => {
  metrics.totalJobsSubmitted.set(0);
  metrics.totalJobsCompleted.set(0);
  metrics.queueLengthGauge.set(0);
});

describe('service-c-statistics api ', () => {
  //test health api
  it('should return health', async () => {
    const res = await request(app).get('/health');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('OK');
  });

  // test stats api
  it('should return sats', async () => {
    (redis.llen as jest.Mock).mockResolvedValue(1);
    (redis.keys as jest.Mock).mockResolvedValue(['job:1']);
    (redis.hgetall as jest.Mock).mockResolvedValue({
      status: 'completed',
      duration: '10',
    });

    const res = await request(app).get('/stats');

    expect(res.statusCode).toBe(200);
    expect(res.body.totalJobSubmitted).toBe(1);
    expect(res.body.totalJobsCompleted).toBe(1);
    expect(res.body.queueLength).toBe(1);
    expect(res.body.averageProcessingTime).toBe(10);
  });

  // test metrics api
  it('should return metrics', async () => {
    const res = await request(app).get('/metrics');

    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('total_jobs_submitted');
    expect(res.text).toContain('total_jobs_completed');
    expect(res.text).toContain('queue_length');
  });
});
