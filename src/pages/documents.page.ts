import { APIResponse } from "@playwright/test";
import { BasePage } from "./base.page";
import { UserDocument } from "../types/api.types";
import { convertToFormData } from "../utils/api-helper";

export class DocumentsPage extends BasePage {
  private readonly endpoints = {
    documents: "/user_document",
    documentById: (id: string) => `/user_document/${id}`,
  };

  async getUserDocuments(): Promise<APIResponse> {
    return await this.apiHelper.get(this.endpoints.documents, true);
  }

  async createUserDocument(documentData: UserDocument): Promise<APIResponse> {
    const formData = convertToFormData(documentData);
    return await this.apiHelper.post(
      this.endpoints.documents,
      formData,
      true,
      true
    );
  }

  async deleteUserDocument(id: string): Promise<APIResponse> {
    return await this.apiHelper.delete(this.endpoints.documentById(id), true);
  }
}
