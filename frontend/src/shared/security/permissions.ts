import { useAuth, type AuthUser } from "@/shared/context/AuthContext";

export const PERMISSIONS = {
  DASHBOARD_VIEW: "DASHBOARD_VIEW",

  USER_MANAGEMENT_VIEW: "USER_MANAGEMENT_VIEW",
  USER_MANAGEMENT_CREATE: "USER_MANAGEMENT_CREATE",
  USER_MANAGEMENT_UPDATE: "USER_MANAGEMENT_UPDATE",
  USER_MANAGEMENT_DELETE: "USER_MANAGEMENT_DELETE",

  PATIENT_VIEW: "PATIENT_VIEW",
  PATIENT_CREATE: "PATIENT_CREATE",
  PATIENT_UPDATE: "PATIENT_UPDATE",
  PATIENT_DELETE: "PATIENT_DELETE",

  DOCTOR_ASSIGNMENT_ASSIGN: "DOCTOR_ASSIGNMENT_ASSIGN",
  DOCTOR_ASSIGNMENT_VIEW: "DOCTOR_ASSIGNMENT_VIEW",

  MEDICAL_RECORD_VIEW: "MEDICAL_RECORD_VIEW",
  MEDICAL_RECORD_CREATE: "MEDICAL_RECORD_CREATE",
  MEDICAL_RECORD_UPDATE: "MEDICAL_RECORD_UPDATE",

  VITAL_SIGNS_VIEW: "VITAL_SIGNS_VIEW",
  VITAL_SIGNS_CREATE: "VITAL_SIGNS_CREATE",

  APPOINTMENT_VIEW: "APPOINTMENT_VIEW",
  APPOINTMENT_CREATE: "APPOINTMENT_CREATE",
  APPOINTMENT_UPDATE: "APPOINTMENT_UPDATE",

  REPORT_VIEW: "REPORT_VIEW",
  REPORT_GENERATE: "REPORT_GENERATE",

  AUDIT_LOG_VIEW: "AUDIT_LOG_VIEW",

  DATA_INTEGRITY_VIEW: "DATA_INTEGRITY_VIEW",
  DATA_INTEGRITY_VERIFY: "DATA_INTEGRITY_VERIFY",

  SYSTEM_SETTINGS_VIEW: "SYSTEM_SETTINGS_VIEW",
  SYSTEM_SETTINGS_UPDATE: "SYSTEM_SETTINGS_UPDATE",

  PATIENT_HISTORY_VIEW: "PATIENT_HISTORY_VIEW",

  ROLE_MANAGEMENT_VIEW: "ROLE_MANAGEMENT_VIEW",
  ROLE_MANAGEMENT_CREATE: "ROLE_MANAGEMENT_CREATE",
  ROLE_MANAGEMENT_UPDATE: "ROLE_MANAGEMENT_UPDATE",
  ROLE_MANAGEMENT_DELETE: "ROLE_MANAGEMENT_DELETE",

  PERMISSION_MANAGEMENT_VIEW: "PERMISSION_MANAGEMENT_VIEW",
  PERMISSION_MANAGEMENT_CREATE: "PERMISSION_MANAGEMENT_CREATE",
  PERMISSION_MANAGEMENT_UPDATE: "PERMISSION_MANAGEMENT_UPDATE",
  PERMISSION_MANAGEMENT_DELETE: "PERMISSION_MANAGEMENT_DELETE",
} as const;

export type PermissionName = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const hasPermission = (
  user: Pick<AuthUser, "permissions"> | null | undefined,
  permission: PermissionName | string
): boolean => {
  return user?.permissions?.includes(permission) ?? false;
};

export const hasAnyPermission = (
  user: Pick<AuthUser, "permissions"> | null | undefined,
  permissions: Array<PermissionName | string>
): boolean => {
  return permissions.some(p =>
    user?.permissions?.includes(p)
  );
};

export const usePermission = (permission: PermissionName | string): boolean => {
  const { user } = useAuth();
  return hasPermission(user, permission);
};

export const usePermissions = () => {
  const { user } = useAuth();

  return {
    can: (permission: PermissionName | string) => hasPermission(user, permission),
    canAny: (permissions: Array<PermissionName | string>) =>
      hasAnyPermission(user, permissions),
  };
};
