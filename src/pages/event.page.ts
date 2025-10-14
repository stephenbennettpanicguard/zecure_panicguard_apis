import { APIResponse } from "@playwright/test";
import { BasePage } from "./base.page";
import {
  LocationData,
  AlertData,
  DeviceStateData,
  MeetingData,
  JourneyData,
  CheckinData,
  SharedLocationData,
} from "../types/api.types";
import { convertToFormData } from "../utils/api-helper";

export class EventPage extends BasePage {
  private readonly endpoints = {
    location: "/event/location",
    alertType: "/event/type",
    deviceState: "/event/deviceState",
    chatChannel: "/event/chatChannel",
    chatChannelUser: "/event/chatChannel/user",
    meetingCreate: "/event/meeting/create",
    meetingUpdate: "/event/meeting/update",
    meetingCancel: "/event/meeting/cancel",
    journeyStart: "/event/journey/start",
    journeyEnd: "/event/journey/end",
    journeyCancel: "/event/journey/cancel",
    checkinCreate: "/event/checkin/create",
    checkout: "/event/checkin/checkout",
    sharedLocation: "/event/sharedLocation",
    sharedLocationById: (id: string) => `/event/sharedLocation/${id}`,
    mySharedLocation: "/event/mySharedLocation",
    sharedLocationRecipientDelete: (id: string) =>
      `/event/sharedLocationRecipient/${id}/delete`,
    sharedLocationRecipientUpdate: (id: string) =>
      `/event/sharedLocationRecipient/${id}/update`,
    dispatch: (action: string) => `/event/dispatch/${action}`,
    testAlert: "/event/testAlert",
    dispatchAlert: (alertId: string) => `/event/dispatchAlert/${alertId}`,
    closeAlert: "/event/closeAlert",
    requestBackup: "/event/requestBackup",
  };

  async postLocation(locationData: LocationData): Promise<APIResponse> {
    const formData = convertToFormData(locationData);
    return await this.apiHelper.post(
      this.endpoints.location,
      formData,
      true,
      true
    );
  }

  async changeAlertType(alertData: AlertData): Promise<APIResponse> {
    const formData = convertToFormData(alertData);
    return await this.apiHelper.post(
      this.endpoints.alertType,
      formData,
      true,
      true
    );
  }

  async postDeviceState(
    deviceStateData: DeviceStateData
  ): Promise<APIResponse> {
    const formData = convertToFormData(deviceStateData);
    return await this.apiHelper.post(
      this.endpoints.deviceState,
      formData,
      true,
      true
    );
  }

  async createChatChannel(): Promise<APIResponse> {
    return await this.apiHelper.post(
      this.endpoints.chatChannel,
      {},
      true,
      true
    );
  }

  async getChatChannel(): Promise<APIResponse> {
    return await this.apiHelper.get(this.endpoints.chatChannel, true);
  }

  async getChatChannelUserData(): Promise<APIResponse> {
    return await this.apiHelper.get(this.endpoints.chatChannelUser, true);
  }

  async createMeeting(meetingData: MeetingData): Promise<APIResponse> {
    const formData = convertToFormData(meetingData);
    return await this.apiHelper.post(
      this.endpoints.meetingCreate,
      formData,
      true,
      true
    );
  }

  async updateMeeting(meetingData: MeetingData): Promise<APIResponse> {
    const formData = convertToFormData(meetingData);
    return await this.apiHelper.post(
      this.endpoints.meetingUpdate,
      formData,
      true,
      true
    );
  }

  async cancelMeeting(): Promise<APIResponse> {
    return await this.apiHelper.get(this.endpoints.meetingCancel, true);
  }

  async startJourney(journeyData: JourneyData): Promise<APIResponse> {
    const formData = convertToFormData(journeyData);
    return await this.apiHelper.post(
      this.endpoints.journeyStart,
      formData,
      true,
      true
    );
  }

  async endJourney(): Promise<APIResponse> {
    return await this.apiHelper.get(this.endpoints.journeyEnd, true);
  }

  async cancelJourney(): Promise<APIResponse> {
    return await this.apiHelper.get(this.endpoints.journeyCancel, true);
  }

  async createCheckin(checkinData: CheckinData): Promise<APIResponse> {
    const formData = convertToFormData(checkinData);
    return await this.apiHelper.post(
      this.endpoints.checkinCreate,
      formData,
      true,
      true
    );
  }

  async checkout(): Promise<APIResponse> {
    return await this.apiHelper.get(this.endpoints.checkout, true);
  }

  async createSharedLocation(
    sharedLocationData: SharedLocationData
  ): Promise<APIResponse> {
    const formData: any = {
      duration: sharedLocationData.duration,
    };

    sharedLocationData.recipients.forEach((recipient, index) => {
      formData[`recipients[${index}][name]`] = recipient.name;
      formData[`recipients[${index}][email]`] = recipient.email;
      formData[`recipients[${index}][phone]`] = recipient.phone;
      if (recipient.device_platform) {
        formData[`recipients[${index}][device_platform]`] =
          recipient.device_platform;
      }
      if (recipient.device_messaging_id) {
        formData[`recipients[${index}][device_messaging_id]`] =
          recipient.device_messaging_id;
      }
    });

    return await this.apiHelper.post(
      this.endpoints.sharedLocation,
      formData,
      true,
      true
    );
  }

  async getSharedLocation(id: string): Promise<APIResponse> {
    return await this.apiHelper.get(
      this.endpoints.sharedLocationById(id),
      true
    );
  }

  async getMySharedLocation(): Promise<APIResponse> {
    return await this.apiHelper.get(this.endpoints.mySharedLocation, true);
  }

  async deleteSharedLocation(id: string): Promise<APIResponse> {
    return await this.apiHelper.delete(
      this.endpoints.sharedLocationById(id),
      true
    );
  }

  async deleteSharedLocationRecipient(id: string): Promise<APIResponse> {
    return await this.apiHelper.post(
      this.endpoints.sharedLocationRecipientDelete(id),
      {},
      true,
      true
    );
  }

  async updateSharedLocationRecipient(
    id: string,
    duration: string
  ): Promise<APIResponse> {
    const formData = convertToFormData({ duration });
    return await this.apiHelper.post(
      this.endpoints.sharedLocationRecipientUpdate(id),
      formData,
      true,
      true
    );
  }

  async appendToSharedLocation(id: string, data: any): Promise<APIResponse> {
    return await this.apiHelper.put(
      this.endpoints.sharedLocationById(id),
      data,
      true
    );
  }

  async dispatchGuard(action: string, dispatchData: any): Promise<APIResponse> {
    const formData = convertToFormData(dispatchData);
    return await this.apiHelper.post(
      this.endpoints.dispatch(action),
      formData,
      true,
      true
    );
  }

  async testAlert(): Promise<APIResponse> {
    return await this.apiHelper.get(this.endpoints.testAlert, true);
  }

  async getDispatchAlert(alertId: string): Promise<APIResponse> {
    return await this.apiHelper.get(
      this.endpoints.dispatchAlert(alertId),
      true
    );
  }

  async closeAlert(): Promise<APIResponse> {
    return await this.apiHelper.get(this.endpoints.closeAlert, true);
  }

  async requestBackup(): Promise<APIResponse> {
    return await this.apiHelper.get(this.endpoints.requestBackup, true);
  }
}
