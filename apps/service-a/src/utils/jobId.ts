export const generateJobId = (): string => {
  return `job_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};
