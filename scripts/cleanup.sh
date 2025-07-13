#!/bin/bash

# DevOps Learning Environment Cleanup Script
echo "🧹 Cleaning up DevOps Learning Environment..."

# Ask for confirmation
read -p "⚠️  This will remove all containers, volumes, and networks. Are you sure? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cleanup aborted."
    exit 1
fi

# Stop all containers
echo "🛑 Stopping all containers..."
docker compose down

# Remove all containers, networks, and volumes
echo "🗑️  Removing containers, networks, and volumes..."
docker compose down -v

# Remove dangling images
echo "🗑️  Removing dangling images..."
docker image prune -f

# Clean up temporary files
echo "🗑️  Cleaning up temporary files..."
find . -name "*.tmp" -type f -delete

echo "✅ Cleanup completed successfully!"
