resource "aws_vpc_endpoint" "ecr_api" {
  count = var.enable_vpc_endpoints ? 1 : 0
  vpc_id = aws_vpc.main.id
  service_name = "com.amazonaws.${data.aws_region.current.region}.ecr.api"
  vpc_endpoint_type = "Interface"
  subnet_ids = aws_subnet.private[*].id
  security_group_ids = [
    var.vpc_endpoint_security_group_id
  ]
  private_dns_enabled = true
  tags = {
    Name = "${var.environment}-ecr-api-endpoint"
  }
}

resource "aws_vpc_endpoint" "ecr_dkr" {
  count = var.enable_vpc_endpoints ? 1 : 0
  vpc_id = aws_vpc.main.id
  service_name = "com.amazonaws.${data.aws_region.current.region}.ecr.dkr"
  vpc_endpoint_type = "Interface"
  subnet_ids = aws_subnet.private[*].id
  security_group_ids = [
    var.vpc_endpoint_security_group_id
  ]
  private_dns_enabled = true
  tags = {
    Name = "${var.environment}-ecr-dkr-endpoint"
  }
}