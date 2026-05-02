import { useQuery } from '@tanstack/react-query';
import { vitalSignsService } from '../services/vitalSignsService';

export const useVitalSignsQuery = (params: {
  page: number;
  size: number;
  search?: string;
  patientId?: string;
  dateFilter?: string;
  sort?: string;
}) => {
  return useQuery({
    queryKey: ['vitalSigns', params],
    queryFn: () => vitalSignsService.getVitalSigns(params),
    placeholderData: (prev) => prev,
  });
};

export const useVitalSignsMetaQuery = () => {
  return useQuery({
    queryKey: ['vitalSignsMeta'],
    queryFn: () => vitalSignsService.getVitalSignsMeta(),
  });
};
