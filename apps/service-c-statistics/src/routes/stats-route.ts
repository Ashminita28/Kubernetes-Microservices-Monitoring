import { Router } from 'express';
import { statsHandler } from '../controllers/stats-controller';

export const statsRouter: Router = Router();

statsRouter.get('/stats', statsHandler);
