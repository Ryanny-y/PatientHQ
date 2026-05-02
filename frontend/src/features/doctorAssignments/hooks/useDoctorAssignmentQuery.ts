import { useQuery } from '@tanstack/react-query';
import { doctorAssignmentService } from '../service/doctorAssignmentService';

export const useDoctorAssignmentQuery = (params: {
  page: number;
  size: number;
  search?: string;
  isActive?: boolean;
  patientStatus?: string;
  sort?: string;
}) => {
  return useQuery({
    queryKey: ['doctorAssignments', params],
    queryFn: () => doctorAssignmentService.getAssignments(params),
    placeholderData: (prev) => prev,
  });
};
