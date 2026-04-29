import { usePermissionMutation } from "./usePermissionMutations";
import { usePermissionsQuery } from "./usePermissionsQuery";

export const usePermissions = () => {
  const { data, isLoading, refetch } = usePermissionsQuery();
  const mutations = usePermissionMutation();

  return {
    permissions: data?.data ?? [],
    isLoading,
    refetch,

    createPermission: mutations.createPermission.mutateAsync,
    createPermissionMutation: mutations.createPermission,
    updatePermission: mutations.updatePermission.mutateAsync,
    updatePermissionMutation: mutations.updatePermission,
    deletePermission: mutations.deletePermission.mutateAsync,
    deletePermissionMutation: mutations.deletePermission,
    updateRolePermissions: mutations.updateRolePermissions.mutateAsync,
    updateRolePermissionsMutation: mutations.updateRolePermissions,
  };
};