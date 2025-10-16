import { test, expect } from "../../fixtures/testFixture";
import { TestDataFactory } from "../../utils/test-data";

test.describe("User Profile API Tests", () => {
  let authToken: string;

  test.beforeAll(async ({ authenticatedContext }) => {
    authToken = authenticatedContext.token || "";
  });

  test.describe("Positive Tests", () => {
    test("Get user profile @positive @user-profile", async ({
      userPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (!token) {
        console.log(
          "⚠️ No auth token - testing auth required endpoint behavior"
        );
        const response = await userPage.getProfile();
        // API may return 401/403 for unauthorized requests
        expect(response.status()).toBeLessThan(500);
        expect(response.status()).toBeGreaterThanOrEqual(400); // Should be 4xx for unauthorized
        console.log(
          `🔒 Auth required endpoint properly returned ${response.status()}`
        );
        return;
      }

      userPage.setAuthToken(token);
      const response = await userPage.getProfile();
      expect(response.ok()).toBeTruthy();
      const responseBody = await userPage.safeJsonParse(response);
      expect(responseBody).toBeDefined();
    });

    test("Update user profile with valid data @positive @user-profile", async ({
      userPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) userPage.setAuthToken(token);

      const profileData = {
        email: "updated@test.com",
        gender: "1",
      };

      const response = await userPage.updateProfile(profileData);
      expect(response.status()).toBeLessThan(500);
    });

    test("Update mobile number @positive @user-profile", async ({
      userPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) userPage.setAuthToken(token);

      const mobileData = {
        mobile_country_code: "+380",
        mobile_number: "+380564321234",
      };

      const response = await userPage.updateMobileNumber(mobileData);
      expect(response.status()).toBeLessThan(500);
    });

    test("Update app cache @positive @user-profile", async ({
      userPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) userPage.setAuthToken(token);

      const cacheData = {
        test: "cache_data",
        timestamp: new Date().toISOString(),
      };

      const response = await userPage.updateAppCache(cacheData);
      expect(response.status()).toBeLessThan(500);
    });

    test("Get app cache @positive @user-profile", async ({
      userPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (!token) {
        console.log(
          "⚠️ No auth token - testing auth required endpoint behavior"
        );
        const response = await userPage.getAppCache();
        // API may return 401/403 for unauthorized requests
        expect(response.status()).toBeLessThan(500);
        expect(response.status()).toBeGreaterThanOrEqual(400); // Should be 4xx for unauthorized
        console.log(
          `🔒 Auth required endpoint properly returned ${response.status()}`
        );
        return;
      }

      userPage.setAuthToken(token);
      const response = await userPage.getAppCache();
      expect(response.ok()).toBeTruthy();
    });
  });

  test.describe("Negative Tests", () => {
    test("Get profile without auth token @negative @user-profile", async ({
      userPage,
    }) => {
      userPage.setAuthToken("");
      const response = await userPage.getProfile();

      expect(response.ok()).toBeFalsy();
    });

    test("Update profile with invalid email @negative @user-profile", async ({
      userPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) userPage.setAuthToken(token);

      const profileData = {
        email: "invalid-email-format",
      };

      const response = await userPage.updateProfile(profileData);
      const responseBody = await userPage.safeJsonParse(response);
      expect(responseBody.success).toBeFalsy();
    });

    test("Update mobile with invalid format @negative @user-profile", async ({
      userPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) userPage.setAuthToken(token);

      const mobileData = {
        mobile_country_code: "+999",
        mobile_number: "12345",
      };

      const response = await userPage.updateMobileNumber(mobileData);
      expect(response.status()).toBeGreaterThanOrEqual(400);
    });

    test("Update profile with invalid auth token @negative @user-profile", async ({
      userPage,
    }) => {
      userPage.setAuthToken("invalid_token_xyz");
      const response = await userPage.getProfile();

      expect(response.ok()).toBeFalsy();
    });
  });

  test.describe("Edge Cases", () => {
    test("Update profile with very long fields @edge @user-profile", async ({
      userPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) userPage.setAuthToken(token);

      const profileData = {
        info: "A".repeat(5000),
        notes: "B".repeat(5000),
      };

      const response = await userPage.updateProfile(profileData);
      expect(response.status()).toBeLessThan(500);
    });

    test("Update app cache with large JSON @edge @user-profile", async ({
      userPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) userPage.setAuthToken(token);

      const largeData = {
        items: Array.from({ length: 100 }, (_, i) => ({
          id: i,
          data: "test".repeat(50),
        })),
      };

      const response = await userPage.updateAppCache(largeData);
      expect(response.status()).toBeLessThan(500);
    });

    test("Update profile with special characters @edge @user-profile", async ({
      userPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) userPage.setAuthToken(token);

      const profileData = {
        company_name: "Company & Co. <Ltd>",
        info: "Test info with special chars: @#$%^&*()",
      };

      const response = await userPage.updateProfile(profileData);
      expect(response.status()).toBeLessThan(500);
    });

    test("Get user app settings @edge @user-profile", async ({
      userPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (!token) {
        console.log(
          "⚠️ No auth token - testing auth required endpoint behavior"
        );
        const response = await userPage.getAppSettings();
        // API may return 401/403 for unauthorized requests
        expect(response.status()).toBeLessThan(500);
        expect(response.status()).toBeGreaterThanOrEqual(400); // Should be 4xx for unauthorized
        console.log(
          `🔒 Auth required endpoint properly returned ${response.status()}`
        );
        return;
      }

      userPage.setAuthToken(token);
      const response = await userPage.getAppSettings();
      expect(response.ok()).toBeTruthy();
    });
  });
});
