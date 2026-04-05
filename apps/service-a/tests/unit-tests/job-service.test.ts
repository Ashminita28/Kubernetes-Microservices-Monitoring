import { JobService } from '../../src/services/job-service';
import { redis } from '@all/shared';

// mocked redis,logger,constant functions
jest.mock('@all/shared', () => ({
  redis: {
    lpush: jest.fn(),
    hset: jest.fn(),
    hgetall: jest.fn(),
  },
  logger: {
    info: jest.fn(),
  },
  REDIS_KEY: {
    JOB_QUEUE: 'my_queue',
  },
}));

// combined all tests related to job service
describe('job service ', () => {
  // test 1- job submission testing
  it('should subnit job', async () => {
    const job = { type: 0, payload: { name: 'prime-test' } };
    const id = await JobService.submitJob(job);
    expect(redis.lpush).toHaveBeenCalled();
    expect(redis.hset).toHaveBeenCalled();
    expect(id).toContain('job_');
  });

  // test 2- testing fetch job status
  it('should fetch job status', async () => {
    (redis.hgetall as jest.Mock).mockResolvedValue({
      status: 'queued',
    });
    const res = await JobService.fetchJobStatus('job_67676');
    expect(res.status).toBe('queued');
  });
});
