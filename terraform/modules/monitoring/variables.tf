variable "app_name" {
  description = "Name of the application"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, test, prod)"
  type        = string
}

variable "instance_ids" {
  description = "List of EC2 instance IDs to monitor"
  type        = list(string)
}

variable "rds_instance" {
  description = "RDS instance ID to monitor"
  type        = string
}

variable "alarm_email" {
  description = "Email address to send alarm notifications to"
  type        = string
  default     = "admin@example.com"
}
