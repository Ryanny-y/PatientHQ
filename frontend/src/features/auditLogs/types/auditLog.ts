export interface AuditLog {
  log_id: string;
  user_id: string;
  username: string;
  role: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  description: string;
  ip_address: string;
  severity: 'Info' | 'Warning' | 'Critical';
  created_at: string;
}

export type modalMode = 'view-details' | null;

export type roleFilter = 'All' | 'Admin' | 'Doctor' | 'Nurse';

export type entityTypeFilter = 'All' | 'USER' | 'PATIENT' | 'MEDICAL_RECORD' | 'APPOINTMENT' | 'REPORT' | 'SYSTEM_SETTING' | 'LOGIN' | 'SECURITY';

export type severityFilter = 'All' | 'Info' | 'Warning' | 'Critical';

export type sortOption = 'newest' | 'oldest';

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export interface AuditLogMetadata {
  totalLogsToday: number;
  failedLoginAttempts: number;
  criticalActions: number;
  activeUsersToday: number;
}
