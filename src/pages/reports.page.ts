import { APIResponse } from "@playwright/test";
import { BasePage } from "./base.page";
import { ReportData } from "../types/api.types";
import { convertToFormData } from "../utils/api-helper";

export class ReportsPage extends BasePage {
  private readonly endpoints = {
    settings: "/reports/settings",
    submit: "/reports/submit",
    uploadMedia: (reportId: string) => `/reports/${reportId}/media/upload`,
  };

  async getSettings(): Promise<APIResponse> {
    return await this.apiHelper.get(this.endpoints.settings);
  }

  async submitReport(reportData: ReportData): Promise<APIResponse> {
    const formData = convertToFormData(reportData);
    return await this.apiHelper.post(
      this.endpoints.submit,
      formData,
      false,
      true
    );
  }

  async uploadMedia(reportId: string, fileData: any): Promise<APIResponse> {
    return await this.apiHelper.uploadFile(
      this.endpoints.uploadMedia(reportId),
      fileData,
      "file",
      false
    );
  }
}
