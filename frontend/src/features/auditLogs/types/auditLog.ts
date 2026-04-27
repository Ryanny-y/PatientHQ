export interface AuditLog {
  log_id: number;
  user_id: number;
  username: string;
  role: string;
  action: string;
  entity_type: string;
  entity_id: number;
  description: string;
  ip_address: string;
  severity: 'Info' | 'Warning' | 'Critical';
  created_at: string;
}

export type modalMode = 'view-details' | 'export-logs' | null;

export type roleFilter = 'All' | 'Admin' | 'Doctor' | 'Nurse';

export type entityTypeFilter = 'All' | 'USER' | 'PATIENT' | 'MEDICAL_RECORD' | 'APPOINTMENT' | 'REPORT' | 'SYSTEM_SETTING' | 'LOGIN' | 'SECURITY';

export type severityFilter = 'All' | 'Info' | 'Warning' | 'Critical';

export type sortOption = 'newest' | 'oldest';

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}