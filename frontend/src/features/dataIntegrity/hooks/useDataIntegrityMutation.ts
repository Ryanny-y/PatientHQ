import { useMutation } from '@tanstack/react-query';
import { dataIntegrityService } from '../services/dataIntegrityService';

export const useDataIntegrityMutation = () => {
  const verifyIntegrity = useMutation({
    mutationFn: (patientId: string) => dataIntegrityService.verifyIntegrity(patientId),
  });

  const recomputeIntegrity = useMutation({
    mutationFn: (patientId: string) => dataIntegrityService.recomputeIntegrity(patientId),
  });

  return { verifyIntegrity, recomputeIntegrity };
};
