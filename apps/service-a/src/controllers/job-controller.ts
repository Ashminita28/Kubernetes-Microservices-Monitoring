import { Request, Response } from 'express';
import { JobService } from '../services/job-service';
import { jobSchema, JobData } from '../validations/job-schema';
import { logger } from '@all/shared';
export const JobController = {
  async createJob(req: Request, res: Response) {
    try {
      const parseResult = jobSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          error: 'Invalid job data',
        });
      }
      const jobData: JobData = parseResult.data;
      const id = await JobService.submitJob(jobData);
      await JobService.submitJob(jobData);
      res.status(202).json({ id, message: 'job quedued' });
    } catch (error) {
      logger.error({ err: error }, 'submit error');
      res.status(500).json({ error: 'failed to submit job' });
    }
  },
  async getJobStatus(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const data = await JobService.fetchJobStatus(id as string);
      if (!data || Object.keys(data).length === 0) {
        res.status(404).json({
          error: 'Job no found',
        });
      }
      res.json(data);
    } catch (error) {
      logger.error({ err: error }, 'status error');
      res.status(500).json({ error: 'failed to fetch status' });
    }
  },
};
