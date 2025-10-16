import { APIResponse } from "@playwright/test";
import { BasePage } from "./base.page";
import { convertToFormData } from "../utils/api-helper";

export class MiscPage extends BasePage {
  private readonly endpoints = {
    safePlaces: "/safe_places",
    sessionState: (area: string) => `/sessionState/${area}`,
    subuserAuth: "/subuser/auth",
    subuserSignout: "/subuser/signout",
    mobileAppMessages: "/mobileAppMessages",
    mobileAppMessagesTypes: "/mobileAppMessages/types",
    mobileAppMessageStatus: (id: string) => `/mobileAppMessages/${id}/status`,
    mobileAppMessageArchived: (id: string) =>
      `/mobileAppMessages/${id}/archived`,
    fileUpload: (entity: string, field: string, entityId: string = "0") =>
      `/file_upload/${entity}/${field}/${entityId}`,
    deleteUserAvatar: "/file_upload/user/avatar",
    zones: "/zones",
  };

  // Safe Places
  async getSafePlaces(): Promise<APIResponse> {
    return await this.apiHelper.get(this.endpoints.safePlaces, true);
  }

  // Session States
  async getSessionState(area: string): Promise<APIResponse> {
    return await this.apiHelper.get(this.endpoints.sessionState(area), true);
  }

  // Subusers
  async subuserLogin(username: string, password: string): Promise<APIResponse> {
    const formData = convertToFormData({ username, password });
    return await this.apiHelper.post(
      this.endpoints.subuserAuth,
      formData,
      false,
      true
    );
  }

  async subuserLogout(userId: string): Promise<APIResponse> {
    const formData = convertToFormData({ user_id: userId });
    return await this.apiHelper.post(
      this.endpoints.subuserSignout,
      formData,
      true,
      true
    );
  }

  // Mobile App Messages
  async getMessages(params?: {
    limit?: number;
    page?: number;
    types?: string;
  }): Promise<APIResponse> {
    let endpoint = this.endpoints.mobileAppMessages;
    if (params) {
      const queryParams = new URLSearchParams();
      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.types) queryParams.append("types", params.types);
      endpoint = `${endpoint}?${queryParams.toString()}`;
    }
    return await this.apiHelper.get(endpoint, true);
  }

  async getMessageTypes(): Promise<APIResponse> {
    return await this.apiHelper.get(
      this.endpoints.mobileAppMessagesTypes,
      true
    );
  }

  async updateMessageStatus(id: string, status: number): Promise<APIResponse> {
    return await this.apiHelper.put(
      this.endpoints.mobileAppMessageStatus(id),
      { status },
      true
    );
  }

  async updateMessageArchived(
    id: string,
    archived: number
  ): Promise<APIResponse> {
    return await this.apiHelper.put(
      this.endpoints.mobileAppMessageArchived(id),
      { archived },
      true
    );
  }

  // File Upload
  async uploadFile(
    entity: string,
    field: string,
    entityId: string = "0",
    eventHash?: string
  ): Promise<APIResponse> {
    let endpoint = this.endpoints.fileUpload(entity, field, entityId);
    if (eventHash) {
      endpoint = `${endpoint}?eventHash=${eventHash}`;
    }
    return await this.apiHelper.uploadFile(
      endpoint,
      "test_file.txt",
      "file",
      true
    );
  }

  async deleteUserAvatar(): Promise<APIResponse> {
    return await this.apiHelper.delete(this.endpoints.deleteUserAvatar, true);
  }

  // Zones
  async getZones(): Promise<APIResponse> {
    return await this.apiHelper.get(this.endpoints.zones, true);
  }
}
