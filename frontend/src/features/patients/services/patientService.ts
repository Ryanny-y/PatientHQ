import type { ApiResponse } from '@/shared/types/api';
import type { Patient, PatientHistoryEvent } from '@/features/patients/types/Patient';

const mockPatients: Patient[] = [
  {
    patient_id: 1001,
    full_name: 'Juan Dela Cruz',
    date_of_birth: '1995-06-10',
    gender: 'Male',
    contact_number: '09171234567',
    email: 'juan.delacruz@email.com',
    address: 'Quezon City, Philippines',
    blood_type: 'O+',
    allergies: 'Penicillin',
    emergency_contact_name: 'Maria Dela Cruz',
    emergency_contact_number: '09181234567',
    status: "ACTIVE",
    created_at: '2026-04-01',
    assigned_doctor: 'Dr. Antonio Garcia',
  },
  {
    patient_id: 1002,
    full_name: 'Maria Santos',
    date_of_birth: '1988-03-15',
    gender: 'Female',
    contact_number: '09187654321',
    email: 'maria.santos@email.com',
    address: 'Makati City, Philippines',
    blood_type: 'A+',
    allergies: 'None',
    emergency_contact_name: 'Pedro Santos',
    emergency_contact_number: '09197654321',
    status: "ADMITTED",
    created_at: '2026-03-15',
    assigned_doctor: 'Dr. Elena Rodriguez',
  },
  {
    patient_id: 1003,
    full_name: 'Carlos Reyes',
    date_of_birth: '1975-11-22',
    gender: 'Male',
    contact_number: '09161112222',
    email: 'carlos.reyes@email.com',
    address: 'Pasig City, Philippines',
    blood_type: 'B+',
    allergies: 'Shellfish, Peanuts',
    emergency_contact_name: 'Ana Reyes',
    emergency_contact_number: '09171112222',
    status: "ACTIVE",
    created_at: '2026-02-10',
    assigned_doctor: 'Dr. Antonio Garcia',
  },
  {
    patient_id: 1004,
    full_name: 'Ana Gonzales',
    date_of_birth: '2000-08-05',
    gender: 'Female',
    contact_number: '09153334444',
    email: 'ana.gonzales@email.com',
    address: 'Taguig City, Philippines',
    blood_type: 'AB+',
    allergies: 'Latex',
    emergency_contact_name: 'Roberto Gonzales',
    emergency_contact_number: '09163334444',
    status: "DISCHARGED",
    created_at: '2026-04-20',
    assigned_doctor: 'Dr. Michael Tan',
  },
  {
    patient_id: 1005,
    full_name: 'Roberto Mendoza',
    date_of_birth: '1992-01-30',
    gender: 'Male',
    contact_number: '09145556666',
    email: 'roberto.mendoza@email.com',
    address: 'Manila City, Philippines',
    blood_type: 'O-',
    allergies: 'None',
    emergency_contact_name: 'Lisa Mendoza',
    emergency_contact_number: '09155556666',
    status: "ACTIVE",
    created_at: '2026-04-25',
    assigned_doctor: 'Dr. Elena Rodriguez',
  },
  {
    patient_id: 1006,
    full_name: 'Sofia Ramos',
    date_of_birth: '1985-07-18',
    gender: 'Female',
    contact_number: '09177778888',
    email: 'sofia.ramos@email.com',
    address: 'Caloocan City, Philippines',
    blood_type: 'A-',
    allergies: 'Aspirin',
    emergency_contact_name: 'Diego Ramos',
    emergency_contact_number: '09187778888',
    status: "INACTIVE",
    created_at: '2025-12-05',
    assigned_doctor: 'Dr. Michael Tan',
  },
];

export const getPatients = async (): Promise<ApiResponse<Patient[]>> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { data: mockPatients, message: 'Patients retrieved successfully', success: true };
};

export const getPatientById = async (id: number): Promise<ApiResponse<Patient>> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const patient = mockPatients.find((p) => p.patient_id === id);
  if (!patient) {
    return { data: {} as Patient, message: 'Patient not found', success: false };
  }
  return { data: patient, message: 'Patient retrieved successfully', success: true };
};

export const updatePatient = async (id: number, data: Partial<Patient>): Promise<ApiResponse<Patient>> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const patient = mockPatients.find((p) => p.patient_id === id);
  if (!patient) {
    return { data: {} as Patient, message: 'Patient not found', success: false };
  }
  Object.assign(patient, data);
  return { data: patient, message: 'Patient updated successfully', success: true };
};

export const archivePatient = async (id: number): Promise<ApiResponse<null>> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const patient = mockPatients.find((p) => p.patient_id === id);
  if (!patient) {
    return { data: null, message: 'Patient not found', success: false };
  }
  patient.status = "INACTIVE";
  return { data: null, message: 'Patient archived successfully', success: true };
};

export const getPatientHistory = async (_id: number): Promise<ApiResponse<PatientHistoryEvent[]>> => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const mockHistory: PatientHistoryEvent[] = [
    { id: 1, event: 'Patient Registered', description: 'Patient record created in the system', timestamp: '2026-04-01 09:30:00', actor: 'Admin User', date: '2026-04-01', type: 'registration' },
    { id: 2, event: 'Doctor Assigned', description: 'Assigned to Dr. Antonio Garcia', timestamp: '2026-04-01 10:15:00', actor: 'Admin User', date: '2026-04-01', type: 'assignment' },
    { id: 3, event: 'Medical Record Added', description: 'Initial consultation record created', timestamp: '2026-04-02 14:20:00', actor: 'Dr. Antonio Garcia', date: '2026-04-02', type: 'record' },
    { id: 4, event: 'Vitals Recorded', description: 'Blood pressure, temperature, and heart rate logged', timestamp: '2026-04-03 08:45:00', actor: 'Nurse Clara', date: '2026-04-03', type: 'vitals' },
    { id: 5, event: 'Appointment Scheduled', description: 'Follow-up appointment set for 2026-04-10', timestamp: '2026-04-03 09:00:00', actor: 'Reception Staff', date: '2026-04-03', type: 'appointment' },
  ];
  return { data: mockHistory, message: 'Patient history retrieved successfully', success: true };
};
