export interface MedicalRecord {
  record_id: number;
  patient_id: number;
  patient_name: string;
  doctor_id: number;
  doctor_name: string;
  diagnosis: string;
  treatment: string;
  prescription: string;
  notes: string;
  created_at: string;
  last_updated?: string;
  patient_status?: 'Active' | 'Inactive' | 'Discharged';
  appointment_summary?: string;
}

export interface MedicalRecordFormData {
  patient_id: number;
  doctor_id: number;
  diagnosis: string;
  treatment: string;
  prescription: string;
  notes: string;
}

export type UserRole = 'admin' | 'doctor' | 'nurse';

export interface MedicalRecordStats {
  totalRecords: number;
  newThisWeek: number;
  activePatients: number;
  pendingFollowups: number;
}

export interface FilterOptions {
  search: string;
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  doctor: string;
  patientStatus: string;
  sortBy: 'newest' | 'oldest' | 'patient_name';
}