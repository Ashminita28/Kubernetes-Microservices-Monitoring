import express from 'express';
// import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
dotenv.config();
import { logger } from '@all/shared';
import app from './app';

app.use(express.json());

// Basic rate limiter: 100 requests per 15 minutes per IP
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100,
//   standardHeaders: true,
//   legacyHeaders: false,
// });
// app.use(limiter);

// app.use(apiKeyAuth);

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
