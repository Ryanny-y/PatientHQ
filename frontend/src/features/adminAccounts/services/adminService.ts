import { fetchWithAuth } from "@/shared/hooks/fetchWithAuth";
import type {
  AdminAccount,
  AdminMetaData,
  addAdminFormValues,
  editAdminFormValues,
  resetPasswordFormValues,
} from "../types/adminAccount";
import type { ApiResponse, PageResponse } from "@/shared/types/api";

export const adminService = {
  getAdmins: (params: {
    page?: number;
    size?: number;
    search?: string;
    isActive?: boolean;
    sort?: string;
  }) => {
    const query = new URLSearchParams();

    if (params.page !== undefined) query.append("page", String(params.page));
    if (params.size !== undefined) query.append("size", String(params.size));
    if (params.search) query.append("search", params.search);
    if (params.isActive !== undefined)
      query.append("isActive", String(params.isActive));
    if (params.sort) query.append("sort", params.sort);

    return fetchWithAuth<ApiResponse<PageResponse<AdminAccount>>>(
      `admins?${query.toString()}`,
    );
  },

  getAdminMeta: () => fetchWithAuth<ApiResponse<AdminMetaData>>("admins/meta"),

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

  resetPassword: (id: string, values: resetPasswordFormValues) =>
    fetchWithAuth<ApiResponse<void>>(`admins/${id}/reset-password`, {
      method: "POST",
      body: JSON.stringify(values),
    }),
};
