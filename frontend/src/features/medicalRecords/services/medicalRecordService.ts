import { fetchWithAuth } from "@/shared/hooks/fetchWithAuth";
import type { ApiResponse, PageResponse } from "@/shared/types/api";
import type {
  MedicalRecord,
  MedicalRecordFormData,
} from "../types/medicalRecord";

export const medicalRecordService = {
  getMedicalRecords: (params: {
    page?: number;
    size?: number;
    patientId?: string;
    doctorId?: string;
    search?: string;
  }) => {
    const query = new URLSearchParams();

    if (params.page !== undefined) query.append("page", String(params.page));
    if (params.size !== undefined) query.append("size", String(params.size));
    if (params.patientId) query.append("patientId", params.patientId);
    if (params.doctorId) query.append("doctorId", params.doctorId);
    if (params.search) query.append("search", params.search);

    return fetchWithAuth<ApiResponse<PageResponse<MedicalRecord>>>(
      `medical-records?${query.toString()}`,
    );
  },

  getMedicalRecordById: (id: string) =>
    fetchWithAuth<ApiResponse<MedicalRecord>>(`medical-records/${id}`),

  getMedicalRecordsByPatientId: (patientId: string) =>
    fetchWithAuth<ApiResponse<MedicalRecord[]>>(`medical-records/patient/${patientId}`),

  getMedicalRecordsByDoctorId: (doctorId: string) =>
    fetchWithAuth<ApiResponse<MedicalRecord[]>>(`medical-records/doctor/${doctorId}`),

  createMedicalRecord: (values: MedicalRecordFormData) =>
    fetchWithAuth<ApiResponse<MedicalRecord>>("medical-records", {
      method: "POST",
      body: JSON.stringify(values),
    }),

  updateMedicalRecord: (id: string, values: Partial<MedicalRecordFormData>) =>
    fetchWithAuth<ApiResponse<MedicalRecord>>(`medical-records/${id}`, {
      method: "PATCH",
      body: JSON.stringify(values),
    }),

  deleteMedicalRecord: (id: string) =>
    fetchWithAuth<ApiResponse<void>>(`medical-records/${id}`, {
      method: "DELETE",
    }),
};