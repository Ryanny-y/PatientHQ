export interface MedicalRecord {
  recordId: string;
  patientId: string;
  doctorId: string;
  diagnosis: string;
  treatment: string;
  prescription: string;
  notes: string;
  createdAt: string;
  lastUpdated?: string;
  patientName?: string;
  doctorName?: string;
  patientStatus?: 'Active' | 'Inactive' | 'Discharged';
  appointmentSummary?: string;
}

export interface MedicalRecordFormData {
  patientId: string;
  doctorId: string;
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