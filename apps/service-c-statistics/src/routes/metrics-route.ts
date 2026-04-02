import { Router } from 'express';
import { setupMetrics } from '../controllers/metrics-controller';

export const metricsRouter: Router = Router();

metricsRouter.get('/metrics', setupMetrics);
