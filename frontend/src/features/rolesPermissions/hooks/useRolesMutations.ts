import { roleService } from "../services/rolesService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Role } from "../types/roles";

export const useRolesMutation = () => {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["roles"] });

  const createRole = useMutation({
    mutationFn: roleService.createRole,
    onSuccess: invalidate,
  });

  const updateRole = useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Pick<Role, "roleName">>;
    }) => roleService.updateRole(id, updates),
    onSuccess: invalidate,
  });

  const deleteRole = useMutation({
    mutationFn: roleService.deleteRole,
    onSuccess: invalidate,
  });

  return {
    createRole,
    updateRole,
    deleteRole,
  };
};