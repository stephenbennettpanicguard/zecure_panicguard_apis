import { APIResponse } from "@playwright/test";
import { BasePage } from "./base.page";
import {
  EmergencyContactGroup,
  UserEmergencyContact,
} from "../types/api.types";
import { convertToFormData } from "../utils/api-helper";

export class EmergencyContactsPage extends BasePage {
  private readonly endpoints = {
    groups: "/user_emergency_contact_group",
    groupById: (id: string) => `/user_emergency_contact_group/${id}`,
    contacts: "/user_emergency_contact",
    contactById: (id: string) => `/user_emergency_contact/${id}`,
  };

  // Emergency Contact Groups
  async getEmergencyContactGroups(): Promise<APIResponse> {
    return await this.apiHelper.get(this.endpoints.groups, true);
  }

  async createEmergencyContactGroup(
    groupData: EmergencyContactGroup
  ): Promise<APIResponse> {
    const formData = convertToFormData(groupData);
    return await this.apiHelper.post(
      this.endpoints.groups,
      formData,
      true,
      true
    );
  }

  async updateEmergencyContactGroup(
    id: string,
    groupData: Partial<EmergencyContactGroup>
  ): Promise<APIResponse> {
    return await this.apiHelper.put(
      this.endpoints.groupById(id),
      groupData,
      true
    );
  }

  async deleteEmergencyContactGroup(id: string): Promise<APIResponse> {
    return await this.apiHelper.delete(this.endpoints.groupById(id), true);
  }

  // Emergency Contacts
  async getEmergencyContacts(): Promise<APIResponse> {
    return await this.apiHelper.get(this.endpoints.contacts, true);
  }

  async createEmergencyContact(
    contactData: UserEmergencyContact
  ): Promise<APIResponse> {
    const formData = convertToFormData(contactData);
    return await this.apiHelper.post(
      this.endpoints.contacts,
      formData,
      true,
      true
    );
  }

  async updateEmergencyContact(
    id: string,
    contactData: Partial<UserEmergencyContact>
  ): Promise<APIResponse> {
    return await this.apiHelper.put(
      this.endpoints.contactById(id),
      contactData,
      true
    );
  }

  async deleteEmergencyContact(id: string): Promise<APIResponse> {
    return await this.apiHelper.delete(this.endpoints.contactById(id), true);
  }
}
