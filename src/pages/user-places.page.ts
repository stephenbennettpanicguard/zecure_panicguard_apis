import { APIResponse } from "@playwright/test";
import { BasePage } from "./base.page";
import { UserPlace } from "../types/api.types";
import { convertToFormData } from "../utils/api-helper";

export class UserPlacesPage extends BasePage {
  private readonly endpoints = {
    userPlaces: "/user_place",
    userPlaceById: (id: string) => `/user_place/${id}`,
  };

  async getUserPlaces(): Promise<APIResponse> {
    return await this.apiHelper.get(this.endpoints.userPlaces, true);
  }

  async createUserPlace(placeData: UserPlace): Promise<APIResponse> {
    const formData = convertToFormData(placeData);
    return await this.apiHelper.post(
      this.endpoints.userPlaces,
      formData,
      true,
      true
    );
  }

  async updateUserPlace(
    id: string,
    placeData: Partial<UserPlace>
  ): Promise<APIResponse> {
    return await this.apiHelper.put(
      this.endpoints.userPlaceById(id),
      placeData,
      true
    );
  }

  async deleteUserPlace(id: string): Promise<APIResponse> {
    return await this.apiHelper.delete(this.endpoints.userPlaceById(id), true);
  }
}
