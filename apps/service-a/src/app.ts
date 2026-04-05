import express, { Express, Request, Response } from 'express';
import jobRouter from './routes/job-route';
import helmet from 'helmet';
import morgan from 'morgan';
import { limiter } from '@all/shared';

const app: Express = express();

app.use(helmet());
app.use(limiter);
app.use(morgan('dev'));
app.use(express.json());
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    service: 'service-a-job-submitter-service',
    currentTime: `${new Date().toISOString()}`,
  });
});

app.use('/api', jobRouter);
export default app;
