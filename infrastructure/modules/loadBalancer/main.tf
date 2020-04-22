resource kubernetes_service load_balancer {
  metadata {
    name = var.name
    labels = {
      selector = var.selector
    }
  }
  spec {
    selector = {
       selector = var.selector
    }
    session_affinity = "ClientIP"
    port {
      port        = 80
      target_port = 80
    }

    type = "LoadBalancer"
  }
}