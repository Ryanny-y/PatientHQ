import { fetchWithAuth } from '@/shared/hooks/fetchWithAuth';
import type { ApiResponse } from '@/shared/types/api';
import type { DataIntegrityDto, IntegrityVerificationDto } from '../types/dataIntegrity';

export const dataIntegrityService = {
  // POST — safe even if no record exists yet
  verifyIntegrity: (patientId: string) =>
    fetchWithAuth<ApiResponse<IntegrityVerificationDto>>(
      `patients/${patientId}/integrity/verify`,
      { method: 'POST' },
    ),

  // POST — recomputes and stores a new hash
  recomputeIntegrity: (patientId: string) =>
    fetchWithAuth<ApiResponse<DataIntegrityDto>>(
      `patients/${patientId}/integrity/recompute`,
      { method: 'POST' },
    ),
};
