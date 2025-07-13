#!/bin/bash

# DevOps Learning Environment Service Restart Script
echo "🔄 Service Restart Utility"

# Available services
services=("mysql" "redis" "grafana" "prometheus" "pushgateway" "opensearch" "superset" "testing-web-client" "testing-web-server" "all")

# Function to restart a specific service
restart_service() {
    local service=$1
    echo "🔄 Restarting $service..."
    docker compose restart $service
    echo "✅ $service restarted successfully!"
}

# Show menu if no arguments provided
if [ $# -eq 0 ]; then
    echo "Please select a service to restart:"
    for i in "${!services[@]}"; do
        echo "  $((i+1)). ${services[$i]}"
    done
    read -p "Enter the number of the service to restart: " choice
    service_index=$((choice-1))
    
    if [ $service_index -ge 0 ] && [ $service_index -lt ${#services[@]} ]; then
        service=${services[$service_index]}
    else
        echo "❌ Invalid selection."
        exit 1
    fi
else
    service=$1
fi

# Check if the service is valid
if [[ ! " ${services[*]} " =~ " ${service} " ]]; then
    echo "❌ Invalid service: $service"
    echo "Available services: ${services[*]}"
    exit 1
fi

# Restart the selected service or all services
if [ "$service" = "all" ]; then
    echo "🔄 Restarting all services..."
    docker compose restart
    echo "✅ All services restarted successfully!"
else
    restart_service $service
fi
