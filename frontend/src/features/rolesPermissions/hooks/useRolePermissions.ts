import { useQuery } from '@tanstack/react-query';
import { roleService } from '../services/rolesService';

export const useRolePermissions = (roleId: string) => {
  return useQuery({
    queryKey: ['rolePermissions', roleId],
    queryFn: () => roleService.getRolePermissions(roleId),
    enabled: !!roleId,
  });
};