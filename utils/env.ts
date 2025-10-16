import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const env = {
  // API Configuration
  BASE_URL: process.env.BASE_URL || "https://zecure.panicguard.center",
  API_BASE_URL:
    process.env.API_BASE_URL || "https://zecure.panicguard.center/api",

  // Test Configuration
  TIMEOUT: parseInt(process.env.TIMEOUT || "30000"),
  RETRIES: parseInt(process.env.RETRIES || "1"),
  CI: process.env.CI === "true",

  // Authentication Credentials
  LOGIN_USERNAME: process.env.LOGIN_USERNAME || "testauto@gmail.com",
  LOGIN_PASSWORD: process.env.LOGIN_PASSWORD || "Test@123456",
  LOGIN_PIN: process.env.LOGIN_PIN || "123456",

  // API Test Control
  SKIP_API_TESTS: process.env.SKIP_API_TESTS === "true",
  API_SKIP_TESTS: process.env.API_SKIP_TESTS === "true",

  // Test Data
  TEST_USER_EMAIL: process.env.TEST_USER_EMAIL || "test@asd.com",
  TEST_USER_MOBILE: process.env.TEST_USER_MOBILE || "+380942342342",

  // Reporting
  ALLURE_RESULTS_DIR: process.env.ALLURE_RESULTS_DIR || "allure-results",
  ALLURE_REPORT_DIR: process.env.ALLURE_REPORT_DIR || "allure-report",

  // Development
  NODE_ENV: process.env.NODE_ENV || "development",
  DEBUG: process.env.DEBUG === "true",
};

export default env;
