import { fetchWithAuth } from "@/shared/hooks/fetchWithAuth";
import type { ApiResponse } from "@/shared/types/api";
import type { Permission } from "../types/roles";

export const permissionService = {
  getPermissions: () =>
    fetchWithAuth<ApiResponse<Permission[]>>("permissions"),

  createPermission: (permission: Omit<Permission, "id">) =>
    fetchWithAuth<ApiResponse<Permission>>("permissions", {
      method: "POST",
      body: JSON.stringify(permission),
    }),
};