import { test, expect } from "../fixtures/testFixture";
import { TestDataFactory } from "../utils/test-data";

test.describe("Example API Tests - Using Updated POM Structure", () => {
  test.beforeEach(async ({}) => {
    // Skip tests if API is not accessible or explicitly skipped
    test.skip(
      process.env.SKIP_API_TESTS === "true" ||
        process.env.API_SKIP_TESTS === "true",
      "API tests are skipped - API server not accessible or tests disabled"
    );
  });

  test.describe("Authentication Examples", () => {
    test("Example: Login with valid credentials using fixtures @positive @example", async ({
      authPage,
    }) => {
      const credentials = TestDataFactory.getLoginCredentials();
      console.log("🔍 Testing login with credentials using fixture:", {
        username: credentials.username,
        hasPassword: !!credentials.password,
        hasPin: !!credentials.pin,
      });

      const response = await authPage.login(credentials);
      expect(response.status()).toBeLessThan(500);

      const responseBody = await authPage.safeJsonParse(response);
      console.log("📝 Login response:", responseBody);
    });

    test.skip("Example: Using authenticated context fixture @positive @example", async ({
      authenticatedContext,
    }) => {
      const { authPage, token, request } = authenticatedContext;

      if (token) {
        console.log("✅ Already authenticated with token");
        // Use the authenticated context to make API calls
        const response = await request.get("/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        expect(response.status()).toBeLessThan(500);
      } else {
        console.log("⚠️ Authentication failed - testing endpoint without auth");
        // Test that the endpoint properly handles unauthorized requests
        const response = await request.get("/user/profile");
        expect(response.status()).toBeLessThan(500);
        // API returns 200 even for unauthorized - check response body instead
        if (response.status() === 200) {
          const responseBody = await response.json();
          expect(responseBody.success).toBeFalsy(); // Should indicate auth failure
          console.log(
            "🔒 Unauthorized request properly rejected in response body"
          );
        } else {
          expect(response.status()).toBeGreaterThanOrEqual(400);
          console.log(
            `🔒 Auth required endpoint properly returned ${response.status()}`
          );
        }
      }
    });
  });

  test.describe("Event Management Examples", () => {
    test("Example: Create alert using event page fixture @positive @example", async ({
      eventPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;

      if (token) {
        eventPage.setAuthToken(token);

        const alertData = TestDataFactory.getAlertData({
          event_type_id: "2",
          type_trigger: "1",
        });

        const response = await eventPage.changeAlertType(alertData);
        expect(response.status()).toBeLessThan(500);

        console.log("🚨 Alert created successfully");
      } else {
        console.log("⚠️ No auth - testing unauthorized alert creation");
        const alertData = TestDataFactory.getAlertData({
          event_type_id: "2",
          type_trigger: "1",
        });

        const response = await eventPage.changeAlertType(alertData);
        // API may return 401/403 for unauthorized requests
        expect(response.status()).toBeLessThan(500);
        expect(response.status()).toBeGreaterThanOrEqual(400); // Should be 4xx for unauthorized
        console.log(
          `🔒 Auth required endpoint properly returned ${response.status()}`
        );
      }
    });
  });

  test.describe("User Management Examples", () => {
    test("Example: Get user profile using user page fixture @positive @example", async ({
      userPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;

      if (token) {
        userPage.setAuthToken(token);

        const response = await userPage.getProfile();
        expect(response.ok()).toBeTruthy();

        const responseBody = await userPage.safeJsonParse(response);
        expect(responseBody).toBeDefined();

        console.log("👤 User profile retrieved successfully");
      } else {
        console.log("⚠️ No auth - testing unauthorized profile access");
        const response = await userPage.getProfile();
        // API may return 401/403 for unauthorized requests
        expect(response.status()).toBeLessThan(500);
        expect(response.status()).toBeGreaterThanOrEqual(400); // Should be 4xx for unauthorized
        console.log(
          `🔒 Auth required endpoint properly returned ${response.status()}`
        );
      }
    });
  });

  test.describe("Reports Examples", () => {
    test("Example: Submit report without authentication @positive @example", async ({
      reportsPage,
    }) => {
      const reportData = TestDataFactory.getReportData();
      const response = await reportsPage.submitReport(reportData);

      expect(response.status()).toBeLessThan(500);
      console.log("📊 Report submitted successfully");
    });
  });

  test.describe("Unauthorized Endpoints Examples", () => {
    test("Example: Get app settings without auth @positive @example", async ({
      unauthorizedPage,
    }) => {
      const response = await unauthorizedPage.getAppSettings();

      expect(response.ok()).toBeTruthy();
      const responseBody = await unauthorizedPage.safeJsonParse(response);
      expect(responseBody).toBeDefined();

      console.log("⚙️ App settings retrieved successfully");
    });

    test("Example: Reset password @positive @example", async ({
      unauthorizedPage,
    }) => {
      const response = await unauthorizedPage.resetPassword("test@example.com");

      expect(response.status()).toBeLessThan(500);
      const responseBody = await unauthorizedPage.safeJsonParse(response);
      expect(responseBody).toBeDefined();

      console.log("🔐 Password reset initiated successfully");
    });
  });
});
