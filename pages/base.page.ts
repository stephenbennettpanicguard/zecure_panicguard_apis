import { APIRequestContext } from "@playwright/test";
import { ApiHelper } from "../utils/api-helper";

export class BasePage {
  protected request: APIRequestContext;
  protected apiHelper: ApiHelper;
  protected baseURL: string;

  constructor(request: APIRequestContext) {
    this.request = request;
    this.baseURL =
      process.env.API_BASE_URL || "https://zecure.panicguard.center/api";
    this.apiHelper = new ApiHelper(request, this.baseURL);
  }

  setAuthToken(token: string) {
    this.apiHelper.setAuthToken(token);
  }

  getAuthToken(): string {
    return this.apiHelper.getAuthToken();
  }

  /**
   * Safely parse JSON response, handling HTML error pages gracefully
   */
  async safeJsonParse(response: any): Promise<any> {
    return await this.apiHelper.safeJsonParse(response);
  }

  /**
   * Diagnostic method to test API connectivity and identify common issues
   */
  async diagnoseApiIssues(): Promise<void> {
    return await this.apiHelper.diagnoseApiIssues(this.baseURL);
  }
}
