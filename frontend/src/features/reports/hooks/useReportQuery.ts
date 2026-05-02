import { useQuery } from '@tanstack/react-query';
import { reportService } from '../services/reportService';

export const useReportQuery = (params: {
  page: number;
  size: number;
  sort?: string;
}) => {
  return useQuery({
    queryKey: ['reports', params],
    queryFn: () => reportService.getReports(params),
    placeholderData: (prev) => prev,
  });
};

export const useReportByIdQuery = (id?: string) => {
  return useQuery({
    queryKey: ['reports', id],
    queryFn: () => reportService.getReportById(id as string),
    enabled: Boolean(id),
  });
};
