import { test, expect } from "@playwright/test";
import { AuthPage } from "../../src/pages/auth.page";
import { UserPlacesPage } from "../../src/pages/user-places.page";
import { TestDataFactory } from "../../src/utils/test-data";

test.describe("User Places API Tests", () => {
  let authPage: AuthPage;
  let userPlacesPage: UserPlacesPage;
  let authToken: string;

  test.beforeAll(async ({ request }) => {
    authPage = new AuthPage(request);
    const credentials = TestDataFactory.getLoginCredentials();
    const loginResponse = await authPage.login(credentials);
    const loginBody = await authPage.safeJsonParse(loginResponse);

    if (loginBody.success && loginBody.data?.token) {
      authToken = loginBody.data.token;
    }
  });

  test.beforeEach(async ({ request }) => {
    userPlacesPage = new UserPlacesPage(request);
    if (authToken) {
      userPlacesPage.setAuthToken(authToken);
    }
  });

  test.describe("Positive Tests", () => {
    test("Get user places @positive @user-places", async () => {
      const response = await userPlacesPage.getUserPlaces();

      expect(response.ok()).toBeTruthy();
      const responseBody = await userPlacesPage.safeJsonParse(response);
      expect(responseBody).toBeDefined();
    });

    test("Create user place with valid data @positive @user-places", async () => {
      const placeData = TestDataFactory.getUserPlaceData();
      const response = await userPlacesPage.createUserPlace(placeData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Update user place @positive @user-places", async () => {
      const placeData = {
        name: "Updated Place Name",
        radius: "15",
      };
      const response = await userPlacesPage.updateUserPlace("18", placeData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Delete user place @positive @user-places", async () => {
      const response = await userPlacesPage.deleteUserPlace("18");

      expect(response.status()).toBeLessThan(500);
    });
  });

  test.describe("Negative Tests", () => {
    test("Create place without auth @negative @user-places", async () => {
      userPlacesPage.setAuthToken("");
      const placeData = TestDataFactory.getUserPlaceData();
      const response = await userPlacesPage.createUserPlace(placeData);

      expect(response.ok()).toBeFalsy();
    });

    test("Create place with invalid coordinates @negative @user-places", async () => {
      const placeData = TestDataFactory.getUserPlaceData({
        latitude: "999",
        longitude: "999",
      });
      const response = await userPlacesPage.createUserPlace(placeData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Create place with missing required fields @negative @user-places", async () => {
      const response = await userPlacesPage.createUserPlace({} as any);

      const responseBody = await userPlacesPage.safeJsonParse(response);
      expect(responseBody.success).toBeFalsy();
    });

    test("Update non-existent place @negative @user-places", async () => {
      const placeData = { name: "Test" };
      const response = await userPlacesPage.updateUserPlace(
        "999999",
        placeData
      );

      expect(response.status()).toBeGreaterThanOrEqual(400);
    });

    test("Delete non-existent place @negative @user-places", async () => {
      const response = await userPlacesPage.deleteUserPlace("999999");

      expect(response.status()).toBeGreaterThanOrEqual(400);
    });
  });

  test.describe("Edge Cases", () => {
    test("Create place with very long name @edge @user-places", async () => {
      const placeData = TestDataFactory.getUserPlaceData({
        name: "A".repeat(255),
      });
      const response = await userPlacesPage.createUserPlace(placeData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Create place with special characters @edge @user-places", async () => {
      const placeData = TestDataFactory.getUserPlaceData({
        name: "Café & Restaurant <Test>",
        address: "123 O'Connor St., Apt #5",
      });
      const response = await userPlacesPage.createUserPlace(placeData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Create place at extreme coordinates @edge @user-places", async () => {
      const placeData = TestDataFactory.getUserPlaceData({
        latitude: "89.9999",
        longitude: "179.9999",
      });
      const response = await userPlacesPage.createUserPlace(placeData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Create place with zero radius @edge @user-places", async () => {
      const placeData = TestDataFactory.getUserPlaceData({
        radius: "0",
      });
      const response = await userPlacesPage.createUserPlace(placeData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Create place with very large radius @edge @user-places", async () => {
      const placeData = TestDataFactory.getUserPlaceData({
        radius: "10000",
      });
      const response = await userPlacesPage.createUserPlace(placeData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Create multiple places with same name @edge @user-places", async () => {
      const placeData = TestDataFactory.getUserPlaceData({
        name: "Duplicate Place",
      });

      const response1 = await userPlacesPage.createUserPlace(placeData);
      const response2 = await userPlacesPage.createUserPlace(placeData);

      expect(response1.status()).toBeLessThan(500);
      expect(response2.status()).toBeLessThan(500);
    });
  });
});
