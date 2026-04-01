import { Request, Response } from 'express';
import { JobService } from '../services/job-service';
import { jobSchema, JobData } from '../validations/job-schema';
import { generateJobId } from '../utils/jobId';
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
      const id = generateJobId();
      await JobService.submitJob(jobData);
      res.status(202).json({ id, message: 'job quedued' });
    } catch (error) {
      console.error('submit error', error);
      res.status(500).json({ error: 'failed to submit job' });
    }
  },
  async getJobStatus(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const data = await JobService.fetchJobStatus(id as string);
      res.json(data);
    } catch (error) {
      console.error('status error', error);
      res.status(500).json({ error: 'failed to fetch status' });
    }
  },
};
