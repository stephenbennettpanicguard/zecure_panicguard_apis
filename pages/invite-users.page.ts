import { APIResponse } from "@playwright/test";
import { BasePage } from "./base.page";
import { InviteUser } from "../types/api.types";
import { convertToFormData } from "../utils/api-helper";

export class InviteUsersPage extends BasePage {
  private readonly endpoints = {
    list: "/inviteUsers/list",
    inviteUsers: "/inviteUsers",
    inviteUserById: (id: string) => `/inviteUsers/${id}`,
  };

  async getInviteUsers(): Promise<APIResponse> {
    return await this.apiHelper.post(this.endpoints.list, {}, true, true);
  }

  async createInviteUser(userData: InviteUser): Promise<APIResponse> {
    const formData = convertToFormData(userData);
    return await this.apiHelper.post(
      this.endpoints.inviteUsers,
      formData,
      true,
      true
    );
  }

  async updateInviteUser(
    id: string,
    userData: Partial<InviteUser>
  ): Promise<APIResponse> {
    return await this.apiHelper.put(
      this.endpoints.inviteUserById(id),
      userData,
      true
    );
  }

  async deleteInviteUser(id: string): Promise<APIResponse> {
    return await this.apiHelper.delete(this.endpoints.inviteUserById(id), true);
  }
}
