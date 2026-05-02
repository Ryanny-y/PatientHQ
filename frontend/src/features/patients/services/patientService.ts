import { fetchWithAuth } from "@/shared/hooks/fetchWithAuth";
import type { ApiResponse, PageResponse } from "@/shared/types/api";
import type {
  addPatientFormValues,
  editPatientFormValues,
  Patient,
  PatientMetaData,
} from "../types/patient";

export const patientService = {
  getPatients: (params: {
    page?: number;
    size?: number;
    search?: string;
    status?: string;
    gender?: string;
    assigned?: boolean;
    bloodType?: string;
    sort?: string;
  }) => {
    const query = new URLSearchParams();

    if (params.page !== undefined) query.append("page", String(params.page));
    if (params.size !== undefined) query.append("size", String(params.size));
    if (params.search) query.append("search", params.search);
    if (params.status) query.append("status", params.status);
    if (params.gender) query.append("gender", params.gender);
    if (params.bloodType) query.append("bloodType", params.bloodType);
    if (params.assigned !== undefined) query.append("assigned", String(params.assigned));
    if (params.sort) query.append("sort", params.sort);

    return fetchWithAuth<ApiResponse<PageResponse<Patient>>>(
      `patients?${query.toString()}`,
    );
  },
  
  getPatientMeta: () => fetchWithAuth<ApiResponse<PatientMetaData>>("patients/meta"),

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
