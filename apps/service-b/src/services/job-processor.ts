import { redis } from '@all/shared';
import { logger } from '@all/shared';
import bcrypt from 'bcrypt';
import { calculatePrimes, generateAndSortArray } from './tasks';
import {
  addProcessingTime,
  incrementJobErrors,
  incrementJobsProcessed,
} from '../metrics/metrics';

export const processJob = async (jobId: string) => {
  try {
    const job = await redis.hgetall(`job:${jobId}`);
    if (!jobId) {
      logger.warn(`Job ${jobId} not found`);
      return;
    }

    await redis.hset(`job:${jobId}`, {
      status: 'processing',
    });

    logger.info(`Job ${jobId} is processing`);

    const jobData = JSON.parse(job.data);
    const jobType = jobData.type || Math.floor(Math.random() * 3);
    let result: unknown;
    const start = Date.now();
    if (jobType === 0) {
      result = calculatePrimes(100000);
    } else if (jobType === 1) {
      result = await bcrypt.hash('password', 10);
    } else {
      result = generateAndSortArray(100000);
    }
    const duration = (Date.now() - start) / 1000;
    addProcessingTime(duration);
    incrementJobsProcessed();

    await redis.hset(`job:${jobId}`, {
      status: 'completed',
      result: JSON.stringify(result),
      duration,
    });
    logger.info(`Job ${jobId} completed successfully in ${duration}`);
  } catch (error) {
    logger.error(error);
    incrementJobErrors();

    await redis.hset(`job:${jobId}`, {
      status: 'failed',
    });
  }
};
