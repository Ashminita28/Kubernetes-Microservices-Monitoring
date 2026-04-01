import express, { Express } from 'express';
import metricsRouter from './routes/metrics-route';
const app: Express = express();

app.use(metricsRouter);

export default app;
