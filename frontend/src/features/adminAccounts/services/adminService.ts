import { fetchWithAuth } from "@/shared/hooks/fetchWithAuth";
import type {
  AdminAccount,
  addAdminFormValues,
  editAdminFormValues,
} from "../types/adminAccount";
import type { ApiResponse } from "@/shared/types/api";

export const adminService = {
  getAdmins: () =>
    fetchWithAuth<ApiResponse<AdminAccount[]>>("admins").then((r) => r.data),

  createAdmin: (values: addAdminFormValues) =>
    fetchWithAuth<ApiResponse<AdminAccount>>("admins", {
      method: "POST",
      body: JSON.stringify(values),
    }).then((r) => r.data),

  updateAdmin: (id: number, values: editAdminFormValues) =>
    fetchWithAuth<ApiResponse<AdminAccount>>(`admins/${id}`, {
      method: "PUT",
      body: JSON.stringify(values),
    }).then((r) => r.data),

  deleteAdmin: (id: number) =>
    fetchWithAuth(`admins/${id}`, {
      method: "DELETE",
    }),

  toggleStatus: (id: number) =>
    fetchWithAuth<ApiResponse<AdminAccount>>(
      `admins/${id}/toggle-status`,
      { method: "PATCH" },
    ).then((r) => r.data),

  resetPassword: (id: number) =>
    fetchWithAuth(`admins/${id}/reset-password`, { method: "POST" }),
};