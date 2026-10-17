aws_region           = "eu-north-1"
environment          = "dev"
cluster_name         = "damolak"
kubernetes_version   = "1.35"
admin_principal_arns = ["arn:aws:iam::092620891680:user/admin"] #put the user arn of the user you want to have admin access to the cluster
ecr_repositories     = ["damolak"]