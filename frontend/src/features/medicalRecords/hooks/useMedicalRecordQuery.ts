import { useQuery } from "@tanstack/react-query";
import { medicalRecordService } from "../services/medicalRecordService";

export const useMedicalRecordQuery = (params: {
  page: number;
  size: number;
  patientId?: string;
  doctorId?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["medicalRecords", params],
    queryFn: () => medicalRecordService.getMedicalRecords(params),
    placeholderData: (prev) => prev,
  });
};

export const useMedicalRecordByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ["medicalRecord", id],
    queryFn: () => medicalRecordService.getMedicalRecordById(id),
    enabled: !!id,
  });
};

export const useMedicalRecordMetaQuery = () => {
  return useQuery({
    queryKey: ["medicalRecordsMeta"],
    queryFn: () => medicalRecordService.getMedicalRecordsMeta(),
  });
};

export const useMedicalRecordsByPatientQuery = (patientId: string) => {
  return useQuery({
    queryKey: ["medicalRecords", "patient", patientId],
    queryFn: () => medicalRecordService.getMedicalRecordsByPatientId(patientId),
    enabled: !!patientId,
  });
};

export const useMedicalRecordsByDoctorQuery = (doctorId: string) => {
  return useQuery({
    queryKey: ["medicalRecords", "doctor", doctorId],
    queryFn: () => medicalRecordService.getMedicalRecordsByDoctorId(doctorId),
    enabled: !!doctorId,
  });
};
