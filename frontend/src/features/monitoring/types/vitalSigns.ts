import { z } from 'zod';

export interface VitalSigns {
  vitalId: string;
  patientId: string;
  patientName: string;
  recordedBy: string;
  recordedByName: string;
  temperature: number | null;
  heartRate: number | null;
  respiratoryRate: number | null;
  oxygenSaturation: number | null;
  bloodPressure: string | null;
  weight: number | null;
  height: number | null;
  notes: string | null;
  recordedAt: string;
}

export interface VitalSignsMetadata {
  totalRecords: number;
  recordedToday: number;
  criticalCount: number;
  patientsMonitored: number;
}

export type vitalSortOption = 'newest' | 'oldest' | 'patient-asc';
export type vitalDateFilter = 'all' | 'today' | 'week';

export const addVitalSignsSchema = z.object({
  patientId: z.string().min(1, 'Select a patient'),
  temperature: z.coerce.number(),
  heartRate: z.coerce.number(),
  respiratoryRate: z.coerce.number(),
  oxygenSaturation: z.coerce.number(),
  bloodPressure: z.string(),
  notes: z.string(),
});

export type addVitalSignsFormValues = z.input<typeof addVitalSignsSchema>;
