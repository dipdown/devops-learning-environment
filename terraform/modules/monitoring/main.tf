# CloudWatch SNS topic for alarms
resource "aws_sns_topic" "alerts" {
  name = "${var.app_name}-${var.environment}-alerts"
  
  tags = {
    Name = "${var.app_name}-${var.environment}-alerts"
  }
}

# SNS subscription for email notifications
resource "aws_sns_topic_subscription" "email" {
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = var.alarm_email
}

# CPU utilization alarm for EC2 instances
resource "aws_cloudwatch_metric_alarm" "cpu_utilization" {
  count               = length(var.instance_ids)
  
  alarm_name          = "${var.app_name}-${var.environment}-cpu-alarm-${count.index}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = 300
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "This alarm monitors EC2 CPU utilization"
  alarm_actions       = [aws_sns_topic.alerts.arn]
  ok_actions          = [aws_sns_topic.alerts.arn]
  
  dimensions = {
    InstanceId = var.instance_ids[count.index]
  }
  
  tags = {
    Name = "${var.app_name}-${var.environment}-cpu-alarm-${count.index}"
  }
}

# Memory usage alarm for EC2 instances
resource "aws_cloudwatch_metric_alarm" "memory_usage" {
  count               = length(var.instance_ids)
  
  alarm_name          = "${var.app_name}-${var.environment}-memory-alarm-${count.index}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "mem_used_percent"
  namespace           = "CWAgent"
  period              = 300
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "This alarm monitors EC2 memory usage"
  alarm_actions       = [aws_sns_topic.alerts.arn]
  ok_actions          = [aws_sns_topic.alerts.arn]
  
  dimensions = {
    InstanceId = var.instance_ids[count.index]
  }
  
  tags = {
    Name = "${var.app_name}-${var.environment}-memory-alarm-${count.index}"
  }
}

# RDS CPU utilization alarm
resource "aws_cloudwatch_metric_alarm" "rds_cpu" {
  alarm_name          = "${var.app_name}-${var.environment}-rds-cpu-alarm"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "CPUUtilization"
  namespace           = "AWS/RDS"
  period              = 300
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "This alarm monitors RDS CPU utilization"
  alarm_actions       = [aws_sns_topic.alerts.arn]
  ok_actions          = [aws_sns_topic.alerts.arn]
  
  dimensions = {
    DBInstanceIdentifier = var.rds_instance
  }
  
  tags = {
    Name = "${var.app_name}-${var.environment}-rds-cpu-alarm"
  }
}

# RDS free storage space alarm
resource "aws_cloudwatch_metric_alarm" "rds_storage" {
  alarm_name          = "${var.app_name}-${var.environment}-rds-storage-alarm"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = 2
  metric_name         = "FreeStorageSpace"
  namespace           = "AWS/RDS"
  period              = 300
  statistic           = "Average"
  threshold           = 5000000000  # 5GB in bytes
  alarm_description   = "This alarm monitors RDS free storage space"
  alarm_actions       = [aws_sns_topic.alerts.arn]
  ok_actions          = [aws_sns_topic.alerts.arn]
  
  dimensions = {
    DBInstanceIdentifier = var.rds_instance
  }
  
  tags = {
    Name = "${var.app_name}-${var.environment}-rds-storage-alarm"
  }
}
