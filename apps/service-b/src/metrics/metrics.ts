import client from 'prom-client';

export const totalJobProcessed = new client.Counter({
  name: 'jobs_processed_total',
  help: 'Number of jobs processed',
});

export const totalJobErrors = new client.Counter({
  name: 'job_errors_total',
  help: 'Number of jobs failed',
});

export const jobProcessingTimeSeconds = new client.Histogram({
  name: 'job_processing_time_seconds',
  help: 'Time taken to process jobs',
  buckets: [0.1, 0.5, 1, 2, 5, 10],
});

export function addProcessingTime(duration: number) {
  jobProcessingTimeSeconds.observe(duration);
}

export function incrementJobsProcessed() {
  totalJobProcessed.inc();
}

export function incrementJobErrors() {
  totalJobErrors.inc();
}
