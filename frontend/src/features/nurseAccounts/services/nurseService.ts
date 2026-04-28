import { fetchWithAuth } from "@/shared/hooks/fetchWithAuth";
import type { ApiResponse, PageResponse } from "@/shared/types/api";
import type {
  addNurseFormValues,
  editNurseFormValues,
  NurseAccount,
} from "../types/nurseAccount";

export const nurseService = {
  getNurses: () =>
    fetchWithAuth<ApiResponse<PageResponse<NurseAccount>>>("nurses").then(
      (r) => r.data.content,
    ),

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
