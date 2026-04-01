import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import { logger } from '@all/shared';

const PORT = Number(process.env.PORT) || 3000;
const start = async () => {
  app.listen(PORT, () => {
    logger.info('job submitter service started at port 3000');
  });
};

start();
