import { fetchWithAuth } from "@/shared/hooks/fetchWithAuth";
import type { ApiResponse, PageResponse } from "@/shared/types/api";
import type {
  addNurseFormValues,
  editNurseFormValues,
  NurseAccount,
} from "../types/nurseAccount";

export const nurseService = {
  getNurses: (params: {
    page?: number;
    size?: number;
    search?: string;
    isActive?: boolean;
    assignedWard?: string;
    sort?: string;
  }) => {
    const query = new URLSearchParams();

    if (params.page !== undefined) query.append("page", String(params.page));
    if (params.size !== undefined) query.append("size", String(params.size));
    if (params.search) query.append("search", params.search);
    if (params.isActive !== undefined)
      query.append("isActive", String(params.isActive));
    if (params.assignedWard) query.append("assignedWard", params.assignedWard);
    if (params.sort) query.append("sort", params.sort);

    return fetchWithAuth<ApiResponse<PageResponse<NurseAccount>>>(
      `nurses?${query.toString()}`,
    );
  },

  createNurse: (values: addNurseFormValues) =>
    fetchWithAuth<ApiResponse<NurseAccount>>("nurses", {
      method: "POST",
      body: JSON.stringify(values),
    }),

  updateNurse: (id: string, values: editNurseFormValues) =>
    fetchWithAuth<ApiResponse<NurseAccount>>(`nurses/${id}`, {
      method: "PATCH",
      body: JSON.stringify(values),
    }),

  deleteNurse: (id: string) =>
    fetchWithAuth<ApiResponse<NurseAccount>>(`nurses/${id}`, {
      method: "DELETE",
    }),

  toggleStatus: (id: string) =>
    fetchWithAuth<ApiResponse<NurseAccount>>(`nurses/${id}/toggle-status`, {
      method: "PATCH",
    }),

  resetPassword: (id: string) =>
    fetchWithAuth(`nurses/${id}/reset-password`, { method: "POST" }),
};
