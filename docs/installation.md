# Installation Guide

This guide will help you set up the DevOps Learning Environment on your local machine.

## Prerequisites

- Docker and Docker Compose (v2)
- Git
- Available ports: 3000, 3306, 6379, 8080, 8088, 9090, 9091, 9200

## Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://your-repository-url/devops-learning-environment.git
   cd devops-learning-environment
   ```

2. **Run the initialization script**:
   ```bash
   ./scripts/init.sh
   ```
   
   This script will:
   - Create necessary directories
   - Set proper permissions
   - Pull Docker images
   - Start all services
   - Verify service health

3. **Access the services**:
   - Grafana: http://localhost:3000 (admin/admin)
   - Vue.js App: http://localhost:8080
   - Express API: http://localhost:3001
   - Apache Superset: http://localhost:8088 (admin/admin)
   - Prometheus: http://localhost:9090
   - PushGateway: http://localhost:9091
   - OpenSearch: http://localhost:9200

## Manual Installation

If you prefer to install manually:

1. **Make sure Docker and Docker Compose are installed**

2. **Create the necessary directory structure**:
   ```bash
   mkdir -p grafana/data opensearch/data
   chmod 777 opensearch/data
   ```

3. **Start the services**:
   ```bash
   docker compose up -d
   ```

4. **Check service status**:
   ```bash
   docker compose ps
   ```

## Next Steps

- Read the [Configuration Guide](configuration.md) to learn how to customize the environment
- Check out the [Troubleshooting Guide](troubleshooting.md) if you encounter any issues
