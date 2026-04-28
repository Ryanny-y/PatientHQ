import { z } from 'zod';

export interface DoctorAccount {
  doctorId: string;
  userId: string;
  username: string;
  fullName: string;
  specialization: string;
  licenseNumber: string;
  email: string | null;
  contactNumber: string | null;
  roleName: string;
  isActive: boolean;
  createdAt: string;
}

export type doctorModalMode = 'add' | 'edit' | 'view' | 'reset-password' | 'delete' | null;

export const SPECIALIZATIONS = [
  'Cardiology',
  'Dermatology',
  'Emergency Medicine',
  'Endocrinology',
  'Gastroenterology',
  'General Surgery',
  'Hematology',
  'Internal Medicine',
  'Nephrology',
  'Neurology',
  'Obstetrics & Gynecology',
  'Oncology',
  'Ophthalmology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Pulmonology',
  'Radiology',
  'Rheumatology',
  'Urology',
] as const;

export type specializationType = (typeof SPECIALIZATIONS)[number] | string;

// ── Add Doctor ─────────────────────────────────────────────────────────────
export const addDoctorSchema = z
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
    specialization: z.string().min(2, 'Specialization is required'),
    licenseNumber: z
      .string()
      .min(5, 'License number is required')
      .regex(/^[A-Z]{2,4}-\d{4}-\d{4}$/, 'Format: LIC-YYYY-XXXX (e.g. LIC-2025-0145)'),
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

export type addDoctorFormValues = z.infer<typeof addDoctorSchema>;

// ── Edit Doctor ────────────────────────────────────────────────────────────
export const editDoctorSchema = z.object({
  username: z.string().min(4, 'Username must be at least 4 characters'),
  fullName: z.string().min(2, 'Full name is required'),
  specialization: z.string().min(2, 'Specialization is required'),
  licenseNumber: z
    .string()
    .min(5, 'License number is required')
    .regex(/^[A-Z]{2,4}-\d{4}-\d{4}$/, 'Format: LIC-YYYY-XXXX (e.g. LIC-2025-0145)'),
  email: z.email('Enter a valid email address'),
  contactNumber: z
    .string()
    .min(7, 'Enter a valid contact number')
    .regex(/^[0-9+\-\s()]+$/, 'Invalid phone number format'),
  isActive: z.boolean(),
});

export type editDoctorFormValues = z.infer<typeof editDoctorSchema>;

// ── Shared ─────────────────────────────────────────────────────────────────
export type statusFilter = 'all' | 'active' | 'inactive';
export type sortOption = 'newest' | 'oldest' | 'name-az';
