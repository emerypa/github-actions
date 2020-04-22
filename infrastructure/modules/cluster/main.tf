resource azurerm_kubernetes_cluster cluster  {
    name                = var.cluster_name
    location            = var.resource_group_location
    resource_group_name = var.resource_group_name
    dns_prefix          = var.dns_prefix

    linux_profile {
        admin_username = "ubuntu"

        ssh_key {
            key_data = file(var.ssh_public_key)
        }
    }

    default_node_pool {
        name            = "agentpool"
        node_count      = var.agent_count
        vm_size         = "Standard_DS1_v2"
    }

    service_principal {
        client_id     = var.client_id
        client_secret = var.client_secret
    }

    addon_profile {
        oms_agent {
          enabled                    = true
          log_analytics_workspace_id = var.log_analytics_workspace_id
        }
    }

    tags = {
        Environment = "Development"
    }
}