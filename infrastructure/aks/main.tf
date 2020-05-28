terraform {
  required_version = ">= 0.12"
}

provider "azurerm" {
  version         = "=2.4.0"
  subscription_id = var.subscription_id
  client_id       = var.client_id
  client_secret   = var.client_secret
  tenant_id       = var.tenant_id

  features {}
}

# Resource Group
resource azurerm_resource_group app_resources {
  name     = var.resource_group_name
  location = var.resource_group_location
}

# Logging
module logging {
  source              = "../modules/logs"
  resource_group_name = azurerm_resource_group.app_resources.name
}

# Cluster
module cluster {
  source                     = "../modules/cluster"
  resource_group_name        = azurerm_resource_group.app_resources.name
  resource_group_location    = azurerm_resource_group.app_resources.location
  log_analytics_workspace_id = module.logging.id
  client_id                  = var.client_id
  client_secret              = var.client_secret
}

# Load Balancer
module load_balancer {
  source   = "../modules/loadBalancer"
  name     = "azure-api-lb"
  selector = var.selector
}

# React App
module app {
  source   = "../modules/deployment"
  name     = "react-app"
  selector = var.selector
  image    = "patemery/docker-cra"
  replicas = 2
  port     = 80
}
