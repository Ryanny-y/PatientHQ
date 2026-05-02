export type PatientStatus = 'ACTIVE' | 'ADMITTED' | 'CRITICAL' | 'INACTIVE';
export type assignmentSortOption = 'newest' | 'oldest' | 'patient-asc' | 'doctor-asc';
export type assignmentStatusFilter = 'all' | 'active' | 'inactive';

export interface DoctorAssignment {
  assignmentId: string;
  patientId: string;
  patientName: string;
  patientStatus: PatientStatus;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  assignedDate: string;
  isActive: boolean;
}

export interface AssignDoctorRequest {
  patientId: string;
  doctorId: string;
}

export interface ReassignDoctorRequest {
  assignmentId: string;
  newDoctorId: string;
}
