import { getStats } from '../../src/services/stats-service';
import { redis } from '@all/shared';

//mocked redis,constant functions
jest.mock('@all/shared', () => ({
  redis: {
    llen: jest.fn(),
    keys: jest.fn(),
    hgetall: jest.fn(),
  },
  REDIS_KEY: {
    JOB_QUEUE: 'my_queue',
  },
}));

describe('service-c-statisctis', () => {
  // testing stats function
  it('should return correct stats', async () => {
    (redis.llen as jest.Mock).mockResolvedValue(2);
    (redis.keys as jest.Mock).mockResolvedValue(['job:1', 'job:2']);
    (redis.hgetall as jest.Mock).mockImplementation(async (key: string) => {
      if (key === 'job:1') return { status: 'completed', duration: '5' };
      return { status: 'pending' };
    });

    const stats = await getStats();

    expect(stats.totalJobSubmitted).toBe(2);
    expect(stats.totalJobsCompleted).toBe(1);
    expect(stats.queueLength).toBe(2);
    expect(stats.averageProcessingTime).toBe(5);
  });
});
