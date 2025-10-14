import { APIResponse } from "@playwright/test";
import { BasePage } from "./base.page";
import { LoginCredentials } from "../types/api.types";
import { convertToFormData } from "../utils/api-helper";

export class AuthPage extends BasePage {
  private readonly endpoints = {
    login: "/auth",
    logout: "/user/logout",
  };

  async login(credentials: LoginCredentials): Promise<APIResponse> {
    const formData = convertToFormData(credentials);
    return await this.apiHelper.post(
      this.endpoints.login,
      formData,
      false,
      true
    );
  }

  async logout(): Promise<APIResponse> {
    return await this.apiHelper.get(this.endpoints.logout, true);
  }
}
