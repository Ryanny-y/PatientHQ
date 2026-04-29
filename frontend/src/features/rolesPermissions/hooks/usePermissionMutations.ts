import { useMutation, useQueryClient } from "@tanstack/react-query";
import { permissionService } from "../services/permissionService";
import { roleService } from "../services/rolesService";

export const usePermissionMutation = () => {
  const queryClient = useQueryClient();

  const invalidatePermissions = () =>
    queryClient.invalidateQueries({ queryKey: ["permissions"] });

  const invalidateRolePermissions = (roleId?: string) => {
    queryClient.invalidateQueries({ queryKey: ["roles"] });
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
    updateRolePermissions,
  };
};