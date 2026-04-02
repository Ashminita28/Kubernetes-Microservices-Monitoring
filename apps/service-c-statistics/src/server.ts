import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { logger } from '@all/shared';
import app from './app';

app.use(express.json());

const PORT = Number(process.env.PORT) || 4000;

async function startServer() {
  try {
    app.listen(PORT, () => {
      logger.info(`Service C listening on port ${PORT}`);
    });
  } catch (err) {
    logger.error({ err: err }, 'Failed to connect to Redis:');
    process.exit(1);
  }
}

startServer();
