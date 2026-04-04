# What's in this folder

Apply everything: `kubectl apply -f k8s/`

| File                                | What it does                                                                                                           |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `redis.yaml`                        | Runs Redis — stores the job queue and results                                                                          |
| `service-a.yaml`                    | api send jobs to, also has an Ingress to reach it from outside                                                         |
| `service-b.yaml`                    | worker that processes jobs. Starts with 2 pods, scales up to 10 under heavy load. HPA triggers when CPU goes above 70% |
| `service-c.yaml`                    | reads Redis and shows stats (queue length, job counts)                                                                 |
| `monitoring/service-b-monitor.yaml` | tells Prometheus to collect metrics from Service B                                                                     |
| `monitoring/service-c-monitor.yaml` | tells Prometheus to collect metrics from Service C                                                                     |
