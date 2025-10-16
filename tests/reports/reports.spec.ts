import { test, expect } from "../../fixtures/testFixture";

import { TestDataFactory } from "../../utils/test-data";

test.describe("Reports API Tests", () => {
  test.describe("Positive Tests", () => {
    test("Get report settings @positive @reports", async ({ reportsPage }) => {
      const response = await reportsPage.getSettings();

      expect(response.ok()).toBeTruthy();
      const responseBody = await reportsPage.safeJsonParse(response);
      expect(responseBody).toBeDefined();
    });

    test("Submit report with valid data @positive @reports", async ({
      reportsPage,
    }) => {
      const reportData = TestDataFactory.getReportData();
      const response = await reportsPage.submitReport(reportData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Submit anonymous report @positive @reports", async ({
      reportsPage,
    }) => {
      const reportData = TestDataFactory.getReportData({
        is_anonymous: "1",
      });
      const response = await reportsPage.submitReport(reportData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Submit report with user ID @positive @reports", async ({
      reportsPage,
    }) => {
      const reportData = TestDataFactory.getReportData({
        user_id: "13",
        is_anonymous: "0",
      });
      const response = await reportsPage.submitReport(reportData);

      expect(response.status()).toBeLessThan(500);
    });
  });

  test.describe("Negative Tests", () => {
    test("Submit report with missing required fields @negative @reports", async ({
      reportsPage,
    }) => {
      const response = await reportsPage.submitReport({} as any);

      const responseBody = await reportsPage.safeJsonParse(response);
      expect(responseBody.success).toBeFalsy();
    });

    test("Submit report with invalid category @negative @reports", async ({
      reportsPage,
    }) => {
      const reportData = TestDataFactory.getReportData({
        category_id: "9999",
      });
      const response = await reportsPage.submitReport(reportData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Submit report with invalid coordinates @negative @reports", async ({
      reportsPage,
    }) => {
      const reportData = TestDataFactory.getReportData({
        latitude: "999",
        longitude: "999",
      });
      const response = await reportsPage.submitReport(reportData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Submit report with invalid severity level @negative @reports", async ({
      reportsPage,
    }) => {
      const reportData = TestDataFactory.getReportData({
        severity_level: "99",
      });
      const response = await reportsPage.submitReport(reportData);

      expect(response.status()).toBeLessThan(500);
    });
  });

  test.describe("Edge Cases", () => {
    test("Submit report with very long description @edge @reports", async ({
      reportsPage,
    }) => {
      const reportData = TestDataFactory.getReportData({
        description: "A".repeat(5000),
      });
      const response = await reportsPage.submitReport(reportData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Submit report with custom timestamp @edge @reports", async ({
      reportsPage,
    }) => {
      const reportData = TestDataFactory.getReportData({
        custom_created_at: "2021-10-05 12:20:54",
      });
      const response = await reportsPage.submitReport(reportData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Submit report with additional questions @edge @reports", async ({
      reportsPage,
    }) => {
      const reportData = TestDataFactory.getReportData({
        additional_question_answers_json: JSON.stringify([
          { question: "How do you do?", answer: "false" },
        ]),
      });
      const response = await reportsPage.submitReport(reportData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Submit report with special characters in device fingerprint @edge @reports", async ({
      reportsPage,
    }) => {
      const reportData = TestDataFactory.getReportData({
        device_fingerprint: "test-device-123-@#$",
      });
      const response = await reportsPage.submitReport(reportData);

      expect(response.status()).toBeLessThan(500);
    });

    test("Get settings multiple times @edge @reports", async ({
      reportsPage,
    }) => {
      const response1 = await reportsPage.getSettings();
      const response2 = await reportsPage.getSettings();

      expect(response1.ok()).toBeTruthy();
      expect(response2.ok()).toBeTruthy();
    });
  });
});
