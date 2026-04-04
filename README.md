# Kubernetes Microservices Monitoring Assignment

## Project Description

This project demonstrates a microservices-based Node.js system deployed on Kubernetes, designed for scalable, observable, and resilient job processing. The architecture consists of three main services:

- **Service A (Job Submitter/API Gateway):** Receives job submissions from clients via REST API, pushes jobs into a Redis queue, and returns job IDs for tracking.
- **Service B (Worker):** Scalable worker service that consumes jobs from Redis, performs CPU-intensive computations and stores results back in Redis.
- **Service C (Stats/Aggregator):** Aggregates job statistics and queue length from Redis, exposes stats via REST API, and provides Prometheus metrics for monitoring overall system health and throughput.

## Prerequisites

Make sure you have these installed:

- Docker
- Minikube
- kubectl
- Helm

## DEPLOYMENTS STEPS

### Step 1 — Start Minikube

```bash
minikube start
minikube addons enable ingress
minikube addons enable metrics-server
```

### Step 2 — Point Docker to Minikube

```bash
minikube docker-env | Invoke-Expression
```

### Step 3 — Build Docker Images

```bash
docker build -t service-a -f apps/service-a/Dockerfile .
docker build -t service-b -f apps/service-b/Dockerfile .
docker build -t service-c-statistics -f apps/service-c-statistics/Dockerfile .
```

### Step 4 — Deploy Everything to Kubernetes

```bash
kubectl apply -f k8s/
```

Check everything is running:

```bash
kubectl get pods
```

### Step 5 — Install Prometheus & Grafana

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack
```

### Step 6 — Start Minikube Tunnel (keep this terminal open)

```bash
minikube tunnel
```

## Stress Testing

### Install Apache Benchmark

```bash
choco install apache-httpd
```

### Create job file

```bash
echo '{"type":0,"payload":{"name":"stress"}}' > job.json
```

Job types:

- `0` → calculate prime numbers
- `1` → bcrypt hashing
- `2` → generate and sort array

### Run stress test

```bash
ab -n 5000 -c 200 -T "application/json" -p job.json http://127.0.0.1/api/submit
```

### Watch scaling happen (open new terminals)

```bash
# watch pods scale up
kubectl get pods -l app=service-b -w

# watch HPA
kubectl describe hpa service-b-hpa
```

---
