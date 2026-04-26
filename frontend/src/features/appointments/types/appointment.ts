export interface Appointment {
  appointment_id: number;
  patient_id: number;
  patient_name: string;
  patient_contact?: string;
  patient_status?: 'Active' | 'Inactive' | 'Discharged';
  doctor_id: number;
  doctor_name: string;
  specialization: string;
  appointment_date: string; // ISO format with time: "2026-04-28 10:30"
  reason: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  notes?: string;
  created_at: string;
  duration_minutes?: number;
}

export interface AppointmentFormData {
  patient_id: number;
  doctor_id: number;
  appointment_date: string;
  reason: string;
  notes?: string;
  duration_minutes?: number;
}

export type UserRole = 'admin' | 'doctor' | 'nurse';

export interface AppointmentStats {
  totalAppointments: number;
  todayAppointments: number;
  pendingConfirmations: number;
  completedThisWeek: number;
}

export interface FilterOptions {
  search: string;
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  status: string;
  doctor: string;
  specialization: string;
  sortBy: 'nearest' | 'latest' | 'patient_name';
}