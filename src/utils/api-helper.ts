import { APIRequestContext } from "@playwright/test";

export class ApiHelper {
  private request: APIRequestContext;
  private authToken: string = "";
  private baseURL: string;

  constructor(request: APIRequestContext, baseURL?: string) {
    this.request = request;
    this.baseURL =
      baseURL ||
      process.env.API_BASE_URL ||
      "https://zecure.panicguard.center/api";
  }

  setAuthToken(token: string) {
    this.authToken = token;

    // Update environment variables when token is set
    if (token) {
      process.env.AUTH_TOKEN_CURRENT = token;
      process.env.BEARER_TOKEN_UPDATED_DATE = new Date().toISOString();

      // Auto-update .env file if token is set
      if (process.env.AUTO_UPDATE_TOKEN_FILE === "true") {
        try {
          const fs = require("fs");
          const path = require("path");
          const envPath = path.resolve(__dirname, "..", ".env");
          let envContent = fs.readFileSync(envPath, "utf8");

          // Update or add the token
          const tokenLine = `AUTH_TOKEN_CURRENT=${token}`;
          if (envContent.includes("AUTH_TOKEN_CURRENT=")) {
            envContent = envContent.replace(/AUTH_TOKEN_CURRENT=.*/, tokenLine);
          } else {
            envContent += `\n${tokenLine}`;
          }

          fs.writeFileSync(envPath, envContent);
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          console.warn(
            "⚠️  Could not update .env file with new token:",
            errorMessage
          );
        }
      }
    }
  }

  getAuthToken(): string {
    return this.authToken;
  }

  isTokenExpiring(): boolean {
    const expiresAt =
      process.env.BEARER_TOKEN_EXPIRES_AT || process.env.AUTH_TOKEN_EXPIRES_AT;
    if (!expiresAt) return false;

    const expirationDate = new Date(expiresAt);
    const now = new Date();
    const thresholdMinutes = parseInt(
      process.env.BEARER_TOKEN_REFRESH_THRESHOLD_MINUTES || "30"
    );
    const thresholdDate = new Date(
      now.getTime() + thresholdMinutes * 60 * 1000
    );

    return expirationDate <= thresholdDate;
  }

  isTokenExpired(): boolean {
    const expiresAt =
      process.env.BEARER_TOKEN_EXPIRES_AT || process.env.AUTH_TOKEN_EXPIRES_AT;
    if (!expiresAt) return false;

    const expirationDate = new Date(expiresAt);
    const now = new Date();

    return expirationDate <= now;
  }

  getHeaders(includeAuth: boolean = false): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (includeAuth && this.authToken) {
      const tokenHeader = process.env.AUTH_TOKEN_HEADER || "Auth-token";
      const useBearer = process.env.USE_BEARER_TOKEN === "true";
      const bearerPrefix = process.env.BEARER_TOKEN_PREFIX || "Bearer";

      if (useBearer) {
        headers["Authorization"] = `${bearerPrefix} ${this.authToken}`;
      } else {
        headers[tokenHeader] = this.authToken;
      }
    }

    return headers;
  }

  async get(endpoint: string, includeAuth: boolean = false) {
    try {
      const fullUrl = `${this.baseURL}${
        endpoint.startsWith("/") ? endpoint : `/${endpoint}`
      }`;
      const response = await this.request.get(fullUrl, {
        headers: this.getHeaders(includeAuth),
      });

      // Check if response is HTML error page
      const contentType = response.headers()["content-type"] || "";
      if (
        contentType.includes("text/html") &&
        !contentType.includes("application/json")
      ) {
        const text = await response.text();
        if (text.includes("<!DOCTYPE") || text.includes("<html")) {
          throw new Error(
            `API returned HTML error page. Endpoint: ${endpoint}, Status: ${response.status()}, Content-Type: ${contentType}`
          );
        }
      }

      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`GET request failed for ${endpoint}: ${errorMessage}`);
    }
  }

  async post(
    endpoint: string,
    data?: any,
    includeAuth: boolean = false,
    isFormData: boolean = false
  ) {
    try {
      const fullUrl = `${this.baseURL}${
        endpoint.startsWith("/") ? endpoint : `/${endpoint}`
      }`;
      const headers = this.getHeaders(includeAuth);

      let response;
      if (isFormData) {
        delete headers["Content-Type"]; // Let browser set it with boundary
        response = await this.request.post(fullUrl, {
          headers: includeAuth ? { "Auth-token": this.authToken } : {},
          multipart: data,
        });
      } else {
        response = await this.request.post(fullUrl, {
          headers,
          data,
        });
      }

      // Check if response is HTML error page (only if enabled)
      const checkHtmlErrors = process.env.HTML_ERROR_DETECTION !== "false";
      if (checkHtmlErrors) {
        const contentType = response.headers()["content-type"] || "";
        const expectedContentType =
          process.env.EXPECTED_CONTENT_TYPE || "application/json";
        const strictContentCheck =
          process.env.STRICT_CONTENT_TYPE_CHECK === "true";

        if (strictContentCheck && !contentType.includes(expectedContentType)) {
          const text = await response.text();
          if (text.includes("<!DOCTYPE") || text.includes("<html")) {
            throw new Error(
              `API returned HTML error page. Endpoint: ${endpoint}, Status: ${response.status()}, Content-Type: ${contentType}, Expected: ${expectedContentType}`
            );
          }
        }
      }

      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`POST request failed for ${endpoint}: ${errorMessage}`);
    }
  }

  async put(endpoint: string, data: any, includeAuth: boolean = false) {
    const fullUrl = `${this.baseURL}${
      endpoint.startsWith("/") ? endpoint : `/${endpoint}`
    }`;
    return await this.request.put(fullUrl, {
      headers: this.getHeaders(includeAuth),
      data,
    });
  }

  async delete(endpoint: string, includeAuth: boolean = false) {
    const fullUrl = `${this.baseURL}${
      endpoint.startsWith("/") ? endpoint : `/${endpoint}`
    }`;
    return await this.request.delete(fullUrl, {
      headers: this.getHeaders(includeAuth),
    });
  }

  /**
   * Safely parse JSON response, handling HTML error pages gracefully
   */
  async safeJsonParse(response: any): Promise<any> {
    try {
      const contentType = response.headers()["content-type"] || "";
      const status = response.status();
      const url = response.url();

      // If content-type indicates HTML, don't try to parse as JSON
      if (
        contentType.includes("text/html") &&
        !contentType.includes("application/json")
      ) {
        const text = await response.text();
        console.warn(
          `⚠️  API returned HTML instead of JSON. URL: ${url}, Status: ${status}, Content-Type: ${contentType}`
        );
        console.warn(`HTML Preview: ${text.substring(0, 200)}...`);

        // Check for common error patterns
        let errorType = "Unknown HTML error";
        if (text.includes("404") || status === 404) {
          errorType = "Endpoint not found (404)";
        } else if (text.includes("login") || text.includes("sign in")) {
          errorType = "Authentication required - redirected to login page";
        } else if (text.includes("403") || status === 403) {
          errorType = "Access forbidden (403)";
        } else if (text.includes("500") || status === 500) {
          errorType = "Server error (500)";
        } else if (text.includes("nginx") || text.includes("Apache")) {
          errorType = "Web server error page";
        }

        return {
          success: false,
          error: `API returned HTML error page (Status: ${status}) - ${errorType}`,
          errorType: errorType,
          htmlContent: text,
          contentType: contentType,
          url: url,
          status: status,
        };
      }

      // Try to parse as JSON
      const jsonData = await response.json();
      return jsonData;
    } catch (parseError) {
      // If JSON parsing fails, get the raw text to understand what we received
      const text = await response.text();
      const status = response.status();
      const url = response.url();

      console.error(
        `❌ JSON parsing failed for response. URL: ${url}, Status: ${status}`
      );
      console.error(`Response preview: ${text.substring(0, 300)}...`);

      // Check if it's an HTML error page
      if (text.includes("<!DOCTYPE") || text.includes("<html")) {
        let errorType = "Unknown HTML error";
        if (text.includes("404") || status === 404) {
          errorType = "Endpoint not found (404)";
        } else if (text.includes("login") || text.includes("sign in")) {
          errorType = "Authentication required - redirected to login page";
        } else if (text.includes("403") || status === 403) {
          errorType = "Access forbidden (403)";
        } else if (text.includes("500") || status === 500) {
          errorType = "Server error (500)";
        }

        return {
          success: false,
          error: `API returned HTML error page instead of JSON (Status: ${status}) - ${errorType}`,
          errorType: errorType,
          htmlContent: text,
          parseError:
            parseError instanceof Error
              ? parseError.message
              : String(parseError),
          url: url,
          status: status,
        };
      }

      // Return raw text if it's not HTML
      return {
        success: false,
        error: `Failed to parse response as JSON (Status: ${status})`,
        rawContent: text,
        parseError:
          parseError instanceof Error ? parseError.message : String(parseError),
        url: url,
        status: status,
      };
    }
  }

  async uploadFile(
    endpoint: string,
    filePath: string,
    fieldName: string = "file",
    includeAuth: boolean = false
  ) {
    const fullUrl = `${this.baseURL}${
      endpoint.startsWith("/") ? endpoint : `/${endpoint}`
    }`;
    const headers: Record<string, string> = includeAuth
      ? { "Auth-token": this.authToken }
      : {};

    return await this.request.post(fullUrl, {
      headers,
      multipart: {
        [fieldName]: {
          name: filePath.split("/").pop() || "file",
          mimeType: "application/octet-stream",
          buffer: Buffer.from("test file content"),
        },
      },
    });
  }

  /**
   * Diagnostic method to test API connectivity and identify common issues
   */
  async diagnoseApiIssues(baseUrl: string): Promise<void> {
    console.log("🔍 Running API diagnostics...");

    try {
      // Test 1: Basic connectivity
      console.log("1. Testing basic connectivity...");
      const healthCheck = await this.request
        .get(`${baseUrl}/health`, {
          timeout: 10000,
        })
        .catch(() => null);

      if (healthCheck) {
        console.log(`✅ Health check: Status ${healthCheck.status()}`);
      } else {
        console.log("⚠️  Health check endpoint not available or failed");
      }

      // Test 2: Test auth endpoint
      console.log("2. Testing auth endpoint...");
      const authTest = await this.request
        .get(`${baseUrl}/auth`, {
          timeout: 10000,
        })
        .catch(() => null);

      if (authTest) {
        const contentType = authTest.headers()["content-type"] || "";
        console.log(
          `✅ Auth endpoint: Status ${authTest.status()}, Content-Type: ${contentType}`
        );

        if (contentType.includes("text/html")) {
          console.log(
            "⚠️  Auth endpoint returns HTML - this may indicate wrong endpoint or server configuration"
          );
        }
      } else {
        console.log("❌ Auth endpoint not accessible");
      }

      // Test 3: Test API base path
      console.log("3. Testing API base path...");
      const apiTest = await this.request
        .get(`${baseUrl}/api`, {
          timeout: 10000,
        })
        .catch(() => null);

      if (apiTest) {
        const contentType = apiTest.headers()["content-type"] || "";
        console.log(
          `✅ API base: Status ${apiTest.status()}, Content-Type: ${contentType}`
        );
      } else {
        console.log("❌ API base path not accessible");
      }

      console.log("🔍 API diagnostics complete.");
    } catch (error) {
      console.error("❌ API diagnostics failed:", error);
    }
  }
}

export function convertToFormData(
  data: Record<string, any>
): Record<string, any> {
  const formData: Record<string, any> = {};

  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined && value !== null) {
      formData[key] = String(value);
    }
  }

  return formData;
}

export function generateRandomString(length: number = 10): string {
  const defaultLength = parseInt(process.env.RANDOM_STRING_LENGTH || "8");
  const actualLength = length > 0 ? length : defaultLength;

  return Math.random()
    .toString(36)
    .substring(2, actualLength + 2);
}

export function generateRandomEmail(): string {
  if (process.env.GENERATE_RANDOM_EMAILS === "false") {
    return process.env.TEST_EMAIL || "test@asd.com";
  }
  return `test_${generateRandomString()}@test.com`;
}

export function generateRandomMobile(): string {
  if (process.env.GENERATE_RANDOM_PHONES === "false") {
    return process.env.TEST_MOBILE_NUMBER || "+380634534234";
  }
  const randomNum = Math.floor(Math.random() * 900000000) + 100000000;
  return `+380${randomNum}`;
}

export function getCurrentDateTime(): string {
  const now = new Date();
  return now.toISOString().replace("T", " ").substring(0, 19);
}

export function validateResponseStructure(
  response: any,
  requiredFields: string[]
): boolean {
  for (const field of requiredFields) {
    if (!(field in response)) {
      return false;
    }
  }
  return true;
}
