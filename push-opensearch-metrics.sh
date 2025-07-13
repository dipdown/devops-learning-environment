#!/bin/bash

# Script to push OpenSearch health metrics to Pushgateway
# This creates a dummy 'up' metric for OpenSearch service

PUSHGATEWAY_URL="http://localhost:9091"
OPENSEARCH_URL="http://localhost:9200"

# Check if OpenSearch is reachable
if curl -s -f "$OPENSEARCH_URL" > /dev/null 2>&1; then
    # OpenSearch is UP
    echo "up{job=\"opensearch\",instance=\"opensearch:9200\"} 1" | curl --data-binary @- "$PUSHGATEWAY_URL/metrics/job/opensearch"
    echo "OpenSearch is UP - metric pushed to Pushgateway"
else
    # OpenSearch is DOWN
    echo "up{job=\"opensearch\",instance=\"opensearch:9200\"} 0" | curl --data-binary @- "$PUSHGATEWAY_URL/metrics/job/opensearch"
    echo "OpenSearch is DOWN - metric pushed to Pushgateway"
fi
