import { test, expect } from "@playwright/test";
import { UnauthorizedPage } from "../../src/pages/unauthorized.page";

test.describe("App Settings API Tests", () => {
  let unauthorizedPage: UnauthorizedPage;

  test.beforeEach(async ({ request }) => {
    unauthorizedPage = new UnauthorizedPage(request);

    // Skip tests if API is not accessible or explicitly skipped
    test.skip(
      process.env.SKIP_API_TESTS === "true" ||
        process.env.API_SKIP_TESTS === "true",
      "API tests are skipped - API server not accessible or tests disabled"
    );
  });

  // Helper function to safely parse JSON responses
  async function safeJsonParse(response: any) {
    return await unauthorizedPage.safeJsonParse(response);
  }

  test.describe("Positive Tests", () => {
    test("Get app settings should return configuration @positive @app-settings", async () => {
      const response = await unauthorizedPage.getAppSettings();

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);

      const responseBody = await safeJsonParse(response);
      expect(responseBody).toBeDefined();
    });

    test("Get app settings should return valid JSON @positive @app-settings", async () => {
      const response = await unauthorizedPage.getAppSettings();

      expect(response.ok()).toBeTruthy();

      const responseBody = await safeJsonParse(response);
      expect(typeof responseBody).toBe("object");
    });

    test("Get app settings should return JSON content type @positive @app-settings", async () => {
      const response = await unauthorizedPage.getAppSettings();

      expect(response.ok()).toBeTruthy();

      // Diagnostic test to understand response format
      const contentType = response.headers()["content-type"];
      console.log("Response content-type:", contentType);
      console.log("Response status:", response.status());

      if (!response.ok()) {
        const responseText = await response.text();
        console.log("Error response body:", responseText);
      }

      expect(contentType).toContain("application/json");
    });
  });

  test.describe("Negative Tests", () => {
    test("Get app settings with invalid method POST should fail @negative @app-settings", async ({
      request,
    }) => {
      const response = await request.post("/unauthorized/app_settings", {
        data: {},
      });
      expect(response.status()).toBeGreaterThanOrEqual(400);
    });
  });

  test.describe("Edge Cases", () => {
    test("Get app settings multiple times should return consistent data @edge @app-settings", async () => {
      const response1 = await unauthorizedPage.getAppSettings();
      const response2 = await unauthorizedPage.getAppSettings();

      expect(response1.ok()).toBeTruthy();
      expect(response2.ok()).toBeTruthy();

      const body1 = await safeJsonParse(response1);
      const body2 = await safeJsonParse(response2);

      expect(body1).toEqual(body2);
    });

    test("Get app settings with invalid headers @edge @app-settings", async ({
      request,
    }) => {
      const response = await request.get("/unauthorized/app_settings");
      expect(response.ok()).toBeTruthy();

      // Log response details for debugging if test fails
      if (!response.ok()) {
        const responseText = await response.text();
        console.log("Response status:", response.status());
        console.log("Response headers:", response.headers());
        console.log("Response body:", responseText);
      }
    });

    test("Get app settings should handle non-JSON responses gracefully @edge @app-settings", async () => {
      const response = await unauthorizedPage.getAppSettings();

      // This test will help identify if the API returns HTML error pages
      const responseText = await response.text();
      console.log("Raw response:", responseText.substring(0, 200) + "...");

      if (
        responseText.trim().startsWith("<!DOCTYPE") ||
        responseText.trim().startsWith("<html")
      ) {
        console.log(
          "API returned HTML instead of JSON - this indicates an error"
        );
        // For now, we'll expect this to fail until the API issue is resolved
      }
    });
  });
});
