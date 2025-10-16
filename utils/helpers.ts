import { APIResponse } from "@playwright/test";

/**
 * Helper utilities for API testing
 */
export class TestHelpers {
  /**
   * Safely parse JSON response with error handling
   */
  static async safeJsonParse(response: APIResponse): Promise<any> {
    try {
      return await response.json();
    } catch (error) {
      console.error("Failed to parse JSON response:", error);
      const text = await response.text();
      console.error("Response text:", text);
      return {
        success: false,
        error: "Failed to parse JSON response",
        rawResponse: text,
      };
    }
  }

  /**
   * Wait for a specified amount of time
   */
  static async wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Generate a random string
   */
  static generateRandomString(length: number = 10): string {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generate a random email
   */
  static generateRandomEmail(domain: string = "test.com"): string {
    return `test_${this.generateRandomString(8)}@${domain}`;
  }

  /**
   * Generate a random phone number
   */
  static generateRandomPhone(countryCode: string = "+380"): string {
    const number = Math.floor(Math.random() * 900000000) + 100000000;
    return `${countryCode}${number}`;
  }

  /**
   * Format date for API requests
   */
  static formatApiDate(date: Date = new Date()): string {
    return date.toISOString().replace("T", " ").substring(0, 19);
  }

  /**
   * Log API response for debugging
   */
  static async logApiResponse(
    response: APIResponse,
    label: string = "API Response"
  ): Promise<void> {
    console.log(`${label}:`, {
      status: response.status(),
      ok: response.ok(),
      url: response.url(),
      headers: response.headers(),
    });

    try {
      const body = await response.text();
      console.log(`${label} Body:`, body);
    } catch (error) {
      console.log(`${label} Body: Unable to read response body`);
    }
  }

  /**
   * Validate required environment variables
   */
  static validateEnvVariables(requiredVars: string[]): void {
    const missing = requiredVars.filter((varName) => !process.env[varName]);
    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(", ")}`
      );
    }
  }

  /**
   * Create test data with overrides
   */
  static createTestData<T>(defaults: T, overrides: Partial<T> = {}): T {
    return { ...defaults, ...overrides };
  }
}

export default TestHelpers;
