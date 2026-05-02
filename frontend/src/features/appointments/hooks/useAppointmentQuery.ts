import { useQuery } from '@tanstack/react-query';
import { appointmentService } from '../services/appointmentService';

export const useAppointmentQuery = (params: {
  page: number;
  size: number;
  search?: string;
  status?: string;
  doctorId?: string;
  sort?: string;
}) => {
  return useQuery({
    queryKey: ['appointments', params],
    queryFn: () => appointmentService.getAppointments(params),
    placeholderData: (prev) => prev,
  });
};

export const useAppoinmentMetaQuery = () => {
  return useQuery({
    queryKey: ['appointmentsMeta'],
    queryFn: () => appointmentService.getAppointmentsMeta(),
  })
}