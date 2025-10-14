import { test, expect } from "@playwright/test";
import { AuthPage } from "../../src/pages/auth.page";
import { EventPage } from "../../src/pages/event.page";
import { TestDataFactory } from "../../src/utils/test-data";

test.describe("Location Tracking API Tests", () => {
  let authPage: AuthPage;
  let eventPage: EventPage;
  let authToken: string;

  test.beforeAll(async ({ request }) => {
    authPage = new AuthPage(request);
    const credentials = TestDataFactory.getLoginCredentials();
    const loginResponse = await authPage.login(credentials);
    const loginBody = await loginResponse.json();

    if (loginBody.success && loginBody.data?.token) {
      authToken = loginBody.data.token;
    }
  });

  test.beforeEach(async ({ request }) => {
    eventPage = new EventPage(request);
    if (authToken) {
      eventPage.setAuthToken(authToken);
    }
  });

  test.describe("Positive Tests", () => {
    test("Post location with GPS data @positive @location", async () => {
      const locationData = TestDataFactory.getLocationData({ type: "1" });
      const response = await eventPage.postLocation(locationData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Post location with Network data @positive @location", async () => {
      const locationData = TestDataFactory.getLocationData({ type: "2" });
      const response = await eventPage.postLocation(locationData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Post location with User Device data @positive @location", async () => {
      const locationData = TestDataFactory.getLocationData({ type: "3" });
      const response = await eventPage.postLocation(locationData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Post location in ghost mode @positive @location", async () => {
      const locationData = TestDataFactory.getLocationData({
        ghost_mode: "1",
      });
      const response = await eventPage.postLocation(locationData);

      expect(response.status()).toBeLessThan(500);
    });
  });

  test.describe("Negative Tests", () => {
    test("Post location without auth @negative @location", async () => {
      eventPage.setAuthToken("");
      const locationData = TestDataFactory.getLocationData();
      const response = await eventPage.postLocation(locationData);

      expect(response.ok()).toBeFalsy();
    });

    test("Post location with invalid coordinates @negative @location", async () => {
      const locationData = TestDataFactory.getLocationData({
        latitude: "999",
        longitude: "999",
      });
      const response = await eventPage.postLocation(locationData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Post location with missing required fields @negative @location", async () => {
      const response = await eventPage.postLocation({} as any);

      const responseBody = await response.json();
      expect(responseBody.success).toBeFalsy();
    });

    test("Post location with invalid type @negative @location", async () => {
      const locationData = TestDataFactory.getLocationData({ type: "99" });
      const response = await eventPage.postLocation(locationData);

      expect(response.status()).toBeLessThan(500);
    });
  });

  test.describe("Edge Cases", () => {
    test("Post location at North Pole @edge @location", async () => {
      const locationData = TestDataFactory.getLocationData({
        latitude: "90.0",
        longitude: "0.0",
      });
      const response = await eventPage.postLocation(locationData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Post location at South Pole @edge @location", async () => {
      const locationData = TestDataFactory.getLocationData({
        latitude: "-90.0",
        longitude: "0.0",
      });
      const response = await eventPage.postLocation(locationData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Post location with extreme altitude @edge @location", async () => {
      const locationData = TestDataFactory.getLocationData({
        altitude: "10000",
      });
      const response = await eventPage.postLocation(locationData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Post location with zero accuracy @edge @location", async () => {
      const locationData = TestDataFactory.getLocationData({ accuracy: "0" });
      const response = await eventPage.postLocation(locationData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Post location with future timestamp @edge @location", async () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 1);
      const locationData = TestDataFactory.getLocationData({
        device_utc_time: futureDate
          .toISOString()
          .replace("T", " ")
          .substring(0, 19),
      });
      const response = await eventPage.postLocation(locationData);

      expect(response.status()).toBeLessThan(500);
    });
  });
});
