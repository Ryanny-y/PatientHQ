import { fetchWithAuth } from "@/shared/hooks/fetchWithAuth";
import type { ApiResponse } from "@/shared/types/api";
import type { Role, PermissionWithStatus } from "../types/roles";

export const roleService = {
  getRoles: () =>
    fetchWithAuth<ApiResponse<Role[]>>("roles"),

  createRole: (role: Omit<Role, "id" | "userCount" | "permissionCount" | 'createdAt'>) =>
    fetchWithAuth<ApiResponse<Role>>("roles", {
      method: "POST",
      body: JSON.stringify(role),
    }),

  updateRole: (
    id: string,
    updates: Partial<Pick<Role, "roleName">>
  ) =>
    fetchWithAuth<ApiResponse<void>>(`roles/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    }),

  deleteRole: (id: string) =>
    fetchWithAuth<ApiResponse<void>>(`roles/${id}`, {
      method: "DELETE",
    }),

  getRolePermissions: (roleId: string) =>
    fetchWithAuth<ApiResponse<PermissionWithStatus[]>>(
      `roles/${roleId}/permissions`
    ),

  updateRolePermissions: (
    roleId: string,
    permissionIds: string[]
  ) =>
    fetchWithAuth<ApiResponse<void>>(
      `roles/${roleId}/permissions`,
      {
        method: "PUT",
        body: JSON.stringify({ permissionIds }),
      }
    ),
};