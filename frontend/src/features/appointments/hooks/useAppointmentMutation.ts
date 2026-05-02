import { useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentService } from '../services/appointmentService';

export const useAppointmentMutation = () => {
  const queryClient = useQueryClient();

  const invalidate = (): void => {
    queryClient.invalidateQueries({ queryKey: ['appointments'] });
  };

  const createAppointment = useMutation({
    mutationFn: appointmentService.createAppointment,
    onSuccess: invalidate,
  });

  const updateAppointment = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: Parameters<typeof appointmentService.updateAppointment>[1];
    }) => appointmentService.updateAppointment(id, values),
    onSuccess: invalidate,
  });

  const deleteAppointment = useMutation({
    mutationFn: appointmentService.deleteAppointment,
    onSuccess: invalidate,
  });

  return { createAppointment, updateAppointment, deleteAppointment };
};
