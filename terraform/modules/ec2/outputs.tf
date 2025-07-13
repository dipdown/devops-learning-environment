output "instance_ids" {
  description = "IDs of the created EC2 instances"
  value       = [aws_instance.web.id, aws_instance.app.id]
}

output "web_instance_public_ip" {
  description = "Public IP address of the web instance"
  value       = aws_instance.web.public_ip
}

output "app_instance_private_ip" {
  description = "Private IP address of the application instance"
  value       = aws_instance.app.private_ip
}
