import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportService } from '../services/reportService';

export const useReportMutation = () => {
  const queryClient = useQueryClient();

  const invalidate = (): void => {
    queryClient.invalidateQueries({ queryKey: ['reports'] });
  };

  const generateReport = useMutation({
    mutationFn: reportService.generateReport,
    onSuccess: invalidate,
  });

  return { generateReport };
};
