import { fetchWithAuth } from "@/shared/hooks/fetchWithAuth";
import type {
  AdminAccount,
  addAdminFormValues,
  editAdminFormValues,
} from "../types/adminAccount";
import type { ApiResponse, PageResponse } from "@/shared/types/api";

export const adminService = {
  getAdmins: () =>
    fetchWithAuth<ApiResponse<PageResponse<AdminAccount>>>("admins").then((r) => r.data.content),

  createAdmin: (values: addAdminFormValues) =>
    fetchWithAuth<ApiResponse<AdminAccount>>("admins", {
      method: "POST",
      body: JSON.stringify(values),
    }).then((r) => r.data),

  updateAdmin: (id: string, values: editAdminFormValues) =>
    fetchWithAuth<ApiResponse<AdminAccount>>(`admins/${id}`, {
      method: "PUT",
      body: JSON.stringify(values),
    }).then((r) => r.data),

  deleteAdmin: (id: string) =>
    fetchWithAuth(`admins/${id}`, {
      method: "DELETE",
    }),

  toggleStatus: (id: string) =>
    fetchWithAuth<ApiResponse<AdminAccount>>(
      `admins/${id}/toggle-status`,
      { method: "PATCH" },
    ).then((r) => r.data),

  resetPassword: (id: string) =>
    fetchWithAuth(`admins/${id}/reset-password`, { method: "POST" }),
};