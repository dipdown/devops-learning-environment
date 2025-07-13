# Configuration Guide

This guide explains how to configure the different components of the DevOps Learning Environment.

## Environment Variables

The main configuration is done through environment variables in the `.env` file.

### Grafana

- `GRAFANA_PORT`: The port to access Grafana (default: 3000)
- `GRAFANA_ADMIN_USER`: Admin username (default: admin)
- `GRAFANA_ADMIN_PASSWORD`: Admin password (default: admin)

### MySQL

- `MYSQL_ROOT_PASSWORD`: Root password for MySQL (default: root)
- `MYSQL_DATABASE`: Default database name (default: devops_app)
- `MYSQL_PORT`: MySQL port (default: 3306)

### Redis

- `REDIS_PORT`: Redis port (default: 6379)
- `REDIS_PASSWORD`: Redis password (default: redis_password)

### OpenSearch

- `OPENSEARCH_PORT`: OpenSearch API port (default: 9200)
- `OPENSEARCH_DASHBOARD_PORT`: OpenSearch Dashboards port (default: 5601)
- `OPENSEARCH_MEMORY`: Memory allocation for OpenSearch (default: 1g)
- `DISCOVERY_TYPE`: Discovery type (default: single-node)

### Prometheus & PushGateway

- `PROMETHEUS_PORT`: Prometheus port (default: 9090)
- `PUSHGATEWAY_PORT`: PushGateway port (default: 9091)

### Apache Superset

- `SUPERSET_PORT`: Superset port (default: 8088)
- `SUPERSET_SECRET_KEY`: Secret key for Superset (default: superset_secret_key)
- `SUPERSET_ADMIN_USER`: Admin username (default: admin)
- `SUPERSET_ADMIN_PASSWORD`: Admin password (default: admin)
- `SUPERSET_ADMIN_EMAIL`: Admin email (default: admin@example.com)

### Vue.js App & Express API

- `VUE_APP_PORT`: Vue.js application port (default: 8080)
- `VUE_APP_API_URL`: API base URL (default: http://localhost:3001)
- `EXPRESS_PORT`: Express API port (default: 3001)
- `NODE_ENV`: Node environment (default: development)
- `JWT_SECRET`: Secret for JWT tokens (default: your_jwt_secret_key)
- `JWT_EXPIRY`: JWT token expiry (default: 24h)

## Service Configuration Files

### Grafana

- **Main configuration**: `grafana/grafana.ini`
- **Dashboards**: `grafana/dashboards/`
- **Datasources**: `grafana/provisioning/datasources/datasource.yml`
- **Dashboard provisioning**: `grafana/provisioning/dashboards/dashboard.yml`

### OpenSearch

- **Main configuration**: `opensearch/config/opensearch.yml`

### Prometheus

- **Main configuration**: `monitoring/prometheus/prometheus.yml`

### AlertManager

- **Main configuration**: `monitoring/alertmanager/alertmanager.yml`

### Superset

- **Main configuration**: `superset/config/superset_config.py`
- **Dependencies**: `superset/config/requirements.txt`

## Database Initialization

MySQL is initialized with sample data from:
- `mysql/init/01-init.sql`

## Adding Custom Configurations

To add custom configurations:

1. For Grafana dashboards, add JSON files to `grafana/dashboards/`
2. For Prometheus targets, edit `monitoring/prometheus/prometheus.yml`
3. For custom MySQL initialization, add SQL files to `mysql/init/`
