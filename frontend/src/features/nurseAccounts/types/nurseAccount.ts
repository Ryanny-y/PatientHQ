import { z } from 'zod';

export interface NurseAccount {
  nurseId: string;
  userId: string;
  username: string;
  fullName: string;
  assignedWard: string;
  licenseNumber: string;
  email: string;
  contactNumber: string;
  isActive: boolean;
  createdAt: string;
  // mock activity fields
  patients_monitored_today: number;
  recent_vital_logs: number;
  // last_login: string;
}

export type nurseModalMode = 'add' | 'edit' | 'view' | 'reset-password' | 'delete' | null;

export const WARDS = [
  'Emergency Ward',
  'Intensive Care Unit (ICU)',
  'Neonatal ICU (NICU)',
  'Pediatric Ward',
  'Maternity Ward',
  'Surgical Ward',
  'Medical Ward',
  'Orthopedic Ward',
  'Oncology Ward',
  'Cardiac Care Unit (CCU)',
  'Neurology Ward',
  'Psychiatric Ward',
  'Burn Unit',
  'Isolation Ward',
  'Outpatient Department',
  'Operating Room',
  'Recovery Room',
  'Geriatric Ward',
] as const;

export type wardType = (typeof WARDS)[number] | string;

// ── Add Nurse ──────────────────────────────────────────────────────────────
export const addNurseSchema = z
  .object({
    username: z.string().min(4, 'Username must be at least 4 characters'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[0-9]/, 'Must contain a number')
      .regex(/[^A-Za-z0-9]/, 'Must contain a special character'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    fullName: z.string().min(2, 'Full name is required'),
    assignedWard: z.string().min(2, 'Ward assignment is required'),
    licenseNumber: z
      .string()
      .min(5, 'License number is required')
      .regex(/^[A-Z]{2,4}-\d{4}-\d{4}$/, 'Format: RN-YYYY-XXXX (e.g. RN-2025-0841)'),
    email: z.string().email('Enter a valid email address'),
    contactNumber: z
      .string()
      .min(7, 'Enter a valid contact number')
      .regex(/^[0-9+\-\s()]+$/, 'Invalid phone number format'),
    isActive: z.boolean(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type addNurseFormValues = z.infer<typeof addNurseSchema>;

// ── Edit Nurse ─────────────────────────────────────────────────────────────
export const editNurseSchema = z.object({
  username: z.string().min(4, 'Username must be at least 4 characters'),
  fullName: z.string().min(2, 'Full name is required'),
  assignedWard: z.string().min(2, 'Ward assignment is required'),
  licenseNumber: z
    .string()
    .min(5, 'License number is required')
    .regex(/^[A-Z]{2,4}-\d{4}-\d{4}$/, 'Format: RN-YYYY-XXXX (e.g. RN-2025-0841)'),
  email: z.string().email('Enter a valid email address'),
  contactNumber: z
    .string()
    .min(7, 'Enter a valid contact number')
    .regex(/^[0-9+\-\s()]+$/, 'Invalid phone number format'),
  isActive: z.boolean(),
});

export type editNurseFormValues = z.infer<typeof editNurseSchema>;

// ── Shared ─────────────────────────────────────────────────────────────────
export type statusFilter = 'all' | 'active' | 'inactive';
export type sortOption = 'newest' | 'oldest' | 'name-az';
