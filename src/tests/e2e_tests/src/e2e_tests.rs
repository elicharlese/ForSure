#[cfg(test)]
mod e2e_tests {
    use std::process::{Command, Child};
    use tokio::time::{sleep, Duration};
    use reqwest;
    use kurtosis::{KurtosisContext, KurtosisRuntime};

    // Function to start the service using Kurtosis
    async fn start_service(ctx: &mut KurtosisContext) -> Child {
        // Use your Kurtosis setup here to start the blockchain environment
        let service_id = ctx.load("path/to/kurtosis.yml").await.expect("Failed to load Kurtosis environment");
        Command::new("cargo")
            .arg("run")
            .spawn()
            .expect("Failed to start service")
    }

    // Function to stop the service using Kurtosis
    async fn stop_service(ctx: &mut KurtosisContext, child: &mut Child) {
        child.kill().expect("Failed to stop service");
        child.wait().expect("Failed to wait on child");
        ctx.unload("service_id").await.expect("Failed to unload Kurtosis environment");
    }

    // Health check function
    async fn health_check() -> Result<(), reqwest::Error> {
        let client = reqwest::Client::new();
        let response = client.get("http://localhost:8000/health")
            .send()
            .await?;

        if response.status().is_success() {
            Ok(())
        } else {
            Err(reqwest::Error::new(reqwest::StatusCode::from_u16(response.status().as_u16())?, "Health check failed"))
        }
    }

    // Test case for service health check
    #[tokio::test]
    async fn test_service_health_check() {
        let mut ctx = KurtosisContext::new().await.expect("Failed to create Kurtosis context");
        let mut child = start_service(&mut ctx).await;

        // Wait for the service to start
        sleep(Duration::from_secs(5)).await;

        match health_check().await {
            Ok(_) => println!("Health check passed"),
            Err(e) => panic!("Health check failed: {:?}", e),
        }

        stop_service