#!/bin/bash
# Example script to push metrics to Pushgateway

# Define the endpoint
PUSHGATEWAY_ENDPOINT="http://localhost:9091"

# Push some example metrics
echo "Pushing sample metrics to Pushgateway..."

# Example 1: Push a simple counter
echo "job_name_example_counter 42" | curl --data-binary @- ${PUSHGATEWAY_ENDPOINT}/metrics/job/example_job/instance/example_instance

# Example 2: Push multiple metrics
cat <<EOF | curl --data-binary @- ${PUSHGATEWAY_ENDPOINT}/metrics/job/batch_job/instance/batch_processor
# TYPE batch_job_processed_total counter
batch_job_processed_total{status="success"} 100
batch_job_processed_total{status="error"} 5
# TYPE batch_job_duration_seconds gauge
batch_job_duration_seconds 123.5
EOF

echo "Metrics successfully pushed to Pushgateway"
