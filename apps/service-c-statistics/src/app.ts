import express, { Express, Request, Response } from 'express';
import { metricsRouter } from './routes/metrics-route';
import { statsRouter } from './routes/stats-route';
import helmet from 'helmet';
import morgan from 'morgan';
import { limiter } from '@all/shared';

const app: Express = express();
app.use(helmet());
app.use(limiter);
app.use(morgan('dev'));
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    service: 'service-c-statistics-service',
    currentTime: `${new Date().toISOString()}`,
  });
});
app.use(metricsRouter);
app.use(statsRouter);

export default app;
