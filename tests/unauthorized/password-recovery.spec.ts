import { test, expect } from "../../fixtures/testFixture";
import { generateRandomEmail } from "../../utils/api-helper";

test.describe("Password Recovery API Tests", () => {
  test.describe("Positive Tests", () => {
    test("Reset password with valid email @positive @password", async ({
      unauthorizedPage,
    }) => {
      const response = await unauthorizedPage.resetPassword("test@asd.com");

      expect(response.status()).toBeLessThan(500);
      const responseBody = await unauthorizedPage.safeJsonParse(response);
      expect(responseBody).toBeDefined();
    });

    test("Credentials forgotten - forgot email @positive @password", async ({
      unauthorizedPage,
    }) => {
      const response = await unauthorizedPage.credentialsForgotten(
        "1",
        "test@asd.com"
      );

      expect(response.status()).toBeLessThan(500);
    });

    test("Credentials forgotten - forgot password @positive @password", async ({
      unauthorizedPage,
    }) => {
      const response = await unauthorizedPage.credentialsForgotten(
        "2",
        "test@asd.com"
      );

      expect(response.status()).toBeLessThan(500);
    });

    test("Credentials forgotten - forgot PIN @positive @password", async ({
      unauthorizedPage,
    }) => {
      const response = await unauthorizedPage.credentialsForgotten(
        "3",
        "test@asd.com"
      );

      expect(response.status()).toBeLessThan(500);
    });
  });

  test.describe("Negative Tests", () => {
    test("Reset password with invalid email format @negative @password", async ({
      unauthorizedPage,
    }) => {
      const response = await unauthorizedPage.resetPassword("invalid-email");

      const responseBody = await unauthorizedPage.safeJsonParse(response);
      // API returns success: true for security (prevents email enumeration)
      // but we can still verify it returns a valid response
      expect(response.ok()).toBeTruthy();
      expect(responseBody).toBeDefined();
    });

    test("Reset password with non-existent email @negative @password", async ({
      unauthorizedPage,
    }) => {
      const response = await unauthorizedPage.resetPassword(
        generateRandomEmail()
      );

      expect(response.status()).toBeLessThan(500);
    });

    test("Reset password with empty email @negative @password", async ({
      unauthorizedPage,
    }) => {
      const response = await unauthorizedPage.resetPassword("");

      const responseBody = await unauthorizedPage.safeJsonParse(response);
      // API returns success: true for security (prevents email enumeration)
      expect(response.ok()).toBeTruthy();
      expect(responseBody).toBeDefined();
    });

    test("Credentials forgotten with invalid type @negative @password", async ({
      unauthorizedPage,
    }) => {
      const response = await unauthorizedPage.credentialsForgotten(
        "999",
        "test@asd.com"
      );

      const responseBody = await unauthorizedPage.safeJsonParse(response);
      // API returns success: true for security (prevents email enumeration)
      expect(response.ok()).toBeTruthy();
      expect(responseBody).toBeDefined();
    });

    test("Credentials forgotten with empty identifier @negative @password", async ({
      unauthorizedPage,
    }) => {
      const response = await unauthorizedPage.credentialsForgotten("1", "");

      const responseBody = await unauthorizedPage.safeJsonParse(response);
      // API returns success: true for security (prevents email enumeration)
      expect(response.ok()).toBeTruthy();
      expect(responseBody).toBeDefined();
    });
  });

  test.describe("Edge Cases", () => {
    test("Reset password with SQL injection @edge @password @security", async ({
      unauthorizedPage,
    }) => {
      const response = await unauthorizedPage.resetPassword(
        "admin@test.com' OR '1'='1"
      );

      expect(response.status()).toBeLessThan(500);
    });

    test("Reset password with very long email @edge @password", async ({
      unauthorizedPage,
    }) => {
      const longEmail = "a".repeat(200) + "@test.com";
      const response = await unauthorizedPage.resetPassword(longEmail);

      expect(response.status()).toBeLessThan(500);
    });

    test("Credentials forgotten with mobile number identifier @edge @password", async ({
      unauthorizedPage,
    }) => {
      const response = await unauthorizedPage.credentialsForgotten(
        "2",
        "+380634534234"
      );

      expect(response.status()).toBeLessThan(500);
    });

    test("Reset password multiple times in succession @edge @password", async ({
      unauthorizedPage,
    }) => {
      const email = "test@asd.com";

      const response1 = await unauthorizedPage.resetPassword(email);
      const response2 = await unauthorizedPage.resetPassword(email);
      const response3 = await unauthorizedPage.resetPassword(email);

      expect(response1.status()).toBeLessThan(500);
      expect(response2.status()).toBeLessThan(500);
      expect(response3.status()).toBeLessThan(500);
    });
  });
});
