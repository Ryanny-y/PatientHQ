import { z } from 'zod';

// ── Backend response shape (AppointmentDto) ────────────────────────────────
export interface Appointment {
  appointmentId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  appointmentDate: string; // ISO LocalDateTime: "2026-04-28T10:30:00"
  reason: string | null;
  status: AppointmentStatus;
  notes: string | null;
  createdAt: string;
}

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

// ── Role ─────────────────────────────────────────────────────────────────────
export type UserRole = 'admin' | 'doctor' | 'nurse';

// ── Stats (derived client-side from page data) ─────────────────────────────
export interface AppointmentStats {
  totalAppointments: number;
  todaysAppointments: number;
  pendingAppointments: number;
  completedThisWeek: number;
}

// ── Filter / Sort ──────────────────────────────────────────────────────────
export type AppointmentSortOption = 'nearest' | 'latest' | 'patient_name';
export type AppointmentModalMode = 'view' | 'add' | 'edit' | 'cancel' | null;

// Server-side filters (sent to API)
export interface ServerFilters {
  search: string;
  status: string;
  sortBy: AppointmentSortOption;
}

// Subset used by useAppointments hook (server-side only, no dateRange/specialization)
export interface AppointmentFilters {
  search: string;
  status: string;
  sortBy: AppointmentSortOption;
}

// Full UI filter state (includes client-side filters)
export interface FilterOptions {
  search: string;
  dateRange: { from: Date | null; to: Date | null };
  status: string;
  doctor: string;
  specialization: string;
  sortBy: AppointmentSortOption;
}

// ── Create form (POST /appointments) ──────────────────────────────────────
export const createAppointmentSchema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  doctorId: z.string().min(1, 'Doctor is required'),
  appointmentDate: z
    .string()
    .min(1, 'Date is required')
    .refine((d) => new Date(d) > new Date(), 'Appointment must be in the future'),
  reason: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateAppointmentFormValues = z.infer<typeof createAppointmentSchema>;

// ── Update form (PATCH /appointments/:id) ─────────────────────────────────
export const updateAppointmentSchema = z.object({
  appointmentDate: z
    .string()
    .min(1, 'Date is required')
    .refine((d) => new Date(d) > new Date(), 'Appointment must be in the future')
    .optional(),
  reason: z.string().optional(),
  status: z
    .enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'])
    .optional(),
  notes: z.string().optional(),
});

export type UpdateAppointmentFormValues = z.infer<typeof updateAppointmentSchema>;
