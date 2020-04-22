# Resource Group Config
variable resource_group_name {}

# Logging Config
variable log_analytics_workspace_name {
    default = "kubeLogAnalyticsWorkspace"
}

variable log_analytics_workspace_location {
    default = "eastus"
}

variable log_analytics_workspace_sku {
    default = "PerGB2018"
}