import { processJob } from '../../src/services/job-processor';
import { redis } from '@all/shared';
import * as metrics from '../../src/metrics/metrics';
import bcrypt from 'bcrypt';

jest.mock('@all/shared', () => ({
  redis: {
    hgetall: jest.fn(),
    hset: jest.fn(),
  },
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

jest.mock('../../src/metrics/metrics', () => ({
  addProcessingTime: jest.fn(),
  incrementJobsProcessed: jest.fn(),
  incrementJobErrors: jest.fn(),
}));

describe('job processor', () => {
  //  testing job processing
  it('should process job successfully', async () => {
    (redis.hgetall as jest.Mock).mockResolvedValue({
      data: JSON.stringify({ type: 1 }),
    });

    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');

    await processJob('job_1');

    expect(redis.hset).toHaveBeenCalled();
    expect(metrics.incrementJobsProcessed).toHaveBeenCalled();
  });

  //   testing job fail
  it('should mark job failed if no data', async () => {
    (redis.hgetall as jest.Mock).mockResolvedValue({});

    await processJob('job_2');

    expect(redis.hset).not.toHaveBeenCalledWith(
      'job:job_2',
      expect.objectContaining({ status: 'completed' })
    );
  });

  //   testing total job errors
  it('should handle error', async () => {
    (redis.hgetall as jest.Mock).mockRejectedValue(new Error('fail'));

    await processJob('job_3');

    expect(metrics.incrementJobErrors).toHaveBeenCalled();
  });
});
