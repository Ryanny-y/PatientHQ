import { z } from 'zod';

export type patientStatus = 'ACTIVE' | 'ADMITTED' | 'DISCHARGED' | 'INACTIVE';
export type patientGender = 'Male' | 'Female' | 'Other';
export type bloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface Patient {
  patient_id: number;
  full_name: string;
  date_of_birth: string;
  gender: patientGender;
  contact_number: string;
  email: string;
  address: string;
  blood_type: bloodType;
  allergies: string;
  emergency_contact_name: string;
  emergency_contact_number: string;
  status: patientStatus;
  created_at: string;
  assigned_doctor: string;
}

export interface PatientHistoryEvent {
  id: string;
  event: string;
  description: string;
  date: string;
  type: 'registration' | 'assignment' | 'record' | 'vitals' | 'appointment' | 'discharge';
}

export type patientModalMode = 'view' | 'edit' | 'history' | 'archive' | null;

export const BLOOD_TYPES: bloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
export const GENDERS: patientGender[] = ['Male', 'Female', 'Other'];

export type patientStatusFilter = 'all' | 'ACTIVE' | 'ADMITTED' | 'DISCHARGED' | 'INACTIVE';
export type genderFilter = 'all' | patientGender;
export type bloodTypeFilter = 'all' | bloodType;
export type sortOption = 'newest' | 'oldest' | 'name-az';

// ── Edit Patient Schema ────────────────────────────────────────────────────
export const editPatientSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['Male', 'Female', 'Other']),
  contact_number: z
    .string()
    .min(7, 'Enter a valid contact number')
    .regex(/^[0-9+\-\s()]+$/, 'Invalid phone number format'),
  email: z.string().email('Enter a valid email address'),
  address: z.string().min(3, 'Address is required'),
  blood_type: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  allergies: z.string(),
  emergency_contact_name: z.string().min(2, 'Emergency contact name is required'),
  emergency_contact_number: z
    .string()
    .min(7, 'Enter a valid contact number')
    .regex(/^[0-9+\-\s()]+$/, 'Invalid phone number format'),
  status: z.enum(['ACTIVE', 'ADMITTED', 'DISCHARGED', 'INACTIVE']),
});

export type editPatientFormValues = z.infer<typeof editPatientSchema>;
