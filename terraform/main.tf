terraform {
  required_version = ">= 1.0.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
  
  backend "s3" {
    # These values would be defined in the workspace-specific tfvars file
    # bucket         = "terraform-state-bucket"
    # key            = "devops-app/terraform.tfstate"
    # region         = "us-west-2"
    # dynamodb_table = "terraform-locks"
    # encrypt        = true
  }
}

provider "aws" {
  region = var.region
  
  default_tags {
    tags = {
      Environment = var.environment
      Project     = "DevOps Learning Environment"
      ManagedBy   = "Terraform"
    }
  }
}

# VPC and Network resources
module "vpc" {
  source = "./modules/vpc"
  
  vpc_cidr        = var.vpc_cidr
  public_subnets  = var.public_subnets
  private_subnets = var.private_subnets
  environment     = var.environment
  app_name        = var.app_name
}

# EC2 instances for application
module "ec2" {
  source = "./modules/ec2"
  
  vpc_id            = module.vpc.vpc_id
  public_subnets    = module.vpc.public_subnet_ids
  private_subnets   = module.vpc.private_subnet_ids
  instance_type     = var.instance_type
  environment       = var.environment
  app_name          = var.app_name
  security_group_id = module.vpc.security_group_id
}

# RDS Database
module "rds" {
  source = "./modules/rds"
  
  vpc_id          = module.vpc.vpc_id
  private_subnets = module.vpc.private_subnet_ids
  environment     = var.environment
  app_name        = var.app_name
}

# CloudWatch monitoring resources
module "monitoring" {
  source = "./modules/monitoring"
  
  app_name      = var.app_name
  environment   = var.environment
  instance_ids  = module.ec2.instance_ids
  rds_instance  = module.rds.db_instance_id
}
