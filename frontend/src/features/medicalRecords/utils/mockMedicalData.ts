import type { MedicalRecord, MedicalRecordStats } from '../types/medicalRecord';

export const mockMedicalRecords: MedicalRecord[] = [
  {
    record_id: 501,
    patient_id: 1001,
    patient_name: "Juan Dela Cruz",
    doctor_id: 1,
    doctor_name: "Dr. Antonio Garcia",
    diagnosis: "Hypertension Stage 1",
    treatment: "Lifestyle modification and monitoring",
    prescription: "Losartan 50mg once daily",
    notes: "Patient advised to reduce salt intake and exercise regularly. Return after 2 weeks for follow-up.",
    created_at: "2026-04-26",
    last_updated: "2026-04-26",
    patient_status: "Active",
    appointment_summary: "Initial consultation for blood pressure management"
  },
  {
    record_id: 502,
    patient_id: 1002,
    patient_name: "Maria Santos",
    doctor_id: 2,
    doctor_name: "Dr. Elena Rodriguez",
    diagnosis: "Type 2 Diabetes Mellitus",
    treatment: "Dietary management and oral hypoglycemics",
    prescription: "Metformin 500mg twice daily",
    notes: "Patient educated on carbohydrate counting and blood glucose monitoring. HbA1c to be checked in 3 months.",
    created_at: "2026-04-25",
    last_updated: "2026-04-25",
    patient_status: "Active",
    appointment_summary: "Diabetes management follow-up"
  },
  {
    record_id: 503,
    patient_id: 1003,
    patient_name: "Pedro Reyes",
    doctor_id: 1,
    doctor_name: "Dr. Antonio Garcia",
    diagnosis: "Acute Bronchitis",
    treatment: "Supportive care and symptom management",
    prescription: "Amoxicillin 500mg three times daily for 7 days",
    notes: "Patient with productive cough and fever. Advised rest and hydration. Follow-up if symptoms worsen.",
    created_at: "2026-04-24",
    last_updated: "2026-04-24",
    patient_status: "Active",
    appointment_summary: "Respiratory infection evaluation"
  },
  {
    record_id: 504,
    patient_id: 1004,
    patient_name: "Ana Lopez",
    doctor_id: 3,
    doctor_name: "Dr. Miguel Santos",
    diagnosis: "Migraine Headache",
    treatment: "Acute and prophylactic therapy",
    prescription: "Sumatriptan 50mg as needed, Propranolol 40mg daily",
    notes: "Patient with recurrent migraines. Trigger identification discussed. Neurology referral considered if refractory.",
    created_at: "2026-04-23",
    last_updated: "2026-04-23",
    patient_status: "Active",
    appointment_summary: "Headache management consultation"
  },
  {
    record_id: 505,
    patient_id: 1005,
    patient_name: "Carlos Mendoza",
    doctor_id: 2,
    doctor_name: "Dr. Elena Rodriguez",
    diagnosis: "Osteoarthritis Knee",
    treatment: "Physical therapy and pain management",
    prescription: "Ibuprofen 400mg three times daily as needed",
    notes: "Patient with bilateral knee pain. Weight management and exercise program recommended. Orthopedic consultation scheduled.",
    created_at: "2026-04-22",
    last_updated: "2026-04-22",
    patient_status: "Active",
    appointment_summary: "Joint pain evaluation"
  },
  {
    record_id: 506,
    patient_id: 1006,
    patient_name: "Rosa Fernandez",
    doctor_id: 1,
    doctor_name: "Dr. Antonio Garcia",
    diagnosis: "Upper Respiratory Infection",
    treatment: "Symptom management",
    prescription: "Acetaminophen 500mg every 6 hours as needed",
    notes: "Viral URI symptoms. Supportive care only. Return if symptoms persist beyond 7 days.",
    created_at: "2026-04-21",
    last_updated: "2026-04-21",
    patient_status: "Active",
    appointment_summary: "Cold symptoms evaluation"
  },
  {
    record_id: 507,
    patient_id: 1007,
    patient_name: "Luis Torres",
    doctor_id: 3,
    doctor_name: "Dr. Miguel Santos",
    diagnosis: "Depression Moderate",
    treatment: "Psychotherapy and medication",
    prescription: "Sertraline 50mg daily",
    notes: "Patient with low mood and anhedonia. Counseling recommended. Follow-up in 2 weeks to assess medication response.",
    created_at: "2026-04-20",
    last_updated: "2026-04-20",
    patient_status: "Active",
    appointment_summary: "Mental health consultation"
  },
  {
    record_id: 508,
    patient_id: 1008,
    patient_name: "Carmen Diaz",
    doctor_id: 2,
    doctor_name: "Dr. Elena Rodriguez",
    diagnosis: "Hyperlipidemia",
    treatment: "Lifestyle modification and statin therapy",
    prescription: "Atorvastatin 20mg daily",
    notes: "Elevated cholesterol levels. Dietary counseling provided. Lipid panel in 3 months.",
    created_at: "2026-04-19",
    last_updated: "2026-04-19",
    patient_status: "Active",
    appointment_summary: "Cardiovascular risk assessment"
  }
];

export const mockPatients = [
  { id: 1001, name: "Juan Dela Cruz", age: 45, gender: "Male", status: "Active" },
  { id: 1002, name: "Maria Santos", age: 52, gender: "Female", status: "Active" },
  { id: 1003, name: "Pedro Reyes", age: 38, gender: "Male", status: "Active" },
  { id: 1004, name: "Ana Lopez", age: 29, gender: "Female", status: "Active" },
  { id: 1005, name: "Carlos Mendoza", age: 61, gender: "Male", status: "Active" },
  { id: 1006, name: "Rosa Fernandez", age: 34, gender: "Female", status: "Active" },
  { id: 1007, name: "Luis Torres", age: 41, gender: "Male", status: "Active" },
  { id: 1008, name: "Carmen Diaz", age: 55, gender: "Female", status: "Active" },
];

export const mockDoctors = [
  { id: 1, name: "Dr. Antonio Garcia", specialty: "Internal Medicine" },
  { id: 2, name: "Dr. Elena Rodriguez", specialty: "Endocrinology" },
  { id: 3, name: "Dr. Miguel Santos", specialty: "Neurology" },
];

export const mockMedicalRecordStats: MedicalRecordStats = {
  totalRecords: 1247,
  newThisWeek: 23,
  activePatients: 892,
  pendingFollowups: 45,
};