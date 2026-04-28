import { fetchWithAuth } from "@/shared/hooks/fetchWithAuth";
import type {
  DoctorAccount,
  addDoctorFormValues,
  editDoctorFormValues,
} from "../types/doctorAccount";
import type { ApiResponse, PageResponse } from "@/shared/types/api";

export const doctorService = {
  getDoctors: () =>
    fetchWithAuth<ApiResponse<PageResponse<DoctorAccount>>>("doctors").then((r) => r.data.content),

  createDoctor: (values: addDoctorFormValues) =>
    fetchWithAuth<ApiResponse<DoctorAccount>>("doctors", {
      method: "POST",
      body: JSON.stringify(values),
    }),

  updateDoctor: (id: string, values: editDoctorFormValues) =>
    fetchWithAuth<ApiResponse<DoctorAccount>>(`doctors/${id}`, {
      method: "PUT",
      body: JSON.stringify(values),
    }),

  deleteDoctor: (id: string) =>
    fetchWithAuth<ApiResponse<void>>(`doctors/${id}`, {
      method: "DELETE",
    }),

  toggleStatus: (id: string) =>
    fetchWithAuth<ApiResponse<DoctorAccount>>(
      `doctors/${id}/toggle-status`,
      { method: "PATCH" },
    ),

  resetPassword: (id: string) =>
    fetchWithAuth<ApiResponse<void>>(`doctors/${id}/reset-password`, { method: "POST" }),
};
