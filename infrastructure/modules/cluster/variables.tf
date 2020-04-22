variable client_id {}
variable client_secret {}

# Resource Group Config
variable resource_group_name {}
variable resource_group_location {}

# Logging Workspace ID
variable log_analytics_workspace_id {}

# Kubernetes Config
variable agent_count {
    default = 3
}

variable ssh_public_key {
    default = "~/.ssh/id_rsa.pub"
}

variable dns_prefix {
    default = "kube"
}

variable cluster_name {
    default = "kube"
}