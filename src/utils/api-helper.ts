import { APIRequestContext } from "@playwright/test";

export class ApiHelper {
  private request: APIRequestContext;
  private authToken: string = "";

  constructor(request: APIRequestContext) {
    this.request = request;
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
      const response = await this.request.get(endpoint, {
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
      const headers = this.getHeaders(includeAuth);

      let response;
      if (isFormData) {
        delete headers["Content-Type"]; // Let browser set it with boundary
        response = await this.request.post(endpoint, {
          headers: includeAuth ? { "Auth-token": this.authToken } : {},
          multipart: data,
        });
      } else {
        response = await this.request.post(endpoint, {
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
    return await this.request.put(endpoint, {
      headers: this.getHeaders(includeAuth),
      data,
    });
  }

  async delete(endpoint: string, includeAuth: boolean = false) {
    return await this.request.delete(endpoint, {
      headers: this.getHeaders(includeAuth),
    });
  }

  async uploadFile(
    endpoint: string,
    filePath: string,
    fieldName: string = "file",
    includeAuth: boolean = false
  ) {
    const headers: Record<string, string> = includeAuth
      ? { "Auth-token": this.authToken }
      : {};

    return await this.request.post(endpoint, {
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
