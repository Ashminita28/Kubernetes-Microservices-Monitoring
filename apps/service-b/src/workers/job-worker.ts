import { redis } from '@all/shared';
import { processJob } from '../services/job-processor';
import { logger } from '@all/shared';

let isRunning = true;

export const stopWorker = () => {
  isRunning = false;
};

export const startWorker = async () => {
  logger.info('Worker started');

  while (isRunning) {
    try {
      const result = await redis.brpop('job_queue', 0);
      if (!result) continue;

      const jobId = result[1];

      logger.info(`Processing job:${jobId}`);
      await processJob(jobId);
    } catch (error) {
      logger.error(error);
    }
  }
  logger.info('Worker stopped');
};
