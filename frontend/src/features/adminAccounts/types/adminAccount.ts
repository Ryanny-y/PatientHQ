import { z } from 'zod';

export interface AdminAccount {
  admin_id: number;
  user_id: number;
  username: string;
  full_name: string;
  email: string;
  contact_number: string;
  is_active: boolean;
  created_at: string;
  // mock security fields
  last_login: string;
  password_last_reset: string;
}

export type modalMode = 'add' | 'edit' | 'view' | 'reset-password' | 'delete' | null;

// ── Add Admin ──────────────────────────────────────────────────────────────
export const addAdminSchema = z
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
    email: z.email('Enter a valid email address'),
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

export type addAdminFormValues = z.infer<typeof addAdminSchema>;

// ── Edit Admin ─────────────────────────────────────────────────────────────
export const editAdminSchema = z.object({
  username: z.string().min(4, 'Username must be at least 4 characters'),
  full_name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Enter a valid email address'),
  contact_number: z
    .string()
    .min(7, 'Enter a valid contact number')
    .regex(/^[0-9+\-\s()]+$/, 'Invalid phone number format'),
  is_active: z.boolean(),
});

export type editAdminFormValues = z.infer<typeof editAdminSchema>;

// ── Reset Password ─────────────────────────────────────────────────────────
export const resetPasswordSchema = z
  .object({
    new_password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[0-9]/, 'Must contain a number')
      .regex(/[^A-Za-z0-9]/, 'Must contain a special character'),
    confirm_password: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.new_password === d.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

export type resetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

// ── Filter / Sort ──────────────────────────────────────────────────────────
export type statusFilter = 'all' | 'active' | 'inactive';
export type sortOption = 'newest' | 'oldest' | 'name-az';
