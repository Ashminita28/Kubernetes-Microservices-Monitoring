import express, { Express } from 'express';
import { metricsRouter } from './routes/metrics-route';
import { statsRouter } from './routes/stats-route';
const app: Express = express();

app.use(metricsRouter);
app.use(statsRouter);

export default app;
