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
    }),

  updateAdmin: (id: string, values: editAdminFormValues) =>
    fetchWithAuth<ApiResponse<AdminAccount>>(`admins/${id}`, {
      method: "PUT",
      body: JSON.stringify(values),
    }),

  deleteAdmin: (id: string) =>
    fetchWithAuth<ApiResponse<void>>(`admins/${id}`, {
      method: "DELETE",
    }),

  toggleStatus: (id: string) =>
    fetchWithAuth<ApiResponse<AdminAccount>>(
      `admins/${id}/toggle-status`,
      { method: "PATCH" },
    ),

  resetPassword: (id: string) =>
    fetchWithAuth(`admins/${id}/reset-password`, { method: "POST" }),
};