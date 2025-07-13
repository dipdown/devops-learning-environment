output "vpc_id" {
  description = "ID of the created VPC"
  value       = module.vpc.vpc_id
}

output "web_instance_public_ip" {
  description = "Public IP address of the web instance"
  value       = module.ec2.web_instance_public_ip
}

output "app_instance_private_ip" {
  description = "Private IP address of the application instance"
  value       = module.ec2.app_instance_private_ip
}

output "rds_endpoint" {
  description = "Endpoint of the RDS instance"
  value       = module.rds.db_instance_endpoint
}

output "cloudwatch_alarm_topic" {
  description = "ARN of the CloudWatch alarm SNS topic"
  value       = module.monitoring.alarm_topic_arn
}
