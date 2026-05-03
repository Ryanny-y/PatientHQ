export type IntegrityStatus = 'VALID' | 'PENDING' | 'TAMPERED';

export interface DataIntegrityDto {
  integrityId: string;
  patientId: string;
  patientName: string;
  status: IntegrityStatus;
  hashValue: string;
  lastChecked: string;
}

export interface IntegrityVerificationDto {
  patientId: string;
  patientName: string;
  status: IntegrityStatus;
  currentHash: string;
  storedHash: string;
  valid: boolean;
  verifiedAt: string;
}
