export type PatientStatus = 'ACTIVE' | 'ADMITTED' | 'CRITICAL' | 'INACTIVE';
export type AssignmentStatus = 'Active' | 'Inactive';
export type PriorityLevel = 'Normal' | 'Urgent' | 'Critical';

export interface DoctorProfile {
  doctor_id: number;
  doctor_name: string;
  specialization: string;
  is_active: boolean;
  active_patients: number;
  current_load: number;
}

export interface PatientSummary {
  patient_id: number;
  full_name: string;
  status: PatientStatus;
  room: string;
  condition: string;
}

export interface AssignmentRecord {
  assignment_id: number;
  patient_id: number;
  patient_name: string;
  patient_status: PatientStatus;
  doctor_id: number;
  doctor_name: string;
  specialization: string;
  assigned_date: string;
  is_active: boolean;
  patient_room: string;
  doctor_active_patients: number;
  doctor_is_active: boolean;
  priority: PriorityLevel;
}
