import { APIRequestContext } from "@playwright/test";
import { ApiHelper } from "../utils/api-helper";

export class BasePage {
  protected request: APIRequestContext;
  protected apiHelper: ApiHelper;
  protected baseURL: string;

  constructor(request: APIRequestContext) {
    this.request = request;
    this.apiHelper = new ApiHelper(request);
    this.baseURL =
      process.env.API_BASE_URL || "https://zecure.panicguard.center/api";
  }

  setAuthToken(token: string) {
    this.apiHelper.setAuthToken(token);
  }

  getAuthToken(): string {
    return this.apiHelper.getAuthToken();
  }
}
