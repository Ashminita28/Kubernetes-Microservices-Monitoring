import { JobData } from '../validations/job-schema';
import { logger, redis } from '@all/shared';
import { generateJobId } from '../utils/jobId';
export const JobService = {
  async submitJob(job: JobData): Promise<string> {
    const jobId = generateJobId();

    await redis.lpush('job_queue', jobId);
    await redis.hset(`job:${jobId}`, {
      status: 'queued',
      data: JSON.stringify(job),
    });
    logger.info(`Job submitted: ${jobId}`);
    return jobId;
  },
  async fetchJobStatus(id: string): Promise<Record<string, string>> {
    return redis.hgetall(`job:${id}`);
  },
};
