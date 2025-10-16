import { test, expect } from "../../fixtures/testFixture";
import { TestDataFactory } from "../../utils/test-data";

test.describe("Meetings and Journeys API Tests", () => {
  let authToken: string;

  test.beforeAll(async ({ authenticatedContext }) => {
    authToken = authenticatedContext.token || "";
  });

  test.describe("Meetings - Positive Tests", () => {
    test("Create meeting with valid data @positive @meeting", async ({
      eventPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) eventPage.setAuthToken(token);

      const meetingData = TestDataFactory.getMeetingData();
      const response = await eventPage.createMeeting(meetingData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Update meeting timer @positive @meeting", async ({
      eventPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) eventPage.setAuthToken(token);

      const meetingData = TestDataFactory.getMeetingData({ timer: "3600" });
      const response = await eventPage.updateMeeting(meetingData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Cancel meeting @positive @meeting", async ({
      eventPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) eventPage.setAuthToken(token);

      const response = await eventPage.cancelMeeting();

      expect(response.status()).toBeLessThan(500);
    });
  });

  test.describe("Meetings - Negative Tests", () => {
    test("Create meeting without auth @negative @meeting", async ({
      eventPage,
    }) => {
      eventPage.setAuthToken("");
      const meetingData = TestDataFactory.getMeetingData();
      const response = await eventPage.createMeeting(meetingData);

      expect(response.ok()).toBeFalsy();
    });

    test("Create meeting with invalid timer @negative @meeting", async ({
      eventPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) eventPage.setAuthToken(token);

      const meetingData = TestDataFactory.getMeetingData({ timer: "-100" });
      const response = await eventPage.createMeeting(meetingData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Update non-existent meeting @negative @meeting", async ({
      eventPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) eventPage.setAuthToken(token);

      const meetingData = TestDataFactory.getMeetingData();
      const response = await eventPage.updateMeeting(meetingData);

      expect(response.status()).toBeLessThan(500);
    });
  });

  test.describe("Journeys - Positive Tests", () => {
    test("Start journey with walking mode @positive @journey", async ({
      eventPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) eventPage.setAuthToken(token);

      const journeyData = TestDataFactory.getJourneyData({ mode: "1" });
      const response = await eventPage.startJourney(journeyData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Start journey with bicycle mode @positive @journey", async ({
      eventPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) eventPage.setAuthToken(token);

      const journeyData = TestDataFactory.getJourneyData({ mode: "2" });
      const response = await eventPage.startJourney(journeyData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Start journey with vehicle mode @positive @journey", async ({
      eventPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) eventPage.setAuthToken(token);

      const journeyData = TestDataFactory.getJourneyData({ mode: "3" });
      const response = await eventPage.startJourney(journeyData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Start journey with train mode @positive @journey", async ({
      eventPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) eventPage.setAuthToken(token);

      const journeyData = TestDataFactory.getJourneyData({ mode: "4" });
      const response = await eventPage.startJourney(journeyData);

      expect(response.status()).toBeLessThan(500);
    });

    test("End journey @positive @journey", async ({
      eventPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) eventPage.setAuthToken(token);

      const response = await eventPage.endJourney();

      expect(response.status()).toBeLessThan(500);
    });

    test("Cancel journey @positive @journey", async ({
      eventPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) eventPage.setAuthToken(token);

      const response = await eventPage.cancelJourney();

      expect(response.status()).toBeLessThan(500);
    });
  });

  test.describe("Journeys - Negative Tests", () => {
    test("Start journey without auth @negative @journey", async ({
      eventPage,
    }) => {
      eventPage.setAuthToken("");
      const journeyData = TestDataFactory.getJourneyData();
      const response = await eventPage.startJourney(journeyData);

      expect(response.ok()).toBeFalsy();
    });

    test("Start journey with invalid coordinates @negative @journey", async ({
      eventPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) eventPage.setAuthToken(token);

      const journeyData = TestDataFactory.getJourneyData({
        start_latitude: "999",
        start_longitude: "999",
      });
      const response = await eventPage.startJourney(journeyData);

      expect(response.status()).toBeLessThan(500);
    });

    test("End journey without active journey @negative @journey", async ({
      eventPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) eventPage.setAuthToken(token);

      const response = await eventPage.endJourney();

      expect(response.status()).toBeLessThan(500);
    });
  });

  test.describe("Edge Cases", () => {
    test("Create meeting with very long timer @edge @meeting", async ({
      eventPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) eventPage.setAuthToken(token);

      const meetingData = TestDataFactory.getMeetingData({
        timer: "86400",
      }); // 24 hours
      const response = await eventPage.createMeeting(meetingData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Create meeting with special characters in notes @edge @meeting", async ({
      eventPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) eventPage.setAuthToken(token);

      const meetingData = TestDataFactory.getMeetingData({
        notes: "Test @#$% <script>alert('xss')</script>",
      });
      const response = await eventPage.createMeeting(meetingData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Start journey with same start and end location @edge @journey", async ({
      eventPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) eventPage.setAuthToken(token);

      const journeyData = TestDataFactory.getJourneyData({
        start_latitude: "50.2323232",
        start_longitude: "28.32323232",
        end_latitude: "50.2323232",
        end_longitude: "28.32323232",
      });
      const response = await eventPage.startJourney(journeyData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Start journey with very long distance @edge @journey", async ({
      eventPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) eventPage.setAuthToken(token);

      const journeyData = TestDataFactory.getJourneyData({
        start_latitude: "-90",
        start_longitude: "0",
        end_latitude: "90",
        end_longitude: "180",
      });
      const response = await eventPage.startJourney(journeyData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Create checkin at location @edge @checkin", async ({
      eventPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) eventPage.setAuthToken(token);

      const checkinData = TestDataFactory.getCheckinData();
      const response = await eventPage.createCheckin(checkinData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Checkout from location @edge @checkin", async ({
      eventPage,
      authenticatedContext,
    }) => {
      const { token } = authenticatedContext;
      if (token) eventPage.setAuthToken(token);

      const response = await eventPage.checkout();

      expect(response.status()).toBeLessThan(500);
    });
  });
});
