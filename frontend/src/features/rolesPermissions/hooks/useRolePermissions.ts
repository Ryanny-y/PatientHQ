import { useQuery } from '@tanstack/react-query';
import { getRolePermissions } from '../services/rolesService';

export const useRolePermissions = (roleId: string) => {
  return useQuery({
    queryKey: ['rolePermissions', roleId],
    queryFn: () => getRolePermissions(roleId),
    enabled: !!roleId,
  });
};