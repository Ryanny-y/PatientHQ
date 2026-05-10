import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doctorService } from "../services/doctorService";

export const useDoctorMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["doctors"] });

  const createDoctor = useMutation({
    mutationFn: doctorService.createDoctor,
    onSuccess: invalidate,
  });

  const updateDoctor = useMutation({
    mutationFn: ({ id, values }: any) =>
      doctorService.updateDoctor(id, values),
    onSuccess: invalidate,
  });

  const deleteDoctor = useMutation({
    mutationFn: doctorService.deleteDoctor,
    onSuccess: invalidate,
  });

  const toggleStatus = useMutation({
    mutationFn: doctorService.toggleStatus,
    onSuccess: invalidate,
  });

  const resetPassword = useMutation({
    mutationFn: ({ id, values }: any) =>
      doctorService.resetPassword(id, values),
  });

  return {
    createDoctor,
    updateDoctor,
    deleteDoctor,
    toggleStatus,
    resetPassword,
  };
};
