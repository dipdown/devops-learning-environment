#!/bin/bash

# Auto update OpenSearch metrics every 30 seconds
while true; do
    /Users/macbook/DOITPAY/devops-learning-environment/push-opensearch-metrics.sh
    sleep 30
done
