import { fetchWithAuth } from "@/shared/hooks/fetchWithAuth";
import type { ApiResponse, PageResponse } from "@/shared/types/api";
import type {
  addPatientFormValues,
  editPatientFormValues,
  Patient,
} from "../types/patient";

export const patientService = {
  getPatients: () =>
    fetchWithAuth<ApiResponse<PageResponse<Patient>>>("patients").then(
      (r) => r.data.content,
    ),

  createPatient: (values: addPatientFormValues) =>
    fetchWithAuth<ApiResponse<Patient>>("patients", {
      method: "POST",
      body: JSON.stringify(values),
    }),

  updatePatient: (id: string, values: editPatientFormValues) =>
    fetchWithAuth<ApiResponse<Patient>>(`patients/${id}`, {
      method: "PUT",
      body: JSON.stringify(values),
    }),

  deletePatient: (id: string) =>
    fetchWithAuth<ApiResponse<void>>(`patients/${id}`, {
      method: "DELETE",
    }),
};
