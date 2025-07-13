#!/bin/bash

# DevOps Learning Environment Initialization Script
echo "🚀 Initializing DevOps Learning Environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Create necessary directories with proper permissions
echo "📁 Creating necessary directories..."
mkdir -p grafana/data opensearch/data prometheus/data superset/data

# Set proper permissions for directories that need it
echo "🔒 Setting proper permissions..."
chmod 777 opensearch/data

# Pull latest images
echo "🐳 Pulling latest Docker images..."
docker compose pull

# Start all services
echo "🔄 Starting all services..."
docker compose up -d

# Wait for services to be up
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
echo "🔍 Checking service health..."
docker compose ps

# Set up database schemas if needed
echo "💾 Setting up databases..."

echo "✅ DevOps Learning Environment initialized successfully!"
echo ""
echo "📊 Access points:"
echo "- Grafana: http://localhost:3000 (admin/admin)"
echo "- Vue.js App: http://localhost:8080"
echo "- Express API: http://localhost:3001"
echo "- Apache Superset: http://localhost:8088 (admin/admin)"
echo "- Prometheus: http://localhost:9090"
echo "- PushGateway: http://localhost:9091"
echo "- OpenSearch: http://localhost:9200"
echo ""
echo "📝 For more information, refer to the documentation in the docs/ directory."
