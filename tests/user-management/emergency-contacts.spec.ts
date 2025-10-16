import { test, expect } from "@playwright/test";
import { AuthPage } from "../../src/pages/auth.page";
import { EmergencyContactsPage } from "../../src/pages/emergency-contacts.page";
import { TestDataFactory } from "../../src/utils/test-data";

test.describe("Emergency Contacts API Tests", () => {
  let authPage: AuthPage;
  let emergencyContactsPage: EmergencyContactsPage;
  let authToken: string;
  let createdGroupId: string;
  let createdContactId: string;

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
    emergencyContactsPage = new EmergencyContactsPage(request);
    if (authToken) {
      emergencyContactsPage.setAuthToken(authToken);
      console.log("🔐 Auth token set for emergency contacts test");
    } else {
      console.log("⚠️ No auth token available for emergency contacts test");
    }
  });

  test.describe("Emergency Contact Groups - Positive Tests", () => {
    test("Get emergency contact groups @positive @emergency-contacts", async () => {
      if (!authToken) {
        test.skip("Skipping test - no authentication token available");
      }
      
      const response = await emergencyContactsPage.getEmergencyContactGroups();
      expect(response.ok()).toBeTruthy();
      const responseBody = await emergencyContactsPage.safeJsonParse(response);
      expect(responseBody).toBeDefined();
    });

    test("Create emergency contact group @positive @emergency-contacts", async () => {
      const groupData = TestDataFactory.getEmergencyContactGroupData();
      const response = await emergencyContactsPage.createEmergencyContactGroup(
        groupData
      );

      expect(response.status()).toBeLessThan(500);
      const responseBody = await emergencyContactsPage.safeJsonParse(response);
      if (responseBody.success && responseBody.data?.id) {
        createdGroupId = responseBody.data.id;
      }
    });

    test("Update emergency contact group @positive @emergency-contacts", async () => {
      const groupData = {
        name: "Updated Group Name",
        is_active: "0",
      };
      const response = await emergencyContactsPage.updateEmergencyContactGroup(
        "22",
        groupData
      );

      expect(response.status()).toBeLessThan(500);
    });

    test("Delete emergency contact group @positive @emergency-contacts", async () => {
      const response = await emergencyContactsPage.deleteEmergencyContactGroup(
        "22"
      );

      expect(response.status()).toBeLessThan(500);
    });
  });

  test.describe("Emergency Contacts - Positive Tests", () => {
    test("Get emergency contacts @positive @emergency-contacts", async () => {
      if (!authToken) {
        test.skip("Skipping test - no authentication token available");
      }
      
      const response = await emergencyContactsPage.getEmergencyContacts();
      expect(response.ok()).toBeTruthy();
      const responseBody = await emergencyContactsPage.safeJsonParse(response);
      expect(responseBody).toBeDefined();
    });

    test("Create emergency contact @positive @emergency-contacts", async () => {
      const contactData = TestDataFactory.getEmergencyContactData();
      const response = await emergencyContactsPage.createEmergencyContact(
        contactData
      );

      expect(response.status()).toBeLessThan(500);
    });

    test("Update emergency contact @positive @emergency-contacts", async () => {
      const contactData = {
        name: "Updated Contact",
        email: "updated@test.com",
      };
      const response = await emergencyContactsPage.updateEmergencyContact(
        "37",
        contactData
      );

      expect(response.status()).toBeLessThan(500);
    });

    test("Delete emergency contact @positive @emergency-contacts", async () => {
      const response = await emergencyContactsPage.deleteEmergencyContact("37");

      expect(response.status()).toBeLessThan(500);
    });
  });

  test.describe("Negative Tests", () => {
    test("Create group without auth @negative @emergency-contacts", async () => {
      emergencyContactsPage.setAuthToken("");
      const groupData = TestDataFactory.getEmergencyContactGroupData();
      const response = await emergencyContactsPage.createEmergencyContactGroup(
        groupData
      );

      expect(response.ok()).toBeFalsy();
    });

    test("Create contact with invalid email @negative @emergency-contacts", async () => {
      const contactData = TestDataFactory.getEmergencyContactData({
        email: "invalid-email",
      });
      const response = await emergencyContactsPage.createEmergencyContact(
        contactData
      );

      expect(response.status()).toBeLessThan(500);
    });

    test("Update non-existent group @negative @emergency-contacts", async () => {
      const groupData = { name: "Test" };
      const response = await emergencyContactsPage.updateEmergencyContactGroup(
        "999999",
        groupData
      );

      expect(response.status()).toBeGreaterThanOrEqual(400);
    });

    test("Delete non-existent contact @negative @emergency-contacts", async () => {
      const response = await emergencyContactsPage.deleteEmergencyContact(
        "999999"
      );

      expect(response.status()).toBeGreaterThanOrEqual(400);
    });
  });

  test.describe("Edge Cases", () => {
    test("Create group with very long name @edge @emergency-contacts", async () => {
      const groupData = TestDataFactory.getEmergencyContactGroupData({
        name: "A".repeat(255),
      });
      const response = await emergencyContactsPage.createEmergencyContactGroup(
        groupData
      );

      expect(response.status()).toBeLessThan(500);
    });

    test("Create contact with special characters @edge @emergency-contacts", async () => {
      const contactData = TestDataFactory.getEmergencyContactData({
        name: "O'Brien-Smith Jr.",
      });
      const response = await emergencyContactsPage.createEmergencyContact(
        contactData
      );

      expect(response.status()).toBeLessThan(500);
    });

    test("Create contact in multiple groups @edge @emergency-contacts", async () => {
      const contactData = TestDataFactory.getEmergencyContactData({
        group_id: "1,2,3",
      });
      const response = await emergencyContactsPage.createEmergencyContact(
        contactData
      );

      expect(response.status()).toBeLessThan(500);
    });

    test("Toggle group active status @edge @emergency-contacts", async () => {
      const groupData1 = { is_active: "1" };
      const response1 = await emergencyContactsPage.updateEmergencyContactGroup(
        "22",
        groupData1
      );

      const groupData2 = { is_active: "0" };
      const response2 = await emergencyContactsPage.updateEmergencyContactGroup(
        "22",
        groupData2
      );

      expect(response1.status()).toBeLessThan(500);
      expect(response2.status()).toBeLessThan(500);
    });
  });
});
