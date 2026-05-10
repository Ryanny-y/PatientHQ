import { fetchWithAuth } from "@/shared/hooks/fetchWithAuth";
import type {
  DoctorAccount,
  addDoctorFormValues,
  editDoctorFormValues,
} from "../types/doctorAccount";
import type { resetPasswordFormValues } from "@/features/adminAccounts/types/adminAccount";
import type { ApiResponse, PageResponse } from "@/shared/types/api";

export const doctorService = {
  getDoctors: (params: {
    page?: number;
    size?: number;
    search?: string;
    isActive?: boolean;
    specialization?: string;
    sort?: string;
  }) => {
    const query = new URLSearchParams();

    if (params.page !== undefined) query.append("page", String(params.page));
    if (params.size !== undefined) query.append("size", String(params.size));
    if (params.search) query.append("search", params.search);
    if (params.isActive !== undefined)
      query.append("isActive", String(params.isActive));
    if (params.specialization)
      query.append("specialization", params.specialization);
    if (params.sort) query.append("sort", params.sort);

    return fetchWithAuth<ApiResponse<PageResponse<DoctorAccount>>>(
      `doctors?${query.toString()}`,
    );
  },

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
    fetchWithAuth<ApiResponse<DoctorAccount>>(`doctors/${id}/toggle-status`, {
      method: "PATCH",
    }),

  resetPassword: (id: string, values: resetPasswordFormValues) =>
    fetchWithAuth<ApiResponse<void>>(`doctors/${id}/reset-password`, {
      method: "POST",
      body: JSON.stringify(values),
    }),
};
