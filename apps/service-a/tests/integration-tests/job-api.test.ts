import request from 'supertest';
import app from '../../src/app';
import { JobService } from '../../src/services/job-service';
import { Request, Response, NextFunction } from 'express';
import { jobSchema } from '../../src/validations/job-schema';

// mocked job service
jest.mock('../../src/services/job-service');

// mocked redis,logger,constant,limiter functions
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
  limiter: (req: Request, res: Response, next: NextFunction) => next(),
}));

// mocked validation data
jest.mock('../../src/validations/job-schema', () => ({
  jobSchema: {
    safeParse: jest.fn(() => ({
      success: true,
      data: { name: 'test' },
    })),
  },
}));

// group all test related to api & controller
describe('job api', () => {
  // test 1- check job creation
  it('should created job', async () => {
    (JobService.submitJob as jest.Mock).mockResolvedValue('job_67676');
    const res = await request(app)
      .post('/api/submit')
      .send({ title: 'job test' });
    expect(res.statusCode).toBe(202);
    expect(res.body.id).toBe('job_67676');
  });

  // test 2- check job data validation
  it('should fail validation', async () => {
    const mockedParse = jobSchema.safeParse as unknown as jest.Mock;

    mockedParse.mockReturnValueOnce({
      success: false,
    });
    const res = await request(app).post('/api/submit').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Invalid job data');
  });

  // test 3- check job status fetching data
  it('should get status of job', async () => {
    (JobService.fetchJobStatus as jest.Mock).mockResolvedValue({
      status: 'queued',
    });
    const res = await request(app).get('/api/status/job_67676');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('queued');
  });

  // test 4- check no job found
  it('should retur not ound when job not there', async () => {
    (JobService.fetchJobStatus as jest.Mock).mockResolvedValue({});
    const res = await request(app).get('/api/status/job_67676');
    expect(res.statusCode).toBe(404);
  });
});
