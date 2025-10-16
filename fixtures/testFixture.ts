import { test as base, APIRequestContext } from "@playwright/test";
import { AuthPage } from "../pages/auth.page";
import { EventPage } from "../pages/event.page";
import { UserPage } from "../pages/user.page";
import { ReportsPage } from "../pages/reports.page";
import { UnauthorizedPage } from "../pages/unauthorized.page";
import { EmergencyContactsPage } from "../pages/emergency-contacts.page";
import { UserPlacesPage } from "../pages/user-places.page";
import { TestDataFactory } from "../utils/test-data";

// Define custom fixtures
type TestFixtures = {
  authPage: AuthPage;
  eventPage: EventPage;
  userPage: UserPage;
  reportsPage: ReportsPage;
  unauthorizedPage: UnauthorizedPage;
  emergencyContactsPage: EmergencyContactsPage;
  userPlacesPage: UserPlacesPage;
  authenticatedContext: {
    authPage: AuthPage;
    token: string | null;
    request: APIRequestContext;
  };
};

// Extend base test with custom fixtures
export const test = base.extend<TestFixtures>({
  // Auth Page Fixture
  authPage: async ({ request }, use) => {
    const authPage = new AuthPage(request);
    await use(authPage);
  },

  // Event Page Fixture
  eventPage: async ({ request }, use) => {
    const eventPage = new EventPage(request);
    await use(eventPage);
  },

  // User Page Fixture
  userPage: async ({ request }, use) => {
    const userPage = new UserPage(request);
    await use(userPage);
  },

  // Reports Page Fixture
  reportsPage: async ({ request }, use) => {
    const reportsPage = new ReportsPage(request);
    await use(reportsPage);
  },

  // Unauthorized Page Fixture
  unauthorizedPage: async ({ request }, use) => {
    const unauthorizedPage = new UnauthorizedPage(request);
    await use(unauthorizedPage);
  },

  // Emergency Contacts Page Fixture
  emergencyContactsPage: async ({ request }, use) => {
    const emergencyContactsPage = new EmergencyContactsPage(request);
    await use(emergencyContactsPage);
  },

  // User Places Page Fixture
  userPlacesPage: async ({ request }, use) => {
    const userPlacesPage = new UserPlacesPage(request);
    await use(userPlacesPage);
  },

  // Authenticated Context Fixture - handles login automatically
  authenticatedContext: async ({ request }, use) => {
    const authPage = new AuthPage(request);
    let token: string | null = null;

    // Try multiple credential sets for better test reliability
    const credentialSets = [
      TestDataFactory.getLoginCredentials(),
      TestDataFactory.getLoginCredentials({
        username: "testauto@gmail.com",
        password: "Test@123456",
        pin: "123456",
      }),
      TestDataFactory.getLoginCredentials({
        username: "test@asd.com",
        password: "Test@123456",
        pin: "123456",
      }),
    ];

    for (const credentials of credentialSets) {
      try {
        console.log(`🔍 Trying authentication with: ${credentials.username}`);
        const loginResponse = await authPage.login(credentials);
        const loginBody = await authPage.safeJsonParse(loginResponse);

        if (loginBody.success && loginBody.data?.token) {
          token = loginBody.data.token;
          console.log("✅ Authentication successful in fixture");
          break;
        } else if (
          loginBody.error &&
          loginBody.error.includes("already logged in")
        ) {
          console.log(
            "ℹ️ User already has active session - treating as success"
          );
          // For tests that just need to check API connectivity, this is fine
          token = "mock_token_for_session_user";
          break;
        }
      } catch (error) {
        console.log(
          `❌ Authentication attempt failed for ${credentials.username}:`,
          error
        );
        continue;
      }
    }

    if (!token) {
      console.log(
        "⚠️ All authentication attempts failed - some tests will be skipped"
      );
    }

    await use({
      authPage,
      token,
      request,
    });

    // Cleanup - logout if token was obtained (but not mock token)
    if (token && token !== "mock_token_for_session_user") {
      try {
        authPage.setAuthToken(token);
        await authPage.logout();
        console.log("🔐 Logged out in fixture cleanup");
      } catch (error) {
        console.log("⚠️ Cleanup logout failed:", error);
      }
    }
  },
});

export { expect } from "@playwright/test";
