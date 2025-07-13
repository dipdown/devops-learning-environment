# Get latest Amazon Linux 2 AMI
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]
  
  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
  
  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# EC2 instance for web application
resource "aws_instance" "web" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = var.instance_type
  subnet_id              = var.public_subnets[0]
  vpc_security_group_ids = [var.security_group_id]
  key_name               = aws_key_pair.app.key_name
  user_data              = file("${path.module}/user-data.sh")
  
  root_block_device {
    volume_size = 20
    volume_type = "gp3"
    encrypted   = true
  }
  
  tags = {
    Name = "${var.app_name}-${var.environment}-web"
  }
}

# EC2 instance for application server
resource "aws_instance" "app" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = var.instance_type
  subnet_id              = var.private_subnets[0]
  vpc_security_group_ids = [var.security_group_id]
  key_name               = aws_key_pair.app.key_name
  user_data              = file("${path.module}/user-data.sh")
  
  root_block_device {
    volume_size = 20
    volume_type = "gp3"
    encrypted   = true
  }
  
  tags = {
    Name = "${var.app_name}-${var.environment}-app"
  }
}

# SSH key pair
resource "tls_private_key" "ssh" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "app" {
  key_name   = "${var.app_name}-${var.environment}-key"
  public_key = tls_private_key.ssh.public_key_openssh
}

# Store private key in SSM Parameter Store
resource "aws_ssm_parameter" "ssh_key" {
  name        = "/${var.app_name}/${var.environment}/ssh-key"
  description = "SSH private key for ${var.app_name} instances"
  type        = "SecureString"
  value       = tls_private_key.ssh.private_key_pem
}
