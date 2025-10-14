export interface UserRegistrationData {
  firstname: string;
  lastname: string;
  mobile_country_code: string;
  mobile_number: string;
  dob: number[];
  email: string;
  password: string;
  password2: string;
  agree_to_terms: string;
  coupon_code?: string;
  initial_payment_plan_arc_id?: string;
  profile_language_id?: string;
  pin?: string;
  emergency_contacts?: EmergencyContact[];
}

export interface EmergencyContact {
  name: string;
  email: string;
  mobile_number: string;
  mobile_country_code: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  pin?: string;
  mobile_number?: string;
  device_messaging_id?: string;
  device_platform?: string;
  app_version?: string;
  latitude?: string;
  longitude?: string;
  altitude?: string;
  accuracy?: string;
  otp_code?: string;
}

export interface LocationData {
  latitude: string;
  longitude: string;
  altitude?: string;
  accuracy?: string;
  type: string;
  ghost_mode?: string;
  device_utc_time: string;
}

export interface AlertData {
  event_type_id: string;
  type_trigger: string;
  device_utc_time: string;
  testAlert?: string;
}

export interface DeviceStateData {
  gpsOn: string;
  wifiOn: string;
  batteryLevel: string;
  buttonConnected?: string;
  buttonBatteryLevel?: string;
  networkConnection: string;
  powerSaveMode: string;
  wifiScanResults?: string;
}

export interface MeetingData {
  notes: string;
  timer: string;
  custom_meeting_checkbox?: string;
}

export interface JourneyData {
  mode?: string;
  notes?: string;
  start_label?: string;
  start_latitude: string;
  start_longitude: string;
  start_address?: string;
  end_label?: string;
  end_latitude: string;
  end_longitude: string;
  end_address?: string;
  destination_distance_eta_meters?: string;
  destination_time_eta_seconds?: string;
}

export interface UserPlace {
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  radius: string;
  avatar?: string;
}

export interface EmergencyContactGroup {
  name: string;
  is_active: string;
}

export interface UserEmergencyContact {
  group_id: string;
  name: string;
  firstname?: string;
  lastname?: string;
  email: string;
  mobile_number: string;
  mobile_country_code: string;
  avatar?: string;
}

export interface UserDocument {
  arc_report_category_id?: string;
  category: string;
  title: string;
  description: string;
  latitude?: string;
  longitude?: string;
  is_anonymous?: string;
}

export interface InviteUser {
  firstname: string;
  lastname: string;
  email: string;
  mobile_country_code: string;
  mobile_country_id?: string;
  mobile_number: string;
}

export interface SharedLocationData {
  duration: string;
  recipients: SharedLocationRecipient[];
}

export interface SharedLocationRecipient {
  name: string;
  email: string;
  phone: string;
  device_platform?: string;
  device_messaging_id?: string;
}

export interface ReportData {
  arc_id: string;
  user_id?: string;
  is_anonymous: string;
  category_id: string;
  device_fingerprint: string;
  latitude: string;
  longitude: string;
  device_latitude?: string;
  device_longitude?: string;
  description?: string;
  address?: string;
  severity_level?: string;
  additional_question_answers_json?: string;
  custom_created_at?: string;
}

export interface APIResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
  errors?: any;
}

export interface DeviceData {
  name: string;
  device_type_id: string;
  configuration: {
    ident: string;
    phone: string;
  };
}

export interface ReviewData {
  text: string;
  rate: string;
}

export interface CheckinData {
  latitude: string;
  longitude: string;
  location_address?: string;
  description?: string;
}
