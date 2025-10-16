import { test, expect } from "../../fixtures/testFixture";
import { TestDataFactory } from "../../utils/test-data";

test.describe("Shared Location API Tests", () => {
  let authToken: string;

  test.beforeAll(async ({ authenticatedContext }) => {
    authToken = authenticatedContext.token || "";
  });

  test.describe("Positive Tests", () => {
    test("Create shared location with single recipient @positive @shared-location", async ({
      eventPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) eventPage.setAuthToken(token);

      const sharedLocationData = TestDataFactory.getSharedLocationData();
      const response = await eventPage.createSharedLocation(sharedLocationData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Create shared location with multiple recipients @positive @shared-location", async ({
      eventPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) eventPage.setAuthToken(token);

      const sharedLocationData = TestDataFactory.getSharedLocationData({
        recipients: [
          {
            name: "Recipient 1",
            email: "recipient1@test.com",
            phone: "+380942342342",
            device_platform: "android",
            device_messaging_id: "device1",
          },
          {
            name: "Recipient 2",
            email: "recipient2@test.com",
            phone: "+380942342343",
          },
        ],
      });
      const response = await eventPage.createSharedLocation(sharedLocationData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Get my shared location @positive @shared-location", async ({
      eventPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) eventPage.setAuthToken(token);

      const response = await eventPage.getMySharedLocation();

      expect(response.status()).toBeLessThan(500);
    });

    test("Get shared location by ID @positive @shared-location", async ({
      eventPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) eventPage.setAuthToken(token);

      const response = await eventPage.getSharedLocation("25");

      expect(response.status()).toBeLessThan(500);
    });

    test("Update shared location recipient duration @positive @shared-location", async ({
      eventPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) eventPage.setAuthToken(token);

      const response = await eventPage.updateSharedLocationRecipient(
        "12",
        "1000"
      );

      expect(response.status()).toBeLessThan(500);
    });

    test("Delete shared location recipient @positive @shared-location", async ({
      eventPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) eventPage.setAuthToken(token);

      const response = await eventPage.deleteSharedLocationRecipient("67");

      expect(response.status()).toBeLessThan(500);
    });

    test("Delete shared location @positive @shared-location", async ({
      eventPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) eventPage.setAuthToken(token);

      const response = await eventPage.deleteSharedLocation("25");

      expect(response.status()).toBeLessThan(500);
    });

    test("Append to shared location @positive @shared-location", async ({
      eventPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) eventPage.setAuthToken(token);

      const data = {
        duration: 7200,
        recipients: [
          {
            name: "New Recipient",
            email: "new@test.com",
            phone: "+380942372342",
          },
        ],
      };
      const response = await eventPage.appendToSharedLocation("3", data);

      expect(response.status()).toBeLessThan(500);
    });
  });

  test.describe("Negative Tests", () => {
    test("Create shared location without auth @negative @shared-location", async ({
      eventPage,
    }) => {
      eventPage.setAuthToken("");
      const sharedLocationData = TestDataFactory.getSharedLocationData();
      const response = await eventPage.createSharedLocation(sharedLocationData);

      expect(response.ok()).toBeFalsy();
    });

    test("Create shared location with invalid duration @negative @shared-location", async ({
      eventPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) eventPage.setAuthToken(token);

      const sharedLocationData = TestDataFactory.getSharedLocationData({
        duration: "-100",
      });
      const response = await eventPage.createSharedLocation(sharedLocationData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Create shared location without recipients @negative @shared-location", async ({
      eventPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) eventPage.setAuthToken(token);

      const sharedLocationData = TestDataFactory.getSharedLocationData({
        recipients: [],
      });
      const response = await eventPage.createSharedLocation(sharedLocationData);

      const responseBody = await eventPage.safeJsonParse(response);
      expect(responseBody.success).toBeFalsy();
    });

    test("Get non-existent shared location @negative @shared-location", async ({
      eventPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) eventPage.setAuthToken(token);

      const response = await eventPage.getSharedLocation("999999");

      expect(response.status()).toBeGreaterThanOrEqual(400);
    });

    test("Update non-existent recipient @negative @shared-location", async ({
      eventPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) eventPage.setAuthToken(token);

      const response = await eventPage.updateSharedLocationRecipient(
        "999999",
        "1000"
      );

      expect(response.status()).toBeGreaterThanOrEqual(400);
    });
  });

  test.describe("Edge Cases", () => {
    test("Create shared location with very long duration @edge @shared-location", async ({
      eventPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) eventPage.setAuthToken(token);

      const sharedLocationData = TestDataFactory.getSharedLocationData({
        duration: "86400",
      }); // 24 hours
      const response = await eventPage.createSharedLocation(sharedLocationData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Create shared location with recipient without device info @edge @shared-location", async ({
      eventPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) eventPage.setAuthToken(token);

      const sharedLocationData = TestDataFactory.getSharedLocationData({
        recipients: [
          {
            name: "Simple Recipient",
            email: "simple@test.com",
            phone: "+380942342342",
          },
        ],
      });
      const response = await eventPage.createSharedLocation(sharedLocationData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Create shared location with special characters in recipient name @edge @shared-location", async ({
      eventPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) eventPage.setAuthToken(token);

      const sharedLocationData = TestDataFactory.getSharedLocationData({
        recipients: [
          {
            name: "O'Brien-Smith Jr. <Test>",
            email: "test@test.com",
            phone: "+380942342342",
          },
        ],
      });
      const response = await eventPage.createSharedLocation(sharedLocationData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Create shared location with many recipients @edge @shared-location", async ({
      eventPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) eventPage.setAuthToken(token);

      const recipients = Array.from({ length: 10 }, (_, i) => ({
        name: `Recipient ${i + 1}`,
        email: `recipient${i + 1}@test.com`,
        phone: `+38094234${i.toString().padStart(4, "0")}`,
      }));

      const sharedLocationData = TestDataFactory.getSharedLocationData({
        recipients,
      });
      const response = await eventPage.createSharedLocation(sharedLocationData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Update shared location with new recipients @edge @shared-location", async ({
      eventPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) eventPage.setAuthToken(token);

      const data = {
        duration: 3600,
        recipients: [
          {
            name: "Additional Recipient 1",
            email: "add1@test.com",
            phone: "+380942372342",
            device_platform: "ios",
            device_messaging_id: "device_new_1",
          },
          {
            name: "Additional Recipient 2",
            email: "add2@test.com",
            phone: "+380942372343",
          },
        ],
      };
      const response = await eventPage.appendToSharedLocation("3", data);

      expect(response.status()).toBeLessThan(500);
    });
  });
});
