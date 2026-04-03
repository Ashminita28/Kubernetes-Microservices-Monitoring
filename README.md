# Kubernetes Microservices Monitoring Assignment

## Project Description

This project demonstrates a microservices-based Node.js system deployed on Kubernetes, designed for scalable, observable, and resilient job processing. The architecture consists of three main services:

- **Service A (Job Submitter/API Gateway):** Receives job submissions from clients via REST API, pushes jobs into a Redis queue, and returns job IDs for tracking.
- **Service B (Worker):** Scalable worker service that consumes jobs from Redis, performs CPU-intensive computations and stores results back in Redis.
- **Service C (Stats/Aggregator):** Aggregates job statistics and queue length from Redis, exposes stats via REST API, and provides Prometheus metrics for monitoring overall system health and throughput.

## DEPLOYMENTS STEPS

1. Start Minikube
   minikube start

2. Build Docker images for all services:
   docker build -t service-a-job-submitter:latest ./service-a-job-submitter
   docker build -t service-b-worker:latest ./service-b-worker
   docker build -t service-c-stats:latest ./service-c-stats

3. Apply Kubernetes manifests:
   kubectl apply -f k8s/

4. Install Prometheus & Grafana:
   helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
   helm install monitoring prometheus-community/kube-prometheus-stack --namespace monitoring --create-namespace

5. Port-forward Grafana:
   kubectl port-forward svc/monitoring-grafana 3000:80 -n monitoring
   Access Grafana at http://localhost:3000
