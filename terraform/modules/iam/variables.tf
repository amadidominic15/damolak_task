variable "cluster_name" {
  description = "Name of the EKS cluster."
  type        = string
}
variable "enable_vpc_cni" {
  description = "Create IAM role for VPC CNI."
  type        = bool
  default     = true
}
variable "enable_cloudwatch" {
  description = "Create IAM role for CloudWatch Observability."
  type        = bool
  default     = false
}


