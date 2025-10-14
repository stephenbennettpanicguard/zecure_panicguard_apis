import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, ".env") });

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : Number(process.env.RETRIES) || 1,
  workers: process.env.CI ? 1 : undefined,

  // Global setup to check API connectivity
  globalSetup: "./scripts/global-setup.js",
  reporter: [
    ["html"],
    ["list"],
    [
      "allure-playwright",
      {
        outputFolder: "allure-results",
        detail: true,
        suiteTitle: true,
        categories: [
          {
            name: "Ignored tests",
            matchedStatuses: ["skipped"],
          },
          {
            name: "Product defects",
            matchedStatuses: ["failed"],
          },
          {
            name: "Test defects",
            matchedStatuses: ["broken"],
          },
        ],
        environmentInfo: {
          "Base URL":
            process.env.BASE_URL || "https://zecure.panicguard.center",
          "API Base URL":
            process.env.API_BASE_URL || "https://zecure.panicguard.center/api",
          Environment: process.env.CI ? "CI" : "Local",
          "Test Type": "API Testing",
        },
      },
    ],
  ],
  use: {
    baseURL: process.env.API_BASE_URL || "https://zecure.panicguard.center/api",
    extraHTTPHeaders: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  timeout: Number(process.env.TIMEOUT) || 30000,
  expect: {
    timeout: 10000,
  },
  projects: [
    {
      name: "API Tests",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
