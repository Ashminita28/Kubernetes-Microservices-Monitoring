import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import { startWorker, stopWorker } from './workers/job-worker';
import { redis } from '@all/shared';
import { logger } from '@all/shared';
import type { Server } from 'http';

const PORT = Number(process.env.PORT) || 9100;

let metricsServer: Server | null = null;
let isShuttingDown = false;

const startApp = async () => {
  try {
    metricsServer = app.listen(PORT, () => {
      logger.info(`Metrics server running on port ${PORT}`);
    });

    startWorker();
    logger.info('Worker started successfully');
  } catch (error) {
    logger.error({ err: error }, 'Failed to start app:');
    process.exit(1);
  }
};

const shutdown = async (signal: string) => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logger.info(`Received ${signal}, shutting down...`);
  stopWorker();

  if (metricsServer)
    metricsServer.close(() => logger.info('Metrics server closed'));

  await redis.quit();
  logger.info('Redis connection closed');
  process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

startApp();
