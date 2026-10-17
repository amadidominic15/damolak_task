# damolak_task
# ShopLite: EKS Microservices DevOps Challenge

A browser-accessible demo with a frontend and two independent Node.js APIs. Includes Docker, non-root containers, Kubernetes manifests, Terraform for AWS infrastructure, GitHub Actions CI/CD using GitHub OIDC, ECR, and CloudWatch logging guidance.

## Architecture

Browser → AWS Network Load Balancer → Nginx frontend → Catalog API / Orders API. GitHub Actions tests and scans code, builds immutable SHA-tagged images, pushes them to ECR, and deploys to EKS. Terraform creates a VPC, public/private subnets, one NAT gateway, EKS, managed nodes, ECR repositories, and a restricted GitHub OIDC deployment role.

## Run locally first

Requirements: Docker Engine and Docker Compose.

```bash
docker compose up --build
```

Open **http://localhost:8080**. The dashboard lists products and sample orders and lets you submit a demo order. Press Ctrl+C to stop; `docker compose down` cleans up containers.

## Deploy to AWS

> AWS resources cost money. The sample uses EKS managed nodes and a NAT Gateway, which can be significant. Review `terraform plan`, region availability, quotas, and pricing before applying. Never commit state files or credentials.

1. Create a GitHub repository and push this folder to its `main` branch.
2. Copy `terraform/terraform.tfvars.example` to `terraform/terraform.tfvars`; set `github_owner` and `github_repo` accurately. Defaults use `eu-north-1`; change region/version if needed and supported by EKS.
3. Run:

   ```bash
   cd terraform
   terraform init
   terraform fmt -recursive
   terraform validate
   terraform plan
   terraform apply
   ```

4. Set these GitHub Actions **Variables** in Settings → Secrets and variables → Actions:
   - `AWS_REGION`: same as Terraform `aws_region`
   - `EKS_CLUSTER_NAME`: Terraform output `cluster_name`
   - `ECR_REGISTRY`: Terraform output `ecr_registry`
   - `AWS_ROLE_ARN`: Terraform output `github_actions_role_arn`
5. Push a commit to `main`. GitHub Actions runs tests and Trivy scans on PRs; on pushes to `main`, it builds/pushes images and deploys to EKS.
6. Find the browser URL:

   ```bash
   aws eks update-kubeconfig --region <region> --name <cluster-name>
   kubectl get svc frontend -n shoplite
   kubectl get pods -n shoplite
   ```

   Wait for the `frontend` Service `EXTERNAL-IP`/hostname to appear, then open `http://<hostname>` in a browser. The NLB uses the standard Kubernetes AWS service integration (instance targets) and HTTP for this demo; add TLS and HTTPS before production use.

## Non-root controls

- Node APIs run as UID/GID 10001.
- Frontend uses the official unprivileged Nginx image, port 8080, UID/GID 101.
- Kubernetes sets `runAsNonRoot`, `allowPrivilegeEscalation: false`, `readOnlyRootFilesystem: true`, drops all Linux capabilities, uses `RuntimeDefault` seccomp, disables service-account token mounting, sets CPU/memory requests/limits, and defines readiness/liveness probes.
- Namespace enables Kubernetes Pod Security `restricted` enforcement.

## Monitoring

Container stdout/stderr is available through `kubectl logs`. For managed metrics/log aggregation, enable Amazon CloudWatch Observability EKS add-on or CloudWatch Container Insights and configure retention/alarms. Those resources are not silently created by this starter; add them based on your account requirements.

## Limitations / production follow-ups

- Demo APIs use static/in-memory data and do not persist orders or implement authentication.
- HTTP-only public NLB; use TLS, DNS, WAF/edge controls as appropriate.
- Terraform state is local. For a team, configure encrypted/versioned S3 remote state and locking before shared use.
- The GitHub deployment role has cluster-admin access scoped to the exact repository and main branch for straightforward challenge deployment. A production implementation should use least-privilege Kubernetes RBAC, GitHub Environment approvals, protected branches, pinned third-party Actions by full commit SHA, image signing, SBOMs, policy checks, and separated infrastructure/application roles.
- The GitHub OIDC provider is account-wide. If one already exists, import/reuse it rather than creating a duplicate.
- The sample has not been applied to your AWS account; run `terraform validate` and inspect the plan in your environment.
