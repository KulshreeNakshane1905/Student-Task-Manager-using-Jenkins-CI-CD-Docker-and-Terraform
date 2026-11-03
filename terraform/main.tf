terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }
}
provider "aws" { region = var.aws_region }
resource "random_id" "suffix" { byte_length = 4 }
resource "aws_s3_bucket" "student_task_assets" {
  bucket = "${var.project_name}-${random_id.suffix.hex}"
  tags = {
    Name        = "${var.project_name}-assets"
    Project     = "Jenkins-Terraform-Mini-Project"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}
resource "aws_s3_bucket_versioning" "student_task_assets" {
  bucket = aws_s3_bucket.student_task_assets.id
  versioning_configuration { status = "Enabled" }
}
