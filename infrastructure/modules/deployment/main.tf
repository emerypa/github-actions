resource kubernetes_deployment kube-app {
  metadata {
    name = var.name
    labels = {
      selector = var.selector
    }
  }

  spec {
    replicas = var.replicas

    selector {
      match_labels = {
        selector = var.selector
      }
    }

    template {
      metadata {
        labels = {
          selector = var.selector
        }
      }

      spec {
        container {
          image = var.image
          name  = var.selector
          port {
            container_port = var.port
          }

          resources {
            limits {
              cpu    = "0.5"
              memory = "512Mi"
            }
            requests {
              cpu    = "250m"
              memory = "50Mi"
            }
          }
        }
      }
    }
  }
}
