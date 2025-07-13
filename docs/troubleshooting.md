# Troubleshooting Guide

This guide helps resolve common issues in the DevOps Learning Environment.

## General Issues

### 1. Docker Compose fails to start services

**Problem**: When running `docker compose up -d`, some services fail to start.

**Solution**:
- Check if required ports are already in use:
  ```bash
  lsof -i :<port_number>
  ```
- Ensure Docker has enough resources (memory/CPU)
- Check individual service logs:
  ```bash
  docker compose logs <service_name>
  ```

### 2. Permission Issues with OpenSearch

**Problem**: OpenSearch fails with permission errors.

**Solution**:
- Set proper permissions:
  ```bash
  chmod 777 opensearch/data
  ```
- Or run as a specific user:
  ```bash
  sudo chown -R 1000:1000 opensearch/data
  ```

### 3. Services Failing Health Checks

**Problem**: Services show as unhealthy.

**Solution**:
- Check service logs:
  ```bash
  docker compose logs --tail=100 <service_name>
  ```
- Increase health check thresholds in docker-compose.yml
- Ensure enough resources are available

## MySQL Issues

### 1. MySQL Connection Refused

**Problem**: Can't connect to MySQL from other services.

**Solution**:
- Verify MySQL is running:
  ```bash
  docker compose ps mysql
  ```
- Check MySQL logs:
  ```bash
  docker compose logs mysql
  ```
- Ensure the credentials in .env match what services are using
- Verify network connectivity:
  ```bash
  docker compose exec <service_name> ping mysql
  ```

### 2. Database Not Created

**Problem**: The devops_app database doesn't exist.

**Solution**:
- Check MySQL initialization logs:
  ```bash
  docker compose logs mysql
  ```
- Manually create the database and tables:
  ```bash
  docker compose exec mysql mysql -uroot -proot -e "CREATE DATABASE IF NOT EXISTS devops_app;"
  docker compose exec mysql mysql -uroot -proot devops_app < mysql/init/01-init.sql
  ```

## Vue.js / Express.js Issues

### 1. Vue.js App Not Loading

**Problem**: Vue.js application doesn't load or shows errors.

**Solution**:
- Check client logs:
  ```bash
  docker compose logs testing-web-client
  ```
- Verify API URL configuration in .env
- Check browser console for JavaScript errors
- Rebuild the client:
  ```bash
  docker compose build --no-cache testing-web-client
  docker compose up -d testing-web-client
  ```

### 2. Express API Connection Issues

**Problem**: API returns connection errors to MySQL/Redis.

**Solution**:
- Check server logs:
  ```bash
  docker compose logs testing-web-server
  ```
- Verify database credentials in .env
- Ensure MySQL and Redis are running:
  ```bash
  docker compose ps mysql redis
  ```
- Check network connectivity:
  ```bash
  docker compose exec testing-web-server ping mysql
  docker compose exec testing-web-server ping redis
  ```

## Monitoring Issues

### 1. Grafana Can't Connect to Datasources

**Problem**: Grafana shows "Data source not found" errors.

**Solution**:
- Verify Prometheus and OpenSearch are running
- Check datasource configuration:
  ```bash
  cat grafana/provisioning/datasources/datasource.yml
  ```
- Try manually configuring datasources in Grafana UI
- Check network connectivity between containers

### 2. Prometheus Target Errors

**Problem**: Prometheus shows "target down" errors.

**Solution**:
- Check target connectivity
- Verify Prometheus configuration:
  ```bash
  cat monitoring/prometheus/prometheus.yml
  ```
- Ensure metrics endpoints are accessible
- Check individual service logs

## Reset & Cleanup

If all else fails, perform a complete reset:

```bash
# Stop all services
docker compose down

# Remove volumes
docker compose down -v

# Clean up Docker system
docker system prune -f

# Start fresh
./scripts/init.sh
```

## Getting Help

If you're still experiencing issues:

1. Check the detailed logs:
   ```bash
   docker compose logs > logs.txt
   ```

2. Examine the output of:
   ```bash
   docker ps -a
   docker volume ls
   docker network ls
   ```

3. Check system resources:
   ```bash
   docker system df
   ```
