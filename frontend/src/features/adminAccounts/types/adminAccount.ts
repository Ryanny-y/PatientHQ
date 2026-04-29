import { z } from 'zod';

export interface AdminAccount {
  adminId: string;
  userId: string;
  username: string;
  fullName: string;
  email: string | null;
  contactNumber: string | null;
  roleName: string;
  isActive: boolean;
  createdAt: string;
}

export interface AdminMetaData {
  totalAdmins: number;
  activeAccounts: number;
  inactiveAccounts: number;
  recentlyAdded: number;
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
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    fullName: z.string().min(2, 'Full name is required'),
    email: z.email('Enter a valid email address'),
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

export type addAdminFormValues = z.infer<typeof addAdminSchema>;

// ── Edit Admin ─────────────────────────────────────────────────────────────
export const editAdminSchema = z.object({
  username: z.string().min(4, 'Username must be at least 4 characters'),
  fullName: z.string().min(2, 'Full name is required'),
  email: z.email('Enter a valid email address'),
  contactNumber: z
    .string()
    .min(7, 'Enter a valid contact number')
    .regex(/^[0-9+\-\s()]+$/, 'Invalid phone number format'),
  isActive: z.boolean(),
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
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.new_password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type resetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

// ── Filter / Sort ──────────────────────────────────────────────────────────
export type statusFilter = 'all' | 'active' | 'inactive';
export type sortOption = 'newest' | 'oldest' | 'name-az';
