import { z } from 'zod';

export interface NurseAccount {
  nurse_id: number;
  user_id: number;
  username: string;
  full_name: string;
  assigned_ward: string;
  license_number: string;
  email: string;
  contact_number: string;
  is_active: boolean;
  created_at: string;
  // mock activity fields
  patients_monitored_today: number;
  recent_vital_logs: number;
  last_login: string;
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
    confirm_password: z.string().min(1, 'Please confirm your password'),
    full_name: z.string().min(2, 'Full name is required'),
    assigned_ward: z.string().min(2, 'Ward assignment is required'),
    license_number: z
      .string()
      .min(5, 'License number is required')
      .regex(/^[A-Z]{2,4}-\d{4}-\d{4}$/, 'Format: RN-YYYY-XXXX (e.g. RN-2025-0841)'),
    email: z.string().email('Enter a valid email address'),
    contact_number: z
      .string()
      .min(7, 'Enter a valid contact number')
      .regex(/^[0-9+\-\s()]+$/, 'Invalid phone number format'),
    is_active: z.boolean(),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

export type addNurseFormValues = z.infer<typeof addNurseSchema>;

// ── Edit Nurse ─────────────────────────────────────────────────────────────
export const editNurseSchema = z.object({
  username: z.string().min(4, 'Username must be at least 4 characters'),
  full_name: z.string().min(2, 'Full name is required'),
  assigned_ward: z.string().min(2, 'Ward assignment is required'),
  license_number: z
    .string()
    .min(5, 'License number is required')
    .regex(/^[A-Z]{2,4}-\d{4}-\d{4}$/, 'Format: RN-YYYY-XXXX (e.g. RN-2025-0841)'),
  email: z.string().email('Enter a valid email address'),
  contact_number: z
    .string()
    .min(7, 'Enter a valid contact number')
    .regex(/^[0-9+\-\s()]+$/, 'Invalid phone number format'),
  is_active: z.boolean(),
});

export type editNurseFormValues = z.infer<typeof editNurseSchema>;

// ── Shared ─────────────────────────────────────────────────────────────────
export type statusFilter = 'all' | 'active' | 'inactive';
export type sortOption = 'newest' | 'oldest' | 'name-az';
