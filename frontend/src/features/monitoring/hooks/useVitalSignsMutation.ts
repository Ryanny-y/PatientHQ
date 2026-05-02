import { useMutation, useQueryClient } from '@tanstack/react-query';
import { vitalSignsService } from '../services/vitalSignsService';

export const useVitalSignsMutation = () => {
  const queryClient = useQueryClient();

  const invalidate = (): void => {
    queryClient.invalidateQueries({ queryKey: ['vitalSigns'] });
    queryClient.invalidateQueries({ queryKey: ['vitalSignsMeta'] });
  };

  const createVitalSigns = useMutation({
    mutationFn: vitalSignsService.createVitalSigns,
    onSuccess: invalidate,
  });

  const updateVitalSigns = useMutation({
    mutationFn: ({ id, values }: { id: string; values: Parameters<typeof vitalSignsService.updateVitalSigns>[1] }) =>
      vitalSignsService.updateVitalSigns(id, values),
    onSuccess: invalidate,
  });

  const deleteVitalSigns = useMutation({
    mutationFn: vitalSignsService.deleteVitalSigns,
    onSuccess: invalidate,
  });

  return { createVitalSigns, updateVitalSigns, deleteVitalSigns };
};
