import { medicalRecordService } from "../services/medicalRecordService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useMedicalRecordMutation = () => {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["medicalRecords"] });

  const createMedicalRecord = useMutation({
    mutationFn: medicalRecordService.createMedicalRecord,
    onSuccess: invalidate,
  });

  const updateMedicalRecord = useMutation({
    mutationFn: ({ id, values }: { id: string; values: Parameters<typeof medicalRecordService.updateMedicalRecord>[1] }) =>
      medicalRecordService.updateMedicalRecord(id, values),
    onSuccess: invalidate,
  });

  const deleteMedicalRecord = useMutation({
    mutationFn: medicalRecordService.deleteMedicalRecord,
    onSuccess: invalidate,
  });

  return {
    createMedicalRecord,
    updateMedicalRecord,
    deleteMedicalRecord
  };
};