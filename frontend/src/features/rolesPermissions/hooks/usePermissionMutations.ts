import { useMutation, useQueryClient } from "@tanstack/react-query";
import { permissionService } from "../services/permissionService";
import { roleService } from "../services/rolesService";
import type { Permission } from "../types/roles";

export const usePermissionMutation = () => {
  const queryClient = useQueryClient();

  const invalidatePermissions = () =>
    queryClient.invalidateQueries({ queryKey: ["permissions"] });

  const invalidateRolePermissions = (roleId?: string) => {
    queryClient.invalidateQueries({ queryKey: ["roles"] });
    queryClient.invalidateQueries({ queryKey: ["rolePermissions"] });
    if (roleId) {
      queryClient.invalidateQueries({
        queryKey: ["rolePermissions", roleId],
      });
    }
  };

  const createPermission = useMutation({
    mutationFn: permissionService.createPermission,
    onSuccess: invalidatePermissions,
  });

  const updatePermission = useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Pick<Permission, "permissionName" | "description">>;
    }) => permissionService.updatePermission(id, updates),
    onSuccess: invalidatePermissions,
  });

  const deletePermission = useMutation({
    mutationFn: permissionService.deletePermission,
    onSuccess: invalidatePermissions,
  });

  const updateRolePermissions = useMutation({
    mutationFn: ({
      roleId,
      permissionIds,
    }: {
      roleId: string;
      permissionIds: string[];
    }) => roleService.updateRolePermissions(roleId, permissionIds),
    onSuccess: (_, variables) => {
      invalidateRolePermissions(variables.roleId);
    },
  });

  return {
    createPermission,
    updatePermission,
    deletePermission,
    updateRolePermissions,
  };
};