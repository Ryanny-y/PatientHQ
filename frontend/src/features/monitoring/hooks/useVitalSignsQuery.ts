import { useQuery } from '@tanstack/react-query';
import { vitalSignsService } from '../services/vitalSignsService';

export const useVitalSignsQuery = () => {
  return useQuery({
    queryKey: ['vitalSigns'],
    queryFn: () => vitalSignsService.getVitalSigns(),
    placeholderData: (prev) => prev,
  });
};

export const useVitalSignsMetaQuery = () => {
  return useQuery({
    queryKey: ['vitalSignsMeta'],
    queryFn: () => vitalSignsService.getVitalSignsMeta(),
  });
};
