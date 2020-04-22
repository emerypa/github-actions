resource random_id log_analytics_workspace_name_suffix {
  byte_length = 8
}

resource azurerm_log_analytics_workspace analytics {
    name                = format("%s-%s", var.log_analytics_workspace_name, random_id.log_analytics_workspace_name_suffix.dec)
    location            = var.log_analytics_workspace_location
    resource_group_name = var.resource_group_name
    sku                 = var.log_analytics_workspace_sku
}

resource azurerm_log_analytics_solution logs {
    solution_name         = "ContainerInsights"
    location              = azurerm_log_analytics_workspace.analytics.location
    resource_group_name   = var.resource_group_name
    workspace_resource_id = azurerm_log_analytics_workspace.analytics.id
    workspace_name        = azurerm_log_analytics_workspace.analytics.name

    plan {
        publisher = "Microsoft"
        product   = "OMSGallery/ContainerInsights"
    }
}