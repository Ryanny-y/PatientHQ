export type UserRole = 'admin' | 'doctor' | 'nurse';

export interface ReportRecord {
  report_id: string | number;
  patient_id?: string | number;
  patient_name?: string;
  generated_by: string;
  generated_by_id?: string;
  report_type: string;
  summary: string;
  created_at: string;
}

export interface ReportDto {
  reportId: string;
  patientId: string;
  patientName?: string;
  generatedBy: string;
  generatedByUsername?: string;
  reportType: string;
  summary?: string;
  createdAt: string;
}

export interface GenerateReportRequest {
  patientId: string;
  generatedBy: string;
  reportType: string;
  summary?: string;
}

export interface ReportFilterOptions {
  search: string;
  dateRange: { from: Date | null; to: Date | null };
  reportType: string;
  generatedBy: string;
  sortBy: 'newest' | 'oldest';
}

export type HistoryEventType = 'MEDICAL_RECORD' | 'VITAL_SIGNS' | 'APPOINTMENT';

export interface HistoryEvent {
  patient_id: number;
  patient_name: string;
  event_type: HistoryEventType;
  reference_id: number;
  description: string;
  event_date: string;
}

export interface PatientSummary {
  patient_id: number;
  full_name: string;
  status: 'Active' | 'Discharged' | 'Under Review';
  assigned_doctor: string;
  last_visit: string;
  total_events: number;
}

export interface GenerateReportForm {
  report_type: string;
  patient_id: string;
  date_from?: string;
  date_to?: string;
  output_format: 'PDF' | 'CSV' | 'Print Preview';
  summary?: string;
}
