output "alarm_topic_arn" {
  description = "ARN of the SNS topic for alarms"
  value       = aws_sns_topic.alerts.arn
}

output "cpu_alarms" {
  description = "IDs of the CPU utilization alarms"
  value       = aws_cloudwatch_metric_alarm.cpu_utilization[*].id
}

output "memory_alarms" {
  description = "IDs of the memory usage alarms"
  value       = aws_cloudwatch_metric_alarm.memory_usage[*].id
}

output "rds_cpu_alarm" {
  description = "ID of the RDS CPU utilization alarm"
  value       = aws_cloudwatch_metric_alarm.rds_cpu.id
}
