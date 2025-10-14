import { test, expect } from "@playwright/test";
import { UnauthorizedPage } from "../../src/pages/unauthorized.page";
import { generateRandomEmail } from "../../src/utils/api-helper";

test.describe("Password Recovery API Tests", () => {
  let unauthorizedPage: UnauthorizedPage;

  test.beforeEach(async ({ request }) => {
    unauthorizedPage = new UnauthorizedPage(request);
  });

  test.describe("Positive Tests", () => {
    test("Reset password with valid email @positive @password", async () => {
      const response = await unauthorizedPage.resetPassword("test@asd.com");

      expect(response.status()).toBeLessThan(500);
      const responseBody = await response.json();
      expect(responseBody).toBeDefined();
    });

    test("Credentials forgotten - forgot email @positive @password", async () => {
      const response = await unauthorizedPage.credentialsForgotten(
        "1",
        "test@asd.com"
      );

      expect(response.status()).toBeLessThan(500);
    });

    test("Credentials forgotten - forgot password @positive @password", async () => {
      const response = await unauthorizedPage.credentialsForgotten(
        "2",
        "test@asd.com"
      );

      expect(response.status()).toBeLessThan(500);
    });

    test("Credentials forgotten - forgot PIN @positive @password", async () => {
      const response = await unauthorizedPage.credentialsForgotten(
        "3",
        "test@asd.com"
      );

      expect(response.status()).toBeLessThan(500);
    });
  });

  test.describe("Negative Tests", () => {
    test("Reset password with invalid email format @negative @password", async () => {
      const response = await unauthorizedPage.resetPassword("invalid-email");

      const responseBody = await response.json();
      expect(responseBody.success).toBeFalsy();
    });

    test("Reset password with non-existent email @negative @password", async () => {
      const response = await unauthorizedPage.resetPassword(
        generateRandomEmail()
      );

      expect(response.status()).toBeLessThan(500);
    });

    test("Reset password with empty email @negative @password", async () => {
      const response = await unauthorizedPage.resetPassword("");

      const responseBody = await response.json();
      expect(responseBody.success).toBeFalsy();
    });

    test("Credentials forgotten with invalid type @negative @password", async () => {
      const response = await unauthorizedPage.credentialsForgotten(
        "999",
        "test@asd.com"
      );

      const responseBody = await response.json();
      expect(responseBody.success).toBeFalsy();
    });

    test("Credentials forgotten with empty identifier @negative @password", async () => {
      const response = await unauthorizedPage.credentialsForgotten("1", "");

      const responseBody = await response.json();
      expect(responseBody.success).toBeFalsy();
    });
  });

  test.describe("Edge Cases", () => {
    test("Reset password with SQL injection @edge @password @security", async () => {
      const response = await unauthorizedPage.resetPassword(
        "admin@test.com' OR '1'='1"
      );

      expect(response.status()).toBeLessThan(500);
    });

    test("Reset password with very long email @edge @password", async () => {
      const longEmail = "a".repeat(200) + "@test.com";
      const response = await unauthorizedPage.resetPassword(longEmail);

      expect(response.status()).toBeLessThan(500);
    });

    test("Credentials forgotten with mobile number identifier @edge @password", async () => {
      const response = await unauthorizedPage.credentialsForgotten(
        "2",
        "+380634534234"
      );

      expect(response.status()).toBeLessThan(500);
    });

    test("Reset password multiple times in succession @edge @password", async () => {
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
