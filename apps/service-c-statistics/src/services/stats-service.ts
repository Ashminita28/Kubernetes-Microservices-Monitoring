import { redis } from '@all/shared';

export const getStats = async () => {
  const queueLength = await redis.llen('job_queue');
  const keys = await redis.keys('job:*');

  const totalJobSubmitted = keys.length;
  let totalJobsCompleted = 0;
  let totalDuration = 0;

  for (const key of keys) {
    const job = (await redis.hgetall(key)) as Record<string, unknown>;
    if (job.status === 'completed') {
      totalJobsCompleted++;
      totalDuration += Number(job.duration || 0);
    }
  }

  const avgtime =
    totalJobsCompleted > 0 ? totalDuration / totalJobsCompleted : 0;

  return {
    totalJobSubmitted,
    totalJobsCompleted,
    queueLength,
    averageProcessingTime: avgtime,
  };
};
