import { APIResponse } from "@playwright/test";
import { BasePage } from "./base.page";
import { DeviceData, ReviewData } from "../types/api.types";
import { convertToFormData } from "../utils/api-helper";

export class UserPage extends BasePage {
  private readonly endpoints = {
    profile: "/user/profile",
    handsetStolen: "/user/handset_stolen",
    appCache: "/user/app_cache",
    appSettings: "/user/app_settings",
    ordersHistory: "/user/ordersHistory",
    personalDataDownload: "/user/personalDataDownload",
    supportedDevices: "/user/supported_devices",
    cancelSubscription: "/user/cancelSubscription",
    device: "/user/device",
    deviceById: (id: string) => `/user/device/${id}`,
    requestAccountInfo: "/user/requestAccountInfo",
    cancelTrialTimer: "/user/cancel_trial_timer",
    addDevice: "/user/addDevice",
    addReview: "/user/addReview",
    deleteAccount: "/user/deleteAccount",
    deleteAccountCancel: "/user/deleteAccountCancel",
    password: "/user/password",
    mobile: "/user/mobile",
    deviceToken: "/user/device_token",
  };

  async getProfile(): Promise<APIResponse> {
    return await this.apiHelper.get(this.endpoints.profile, true);
  }

  async getHandsetStolen(): Promise<APIResponse> {
    return await this.apiHelper.get(this.endpoints.handsetStolen, true);
  }

  async getAppCache(): Promise<APIResponse> {
    return await this.apiHelper.get(this.endpoints.appCache, true);
  }

  async getAppSettings(): Promise<APIResponse> {
    return await this.apiHelper.get(this.endpoints.appSettings, true);
  }

  async getOrdersHistory(): Promise<APIResponse> {
    return await this.apiHelper.get(this.endpoints.ordersHistory, true);
  }

  async personalDataDownload(): Promise<APIResponse> {
    return await this.apiHelper.get(this.endpoints.personalDataDownload, true);
  }

  async getSupportedDevices(): Promise<APIResponse> {
    return await this.apiHelper.get(this.endpoints.supportedDevices, true);
  }

  async cancelSubscription(): Promise<APIResponse> {
    return await this.apiHelper.get(this.endpoints.cancelSubscription, true);
  }

  async listDevices(): Promise<APIResponse> {
    return await this.apiHelper.get(this.endpoints.device, true);
  }

  async requestAccountInfo(): Promise<APIResponse> {
    return await this.apiHelper.get(this.endpoints.requestAccountInfo, true);
  }

  async deleteDevice(deviceId: string): Promise<APIResponse> {
    return await this.apiHelper.delete(
      this.endpoints.deviceById(deviceId),
      true
    );
  }

  async cancelTrialTimer(): Promise<APIResponse> {
    return await this.apiHelper.post(this.endpoints.cancelTrialTimer, {}, true);
  }

  async addDevice(deviceData: DeviceData): Promise<APIResponse> {
    const formData = convertToFormData({
      name: deviceData.name,
      device_type_id: deviceData.device_type_id,
      "configuration[ident]": deviceData.configuration.ident,
      "configuration[phone]": deviceData.configuration.phone,
    });
    return await this.apiHelper.post(
      this.endpoints.addDevice,
      formData,
      true,
      true
    );
  }

  async addReview(reviewData: ReviewData): Promise<APIResponse> {
    const formData = convertToFormData(reviewData);
    return await this.apiHelper.post(
      this.endpoints.addReview,
      formData,
      true,
      true
    );
  }

  async deleteAccount(): Promise<APIResponse> {
    return await this.apiHelper.post(
      this.endpoints.deleteAccount,
      {},
      true,
      true
    );
  }

  async deleteAccountCancel(): Promise<APIResponse> {
    return await this.apiHelper.post(
      this.endpoints.deleteAccountCancel,
      {},
      true,
      true
    );
  }

  async updatePasswordPerPrompt(password: string): Promise<APIResponse> {
    const formData = convertToFormData({ password });
    return await this.apiHelper.post(
      this.endpoints.password,
      formData,
      true,
      true
    );
  }

  async updateMobileNumber(mobileData: any): Promise<APIResponse> {
    return await this.apiHelper.put(this.endpoints.mobile, mobileData, true);
  }

  async updateAppCache(cacheData: any): Promise<APIResponse> {
    return await this.apiHelper.put(this.endpoints.appCache, cacheData, true);
  }

  async updateProfile(profileData: any): Promise<APIResponse> {
    return await this.apiHelper.put(this.endpoints.profile, profileData, true);
  }

  async updateDeviceToken(tokenData: any): Promise<APIResponse> {
    return await this.apiHelper.put(
      this.endpoints.deviceToken,
      tokenData,
      true
    );
  }
}
