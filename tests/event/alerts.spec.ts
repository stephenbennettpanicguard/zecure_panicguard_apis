import { test, expect } from "@playwright/test";
import { AuthPage } from "../../src/pages/auth.page";
import { EventPage } from "../../src/pages/event.page";
import { TestDataFactory } from "../../src/utils/test-data";

test.describe("Alert Management API Tests", () => {
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
    test("Change alert type to TYPE_ALERT @positive @alert", async () => {
      const alertData = TestDataFactory.getAlertData({
        event_type_id: "2",
        type_trigger: "1",
      });
      const response = await eventPage.changeAlertType(alertData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Change alert type to TYPE_DANGER_ALERT @positive @alert", async () => {
      const alertData = TestDataFactory.getAlertData({
        event_type_id: "3",
        type_trigger: "1",
      });
      const response = await eventPage.changeAlertType(alertData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Trigger alert with shake @positive @alert", async () => {
      const alertData = TestDataFactory.getAlertData({ type_trigger: "2" });
      const response = await eventPage.changeAlertType(alertData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Trigger alert with man down @positive @alert", async () => {
      const alertData = TestDataFactory.getAlertData({ type_trigger: "3" });
      const response = await eventPage.changeAlertType(alertData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Trigger alert with button press @positive @alert", async () => {
      const alertData = TestDataFactory.getAlertData({ type_trigger: "4" });
      const response = await eventPage.changeAlertType(alertData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Trigger alert with duress PIN @positive @alert", async () => {
      const alertData = TestDataFactory.getAlertData({ type_trigger: "7" });
      const response = await eventPage.changeAlertType(alertData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Get test alert @positive @alert", async () => {
      const response = await eventPage.testAlert();

      expect(response.status()).toBeLessThan(500);
    });

    test("Close alert @positive @alert", async () => {
      const response = await eventPage.closeAlert();

      expect(response.status()).toBeLessThan(500);
    });

    test("Request backup during alert @positive @alert", async () => {
      const response = await eventPage.requestBackup();

      expect(response.status()).toBeLessThan(500);
    });
  });

  test.describe("Negative Tests", () => {
    test("Change alert type without auth @negative @alert", async () => {
      eventPage.setAuthToken("");
      const alertData = TestDataFactory.getAlertData();
      const response = await eventPage.changeAlertType(alertData);

      expect(response.ok()).toBeFalsy();
    });

    test("Change alert type with invalid event type @negative @alert", async () => {
      const alertData = TestDataFactory.getAlertData({
        event_type_id: "999",
      });
      const response = await eventPage.changeAlertType(alertData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Change alert type with invalid trigger @negative @alert", async () => {
      const alertData = TestDataFactory.getAlertData({ type_trigger: "999" });
      const response = await eventPage.changeAlertType(alertData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Close alert without active alert @negative @alert", async () => {
      const response = await eventPage.closeAlert();

      expect(response.status()).toBeLessThan(500);
    });
  });

  test.describe("Edge Cases", () => {
    test("Trigger multiple alerts in succession @edge @alert", async () => {
      const alertData1 = TestDataFactory.getAlertData({ type_trigger: "1" });
      const alertData2 = TestDataFactory.getAlertData({ type_trigger: "2" });

      const response1 = await eventPage.changeAlertType(alertData1);
      const response2 = await eventPage.changeAlertType(alertData2);

      expect(response1.status()).toBeLessThan(500);
      expect(response2.status()).toBeLessThan(500);
    });

    test("Change alert type with past timestamp @edge @alert", async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      const alertData = TestDataFactory.getAlertData({
        device_utc_time: pastDate
          .toISOString()
          .replace("T", " ")
          .substring(0, 19),
      });
      const response = await eventPage.changeAlertType(alertData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Get dispatch alert with specific ID @edge @alert", async () => {
      const response = await eventPage.getDispatchAlert("1");

      expect(response.status()).toBeLessThan(500);
    });

    test("Dispatch guard - accept @edge @alert", async () => {
      const dispatchData = {
        dispatch_id: "1",
        notes: "Accepted dispatch",
      };
      const response = await eventPage.dispatchGuard("1", dispatchData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Dispatch guard - reject @edge @alert", async () => {
      const dispatchData = {
        dispatch_id: "1",
        notes: "Rejected dispatch",
      };
      const response = await eventPage.dispatchGuard("2", dispatchData);

      expect(response.status()).toBeLessThan(500);
    });
  });
});
