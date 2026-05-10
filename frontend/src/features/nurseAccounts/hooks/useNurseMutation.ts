import { useMutation, useQueryClient } from "@tanstack/react-query";
import { nurseService } from "../services/nurseService";

export const useNurseMutation = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["nurses"] });
    queryClient.invalidateQueries({ queryKey: ["nursesMeta"] });
  };

  const createNurse = useMutation({
    mutationFn: nurseService.createNurse,
    onSuccess: invalidate,
  });

  const updateNurse = useMutation({
    mutationFn: ({ id, values }: any) => nurseService.updateNurse(id, values),
    onSuccess: invalidate,
  });

  const deleteNurse = useMutation({
    mutationFn: ({ id }: any) => nurseService.deleteNurse(id),
    onSuccess: invalidate,
  });

  const toggleStatus = useMutation({
    mutationFn: nurseService.toggleStatus,
    onSuccess: invalidate,
  });

  const resetPassword = useMutation({
    mutationFn: ({ id, values }: any) => nurseService.resetPassword(id, values),
  });

  return {
    createNurse,
    updateNurse,
    deleteNurse,
    toggleStatus,
    resetPassword,
  };
};
