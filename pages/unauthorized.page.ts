import { APIResponse } from "@playwright/test";
import { BasePage } from "./base.page";
import { UserRegistrationData } from "../types/api.types";
import { convertToFormData } from "../utils/api-helper";

export class UnauthorizedPage extends BasePage {
  private readonly endpoints = {
    appSettings: "/unauthorized/app_settings",
    resetPassword: "/unauthorized/reset_password",
    credentialsForgotten: "/unauthorized/credentials_forgotten",
    emailTaken: "/unauthorized/email_taken",
    userRegister: "/unauthorized/user_register",
    userRegisterPaymentStripe: (userId: string) =>
      `/unauthorized/user/${userId}/userRegisterPaymentStripe`,
    userRegisterAddInviteUsers: (userId: string) =>
      `/unauthorized/user/${userId}/userRegisterAddInviteUsers`,
    sendVerificationSms: "/unauthorized/mobileNumber/sendVerificationSms",
    verifyByCode: "/unauthorized/mobileNumber/verifyByCode",
    getCouponCode: "/unauthorized/getCouponCode",
    updateUserProfile: (userId: string) =>
      `/unauthorized/user/${userId}/profile_update`,
  };

  async getAppSettings(): Promise<APIResponse> {
    return await this.apiHelper.get(this.endpoints.appSettings);
  }

  async resetPassword(email: string): Promise<APIResponse> {
    const formData = convertToFormData({ email });
    return await this.apiHelper.post(
      this.endpoints.resetPassword,
      formData,
      false,
      true
    );
  }

  async credentialsForgotten(
    type: string,
    identifier: string
  ): Promise<APIResponse> {
    const formData = convertToFormData({ type, identifier });
    return await this.apiHelper.post(
      this.endpoints.credentialsForgotten,
      formData,
      false,
      true
    );
  }

  async isEmailTaken(email: string): Promise<APIResponse> {
    const formData = convertToFormData({ email });
    return await this.apiHelper.post(
      this.endpoints.emailTaken,
      formData,
      false,
      true
    );
  }

  async userRegister(userData: UserRegistrationData): Promise<APIResponse> {
    const formData: any = {
      "data[firstname]": userData.firstname,
      "data[lastname]": userData.lastname,
      "data[mobile_country_code]": userData.mobile_country_code,
      "data[mobile_number]": userData.mobile_number,
      "data[email]": userData.email,
      "data[password]": userData.password,
      "data[password2]": userData.password2,
      "data[agree_to_terms]": userData.agree_to_terms,
    };

    // Only add date of birth if it exists and is valid
    if (
      userData.dob &&
      Array.isArray(userData.dob) &&
      userData.dob.length >= 3
    ) {
      formData["data[dob][0]"] = userData.dob[0].toString();
      formData["data[dob][1]"] = userData.dob[1].toString();
      formData["data[dob][2]"] = userData.dob[2].toString();
    }

    if (userData.emergency_contacts && userData.emergency_contacts.length > 0) {
      userData.emergency_contacts.forEach((contact, index) => {
        formData[`data[emergency_contacts][${index}][name]`] = contact.name;
        formData[`data[emergency_contacts][${index}][email]`] = contact.email;
        formData[`data[emergency_contacts][${index}][mobile_number]`] =
          contact.mobile_number;
        formData[`data[emergency_contacts][${index}][mobile_country_code]`] =
          contact.mobile_country_code;
      });
    }

    return await this.apiHelper.post(
      this.endpoints.userRegister,
      formData,
      false,
      true
    );
  }

  async userRegisterPaymentStripe(
    userId: string,
    paymentData: any
  ): Promise<APIResponse> {
    const formData = convertToFormData(paymentData);
    return await this.apiHelper.post(
      this.endpoints.userRegisterPaymentStripe(userId),
      formData,
      false,
      true
    );
  }

  async userRegisterAddInviteUsers(
    userId: string,
    users: any[]
  ): Promise<APIResponse> {
    const formData: any = {};
    users.forEach((user, index) => {
      formData[`users[${index}][firstname]`] = user.firstname;
      formData[`users[${index}][lastname]`] = user.lastname;
      formData[`users[${index}][email]`] = user.email;
      formData[`users[${index}][mobile_country_id]`] = user.mobile_country_id;
      formData[`users[${index}][mobile_number]`] = user.mobile_number;
    });

    return await this.apiHelper.post(
      this.endpoints.userRegisterAddInviteUsers(userId),
      formData,
      false,
      true
    );
  }

  async sendVerificationSms(
    mobileNumber: string,
    appSmsHash?: string
  ): Promise<APIResponse> {
    const formData = convertToFormData({
      mobile_number: mobileNumber,
      appSmsHash,
    });
    return await this.apiHelper.post(
      this.endpoints.sendVerificationSms,
      formData,
      false,
      true
    );
  }

  async verifyByCode(
    verificationId: string,
    verificationCode: string
  ): Promise<APIResponse> {
    const formData = convertToFormData({
      verification_id: verificationId,
      verification_code: verificationCode,
    });
    return await this.apiHelper.post(
      this.endpoints.verifyByCode,
      formData,
      false,
      true
    );
  }

  async getCouponCode(code: string): Promise<APIResponse> {
    const formData = convertToFormData({ code });
    return await this.apiHelper.post(
      this.endpoints.getCouponCode,
      formData,
      false,
      true
    );
  }

  async updateUserProfile(
    userId: string,
    profileData: any
  ): Promise<APIResponse> {
    const formData = convertToFormData(profileData);
    return await this.apiHelper.post(
      this.endpoints.updateUserProfile(userId),
      formData,
      false,
      true
    );
  }
}
