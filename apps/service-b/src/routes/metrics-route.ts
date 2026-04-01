import { Router } from 'express';
import { setupMetricsServer } from '../controllers/metrics-controller';

const metricsRouter: Router = Router();

metricsRouter.get('/metrics', setupMetricsServer);

export default metricsRouter;
