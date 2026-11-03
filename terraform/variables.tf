variable "aws_region" {
  description = "AWS region for the S3 bucket."
  type        = string
  default     = "ap-south-1"
}
variable "project_name" {
  description = "Lowercase prefix for the globally unique S3 bucket name."
  type        = string
  default     = "student-task-manager"
}
variable "environment" {
  description = "Environment tag."
  type        = string
  default     = "demo"
}
