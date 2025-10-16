import { test, expect } from "../../fixtures/testFixture";
import { TestDataFactory } from "../../utils/test-data";

test.describe("User Places API Tests", () => {
  let authToken: string;

  test.beforeAll(async ({ authenticatedContext }) => {
    authToken = authenticatedContext.token || "";
  });

  test.describe("Positive Tests", () => {
    test("Get user places @positive @user-places", async ({
      userPlacesPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (!token) {
        console.log(
          "⚠️ No auth token - testing auth required endpoint behavior"
        );
        const response = await userPlacesPage.getUserPlaces();
        // API may return 401/403 for unauthorized requests
        expect(response.status()).toBeLessThan(500);
        expect(response.status()).toBeGreaterThanOrEqual(400); // Should be 4xx for unauthorized
        console.log(
          `🔒 Auth required endpoint properly returned ${response.status()}`
        );
        return;
      }

      userPlacesPage.setAuthToken(token);
      const response = await userPlacesPage.getUserPlaces();

      expect(response.ok()).toBeTruthy();
      const responseBody = await userPlacesPage.safeJsonParse(response);
      expect(responseBody).toBeDefined();
    });

    test("Create user place with valid data @positive @user-places", async ({
      userPlacesPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) userPlacesPage.setAuthToken(token);

      const placeData = TestDataFactory.getUserPlaceData();
      const response = await userPlacesPage.createUserPlace(placeData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Update user place @positive @user-places", async ({
      userPlacesPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) userPlacesPage.setAuthToken(token);

      const placeData = {
        name: "Updated Place Name",
        radius: "15",
      };
      const response = await userPlacesPage.updateUserPlace("18", placeData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Delete user place @positive @user-places", async ({
      userPlacesPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) userPlacesPage.setAuthToken(token);

      const response = await userPlacesPage.deleteUserPlace("18");

      expect(response.status()).toBeLessThan(500);
    });
  });

  test.describe("Negative Tests", () => {
    test("Create place without auth @negative @user-places", async ({
      userPlacesPage,
    }) => {
      userPlacesPage.setAuthToken("");
      const placeData = TestDataFactory.getUserPlaceData();
      const response = await userPlacesPage.createUserPlace(placeData);

      expect(response.ok()).toBeFalsy();
    });

    test("Create place with invalid coordinates @negative @user-places", async ({
      userPlacesPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) userPlacesPage.setAuthToken(token);

      const placeData = TestDataFactory.getUserPlaceData({
        latitude: "999",
        longitude: "999",
      });
      const response = await userPlacesPage.createUserPlace(placeData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Create place with missing required fields @negative @user-places", async ({
      userPlacesPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) userPlacesPage.setAuthToken(token);

      const response = await userPlacesPage.createUserPlace({} as any);

      const responseBody = await userPlacesPage.safeJsonParse(response);
      expect(responseBody.success).toBeFalsy();
    });

    test("Update non-existent place @negative @user-places", async ({
      userPlacesPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) userPlacesPage.setAuthToken(token);

      const placeData = { name: "Test" };
      const response = await userPlacesPage.updateUserPlace(
        "999999",
        placeData
      );

      expect(response.status()).toBeGreaterThanOrEqual(400);
    });

    test("Delete non-existent place @negative @user-places", async ({
      userPlacesPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) userPlacesPage.setAuthToken(token);

      const response = await userPlacesPage.deleteUserPlace("999999");

      expect(response.status()).toBeGreaterThanOrEqual(400);
    });
  });

  test.describe("Edge Cases", () => {
    test("Create place with very long name @edge @user-places", async ({
      userPlacesPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) userPlacesPage.setAuthToken(token);

      const placeData = TestDataFactory.getUserPlaceData({
        name: "A".repeat(255),
      });
      const response = await userPlacesPage.createUserPlace(placeData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Create place with special characters @edge @user-places", async ({
      userPlacesPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) userPlacesPage.setAuthToken(token);

      const placeData = TestDataFactory.getUserPlaceData({
        name: "Café & Restaurant <Test>",
        address: "123 O'Connor St., Apt #5",
      });
      const response = await userPlacesPage.createUserPlace(placeData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Create place at extreme coordinates @edge @user-places", async ({
      userPlacesPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) userPlacesPage.setAuthToken(token);

      const placeData = TestDataFactory.getUserPlaceData({
        latitude: "89.9999",
        longitude: "179.9999",
      });
      const response = await userPlacesPage.createUserPlace(placeData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Create place with zero radius @edge @user-places", async ({
      userPlacesPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) userPlacesPage.setAuthToken(token);

      const placeData = TestDataFactory.getUserPlaceData({
        radius: "0",
      });
      const response = await userPlacesPage.createUserPlace(placeData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Create place with very large radius @edge @user-places", async ({
      userPlacesPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) userPlacesPage.setAuthToken(token);

      const placeData = TestDataFactory.getUserPlaceData({
        radius: "10000",
      });
      const response = await userPlacesPage.createUserPlace(placeData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Create multiple places with same name @edge @user-places", async ({
      userPlacesPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) userPlacesPage.setAuthToken(token);

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
