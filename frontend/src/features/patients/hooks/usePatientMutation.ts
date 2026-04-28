import { patientService } from "../services/patientService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const usePatientMutation = () => {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["patients"] });

  const createPatient = useMutation({
    mutationFn: patientService.createPatient,
    onSuccess: invalidate,
  });

  const updatePatient = useMutation({
    mutationFn: ({ id, values }: any) =>
      patientService.updatePatient(id, values),
    onSuccess: invalidate,
  });

  const deletePatient = useMutation({
    mutationFn: patientService.deletePatient,
    onSuccess: invalidate,
  });

  return {
    createPatient,
    updatePatient,
    deletePatient
  };
};
