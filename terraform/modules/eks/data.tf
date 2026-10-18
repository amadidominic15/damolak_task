data "aws_caller_identity" "current" {}
data "aws_eks_addon_version" "eks_addons" {
  for_each = var.addons
  addon_name         = each.key
  kubernetes_version = var.kubernetes_version
  most_recent        = each.value.most_recent
}

locals {
  pod_identity = {
    vpc_cni = {
      namespace       = "kube-system"
      service_account = "aws-node"
    }
    cloudwatch = {
      namespace       = "amazon-cloudwatch"
      service_account = "cloudwatch-agent"
    }
  }
}