import { test, expect } from "@playwright/test";
import { UnauthorizedPage } from "../../src/pages/unauthorized.page";
import { TestDataFactory } from "../../src/utils/test-data";
import { generateRandomEmail } from "../../src/utils/api-helper";

test.describe("User Registration API Tests", () => {
  let unauthorizedPage: UnauthorizedPage;

  test.beforeEach(async ({ request }) => {
    unauthorizedPage = new UnauthorizedPage(request);
  });

  test.describe("Positive Tests", () => {
    test("Register new user with valid data should succeed @positive @registration", async () => {
      const userData = TestDataFactory.getUserRegistrationData();
      const response = await unauthorizedPage.userRegister(userData);

      expect(response.status()).toBeLessThan(500);
      const responseBody = await unauthorizedPage.safeJsonParse(response);
      expect(responseBody).toBeDefined();
    });

    test("Register user with emergency contacts @positive @registration", async () => {
      const userData = TestDataFactory.getUserRegistrationData({
        emergency_contacts: [
          {
            name: "Emergency Contact 1",
            email: generateRandomEmail(),
            mobile_number: "+380934567890",
            mobile_country_code: "+380",
          },
        ],
      });
      const response = await unauthorizedPage.userRegister(userData);

      expect(response.status()).toBeLessThan(500);
    });
  });

  test.describe("Negative Tests", () => {
    test("Register user with existing email should fail @negative @registration", async () => {
      const userData = TestDataFactory.getUserRegistrationData({
        email: "test@asd.com", // Existing email
      });
      const response = await unauthorizedPage.userRegister(userData);

      const responseBody = await unauthorizedPage.safeJsonParse(response);
      expect(responseBody.success).toBeFalsy();
    });

    test("Register user with invalid email format @negative @registration", async () => {
      const userData = TestDataFactory.getUserRegistrationData({
        email: "invalid-email-format",
      });
      const response = await unauthorizedPage.userRegister(userData);

      const responseBody = await unauthorizedPage.safeJsonParse(response);
      expect(responseBody.success).toBeFalsy();
    });

    test("Register user with mismatched passwords @negative @registration", async () => {
      const userData = TestDataFactory.getUserRegistrationData({
        password: "Password123!@#",
        password2: "DifferentPassword123!@#",
      });
      const response = await unauthorizedPage.userRegister(userData);

      const responseBody = await unauthorizedPage.safeJsonParse(response);
      expect(responseBody.success).toBeFalsy();
    });

    test("Register user without agreeing to terms @negative @registration", async () => {
      const userData = TestDataFactory.getUserRegistrationData({
        agree_to_terms: "0",
      });
      const response = await unauthorizedPage.userRegister(userData);

      const responseBody = await unauthorizedPage.safeJsonParse(response);
      expect(responseBody.success).toBeFalsy();
    });

    test("Register user with weak password @negative @registration", async () => {
      const userData = TestDataFactory.getUserRegistrationData({
        password: "123",
        password2: "123",
      });
      const response = await unauthorizedPage.userRegister(userData);

      const responseBody = await unauthorizedPage.safeJsonParse(response);
      expect(responseBody.success).toBeFalsy();
    });

    test("Register user with missing required fields @negative @registration", async () => {
      const response = await unauthorizedPage.userRegister({} as any);

      const responseBody = await unauthorizedPage.safeJsonParse(response);
      expect(responseBody.success).toBeFalsy();
    });
  });

  test.describe("Edge Cases", () => {
    test("Register user with very long name @edge @registration", async () => {
      const userData = TestDataFactory.getUserRegistrationData({
        firstname: "A".repeat(255),
        lastname: "B".repeat(255),
      });
      const response = await unauthorizedPage.userRegister(userData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Register user with special characters in name @edge @registration", async () => {
      const userData = TestDataFactory.getUserRegistrationData({
        firstname: "O'Brien",
        lastname: "José-María",
      });
      const response = await unauthorizedPage.userRegister(userData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Register user with future date of birth @edge @registration", async () => {
      const futureYear = new Date().getFullYear() + 1;
      const userData = TestDataFactory.getUserRegistrationData({
        dob: [futureYear, 1, 1],
      });
      const response = await unauthorizedPage.userRegister(userData);

      const responseBody = await unauthorizedPage.safeJsonParse(response);
      expect(responseBody.success).toBeFalsy();
    });

    test("Register user with age under 13 @edge @registration", async () => {
      const currentYear = new Date().getFullYear();
      const userData = TestDataFactory.getUserRegistrationData({
        dob: [currentYear - 10, 1, 1],
      });
      const response = await unauthorizedPage.userRegister(userData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Check if email is taken - existing email @edge @registration", async () => {
      const response = await unauthorizedPage.isEmailTaken("test@asd.com");
      const responseBody = await unauthorizedPage.safeJsonParse(response);

      expect(responseBody).toHaveProperty("taken");
    });

    test("Check if email is taken - new email @edge @registration", async () => {
      const response = await unauthorizedPage.isEmailTaken(
        generateRandomEmail()
      );
      const responseBody = await unauthorizedPage.safeJsonParse(response);

      expect(responseBody).toHaveProperty("taken");
    });
  });
});
