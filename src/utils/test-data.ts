import {
  generateRandomEmail,
  generateRandomMobile,
  generateRandomString,
  getCurrentDateTime,
} from "./api-helper";

export class TestDataFactory {
  static getUserRegistrationData(overrides?: any) {
    return {
      firstname: overrides?.firstname || "Test",
      lastname: overrides?.lastname || "User",
      mobile_country_code: overrides?.mobile_country_code || "+380",
      mobile_number:
        overrides?.mobile_number || generateRandomMobile().replace("+380", ""),
      dob: overrides?.dob || [1990, 1, 1],
      email: overrides?.email || generateRandomEmail(),
      password: overrides?.password || "Test123!@#Pass",
      password2: overrides?.password2 || "Test123!@#Pass",
      agree_to_terms: "1",
      ...overrides,
    };
  }

  static getLoginCredentials(overrides?: any) {
    return {
      username:
        overrides?.username ||
        process.env.TEST_USERNAME ||
        "test@example.com",
      password:
        overrides?.password || process.env.TEST_PASSWORD || "change_me",
      pin: overrides?.pin || process.env.TEST_PIN || "0000",
      device_platform:
        overrides?.device_platform || process.env.DEVICE_PLATFORM || "iphone",
      app_version: overrides?.app_version || process.env.APP_VERSION || "3.2",
      latitude:
        overrides?.latitude || process.env.TEST_LATITUDE || "51.50722232",
      longitude:
        overrides?.longitude || process.env.TEST_LONGITUDE || "-0.1275343123",
      altitude: overrides?.altitude || process.env.TEST_ALTITUDE || "125",
      accuracy: overrides?.accuracy || process.env.TEST_ACCURACY || "10",
      device_messaging_id:
        overrides?.device_messaging_id ||
        process.env.DEVICE_MESSAGING_ID ||
        "test_device_token",
      registration_id:
        overrides?.registration_id || process.env.REGISTRATION_ID || "",
      otp_code: overrides?.otp_code || process.env.OTP_CODE || "",
      imei: overrides?.imei || process.env.IMEI || "",
      ...overrides,
    };
  }

  static getLocationData(overrides?: any) {
    return {
      latitude: overrides?.latitude || "51.50722232",
      longitude: overrides?.longitude || "-0.1275343123",
      altitude: overrides?.altitude || "125",
      accuracy: overrides?.accuracy || "10",
      type: overrides?.type || "1",
      ghost_mode: overrides?.ghost_mode || "0",
      device_utc_time: overrides?.device_utc_time || getCurrentDateTime(),
      ...overrides,
    };
  }

  static getAlertData(overrides?: any) {
    return {
      event_type_id: overrides?.event_type_id || "2",
      type_trigger: overrides?.type_trigger || "1",
      device_utc_time: overrides?.device_utc_time || getCurrentDateTime(),
      ...overrides,
    };
  }

  static getDeviceStateData(overrides?: any) {
    return {
      gpsOn: overrides?.gpsOn || "1",
      wifiOn: overrides?.wifiOn || "1",
      batteryLevel: overrides?.batteryLevel || "80",
      buttonConnected: overrides?.buttonConnected || "0",
      networkConnection: overrides?.networkConnection || "2",
      powerSaveMode: overrides?.powerSaveMode || "0",
      ...overrides,
    };
  }

  static getMeetingData(overrides?: any) {
    return {
      notes: overrides?.notes || "Test meeting notes",
      timer: overrides?.timer || "1800",
      ...overrides,
    };
  }

  static getJourneyData(overrides?: any) {
    return {
      mode: overrides?.mode || "1",
      notes: overrides?.notes || "Test journey",
      start_latitude: overrides?.start_latitude || "50.2323232",
      start_longitude: overrides?.start_longitude || "28.32323232",
      start_address: overrides?.start_address || "Start Location",
      end_latitude: overrides?.end_latitude || "50.2311232",
      end_longitude: overrides?.end_longitude || "28.32321132",
      end_address: overrides?.end_address || "End Location",
      destination_distance_eta_meters:
        overrides?.destination_distance_eta_meters || "1000",
      destination_time_eta_seconds:
        overrides?.destination_time_eta_seconds || "600",
      ...overrides,
    };
  }

  static getUserPlaceData(overrides?: any) {
    return {
      name: overrides?.name || "Test Place",
      address: overrides?.address || "Test Address",
      latitude: overrides?.latitude || "12.44334378",
      longitude: overrides?.longitude || "8.56563",
      radius: overrides?.radius || "10",
      ...overrides,
    };
  }

  static getEmergencyContactGroupData(overrides?: any) {
    return {
      name: overrides?.name || `Test Group ${generateRandomString(5)}`,
      is_active: overrides?.is_active || "1",
      ...overrides,
    };
  }

  static getEmergencyContactData(overrides?: any) {
    return {
      group_id: overrides?.group_id || "1",
      name: overrides?.name || "Test Contact",
      email: overrides?.email || generateRandomEmail(),
      mobile_number: overrides?.mobile_number || generateRandomMobile(),
      mobile_country_code: overrides?.mobile_country_code || "+380",
      ...overrides,
    };
  }

  static getUserDocumentData(overrides?: any) {
    return {
      category: overrides?.category || "2",
      title: overrides?.title || "Test Document",
      description: overrides?.description || "Test document description",
      latitude: overrides?.latitude || "11.44334",
      longitude: overrides?.longitude || "18.56563",
      is_anonymous: overrides?.is_anonymous || "0",
      ...overrides,
    };
  }

  static getInviteUserData(overrides?: any) {
    return {
      firstname: overrides?.firstname || "Invited",
      lastname: overrides?.lastname || "User",
      email: overrides?.email || generateRandomEmail(),
      mobile_country_code: overrides?.mobile_country_code || "+380",
      mobile_number: overrides?.mobile_number || generateRandomMobile(),
      ...overrides,
    };
  }

  static getSharedLocationData(overrides?: any) {
    return {
      duration: overrides?.duration || "3600",
      recipients: overrides?.recipients || [
        {
          name: "Test Recipient",
          email: generateRandomEmail(),
          phone: generateRandomMobile(),
          device_platform: "android",
          device_messaging_id: "test_device_id",
        },
      ],
      ...overrides,
    };
  }

  static getReportData(overrides?: any) {
    return {
      arc_id: overrides?.arc_id || "1",
      is_anonymous: overrides?.is_anonymous || "1",
      category_id: overrides?.category_id || "1",
      device_fingerprint:
        overrides?.device_fingerprint || generateRandomString(36),
      latitude: overrides?.latitude || "34.9748649",
      longitude: overrides?.longitude || "33.6800112",
      severity_level: overrides?.severity_level || "0",
      ...overrides,
    };
  }

  static getDeviceData(overrides?: any) {
    return {
      name: overrides?.name || "Test Device",
      device_type_id: overrides?.device_type_id || "190",
      configuration: overrides?.configuration || {
        ident: "123456789012",
        phone: generateRandomMobile(),
      },
      ...overrides,
    };
  }

  static getReviewData(overrides?: any) {
    return {
      text: overrides?.text || "Great app!",
      rate: overrides?.rate || "5",
      ...overrides,
    };
  }

  static getCheckinData(overrides?: any) {
    return {
      latitude: overrides?.latitude || "50.2323232",
      longitude: overrides?.longitude || "28.32323232",
      location_address: overrides?.location_address || "Test Location",
      description: overrides?.description || "Checked in",
      ...overrides,
    };
  }
}
