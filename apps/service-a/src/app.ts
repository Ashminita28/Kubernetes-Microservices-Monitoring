import express, { Express } from 'express';
import jobRouter from './routes/job-route';

const app: Express = express();
app.use(express.json());

app.use('/api', jobRouter);
export default app;
