export interface Patient {
  patient_id: number;
  full_name: string;
  date_of_birth: string;
  gender: string;
  contact_number: string;
  email: string;
  address: string;
  blood_type: string;
  allergies: string;
  emergency_contact_name: string;
  emergency_contact_number: string;
  status: PatientStatus;
  created_at: string;
  assigned_doctor?: string;
}

export type PatientStatus = 'ACTIVE' | 'ADMITTED' | 'DISCHARGED' | 'INACTIVE';

export interface PatientHistoryEvent {
  id: number;
  event: string;
  description: string;
  timestamp: string;
  actor?: string;
}
