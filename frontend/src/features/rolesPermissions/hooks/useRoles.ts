import { useRolesMutation } from "./useRolesMutations";
import { useRolesQuery } from "./useRolesQuery";

export const useRoles = () => {
  const { data, isLoading, refetch } = useRolesQuery();
  const mutations = useRolesMutation();

  return {
    roles: data?.data ?? [],
    isLoading,
    refetchRoles: refetch,

    createRole: mutations.createRole.mutateAsync,
    createRoleMutation: mutations.createRole,
    
    updateRole: mutations.updateRole.mutateAsync,
    deleteRole: mutations.deleteRole.mutateAsync,
  }
}