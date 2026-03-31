import { Router } from 'express';
import { JobController } from '../controllers/job-controller';

const jobRouter: Router = Router();

jobRouter.post('/submit', JobController.createJob);
jobRouter.get('/status/:id', JobController.getJobStatus);
export default jobRouter;
