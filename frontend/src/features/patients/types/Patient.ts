export type PatientStatus = "ACTIVE" | "ADMITTED" | "DISCHARGED" | "INACTIVE";

export interface PatientHistoryEvent {
  id: number;
  event: string;
  description: string;
  timestamp: string;
  actor?: string;
}
import { z } from "zod";

export type patientStatus = "ACTIVE" | "ADMITTED" | "DISCHARGED" | "INACTIVE";
export type patientGender = "Male" | "Female" | "Other";
export type bloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export interface Patient {
  patientId: number;
  fullName: string;
  dateOfBirth: string;
  gender: patientGender;
  contactNumber: string;
  email: string;
  address: string;
  bloodType: bloodType;
  allergies: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  status: patientStatus;
  createdAt: string;
  assignedDoctor: string;
}

export interface PatientHistoryEvent {
  id: number;
  event: string;
  description: string;
  date: string;
  type:
    | "registration"
    | "assignment"
    | "record"
    | "vitals"
    | "appointment"
    | "discharge";
}

export type patientModalMode = "view" | "edit" | "history" | "archive" | null;

export const bloodtypeS: bloodType[] = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];
export const GENDERS: patientGender[] = ["Male", "Female", "Other"];

export type patientStatusFilter =
  | "all"
  | "ACTIVE"
  | "ADMITTED"
  | "DISCHARGED"
  | "INACTIVE";
export type genderFilter = "all" | patientGender;
export type bloodTypeFilter = "all" | bloodType;
export type sortOption = "newest" | "oldest" | "name-az";

// ── Add Patient Schema ────────────────────────────────────────────────────
export const addPatientSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  dateOfBirth: z.string().refine(
    (value) => {
      const date = new Date(value);
      const now = new Date();
      const earliest = new Date(
        now.getFullYear() - 120,
        now.getMonth(),
        now.getDate(),
      );
      return value !== "" && date <= now && date >= earliest;
    },
    { message: "Enter a valid date of birth" },
  ),
  gender: z.enum(["MALE", "FEMALE"] as const),
  contactNumber: z
    .string()
    .transform((value) => value.replace(/\D/g, ""))
    .refine((value) => value.length === 11, {
      message: "Enter an 11-digit contact number",
    }),
  email: z.email("Enter a valid email address").or(z.literal("")),
  address: z.string().min(5, "Address is required"),
  bloodType: z
    .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", ""] as const)
    .optional(),
  allergies: z.string().optional(),
  existingConditions: z.string().optional(),
  notes: z.string().optional(),
  emergencyContactName: z.string().min(3, "Emergency contact name is required"),
  relationship: z.string().optional(),
  emergencyContactNumber: z
    .string()
    .transform((value) => value.replace(/\D/g, ""))
    .refine((value) => value.length === 11, {
      message: "Enter an 11-digit emergency number",
    }),
  status: z.enum(["ACTIVE", "ADMITTED", "INACTIVE"]),
});

export type addPatientFormValues = z.infer<typeof addPatientSchema>;

// ── Edit Patient Schema ────────────────────────────────────────────────────
export const editPatientSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["Male", "Female", "Other"]),
  contactNumber: z
    .string()
    .min(7, "Enter a valid contact number")
    .regex(/^[0-9+\-\s()]+$/, "Invalid phone number format"),
  email: z.email("Enter a valid email address"),
  address: z.string().min(3, "Address is required"),
  bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  allergies: z.string(),
  emergencyContactName: z.string().min(2, "Emergency contact name is required"),
  emergencyContactNumber: z
    .string()
    .min(7, "Enter a valid contact number")
    .regex(/^[0-9+\-\s()]+$/, "Invalid phone number format"),
  status: z.enum(["ACTIVE", "ADMITTED", "DISCHARGED", "INACTIVE"]),
});

export type editPatientFormValues = z.infer<typeof editPatientSchema>;

// ── Shared ─────────────────────────────────────────────────────────────────
export type statusFilter = 'all' | 'active' | 'inactive' | 'admitted' | 'discharged';
