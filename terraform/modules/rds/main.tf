# Security group for RDS
resource "aws_security_group" "rds" {
  name        = "${var.app_name}-${var.environment}-rds-sg"
  description = "Security group for RDS instance"
  vpc_id      = var.vpc_id
  
  # Allow MySQL/MariaDB connections from application instances
  ingress {
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    description = "Allow MySQL connections"
    cidr_blocks = ["10.0.0.0/16"]  # VPC CIDR range
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = {
    Name = "${var.app_name}-${var.environment}-rds-sg"
  }
}

# RDS subnet group
resource "aws_db_subnet_group" "main" {
  name       = "${var.app_name}-${var.environment}-db-subnet"
  subnet_ids = var.private_subnets
  
  tags = {
    Name = "${var.app_name}-${var.environment}-db-subnet-group"
  }
}

# Generate a random password if one isn't provided
resource "random_password" "db_password" {
  length           = 16
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

# Store the password in SSM Parameter Store
resource "aws_ssm_parameter" "db_password" {
  name        = "/${var.app_name}/${var.environment}/db-password"
  description = "Database password for ${var.db_name}"
  type        = "SecureString"
  value       = var.db_password != null ? var.db_password : random_password.db_password.result
}

# RDS instance
resource "aws_db_instance" "main" {
  identifier              = "${var.app_name}-${var.environment}-db"
  allocated_storage       = var.db_allocated_storage
  storage_type            = "gp2"
  engine                  = "mysql"
  engine_version          = "8.0"
  instance_class          = var.db_instance_class
  db_name                 = var.db_name
  username                = var.db_username
  password                = var.db_password != null ? var.db_password : random_password.db_password.result
  db_subnet_group_name    = aws_db_subnet_group.main.name
  vpc_security_group_ids  = [aws_security_group.rds.id]
  skip_final_snapshot     = true
  backup_retention_period = 7
  storage_encrypted       = true
  
  tags = {
    Name = "${var.app_name}-${var.environment}-rds"
  }
}
