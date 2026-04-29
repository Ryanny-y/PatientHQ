import { useQuery } from '@tanstack/react-query';
import { roleService } from '../services/rolesService';

export const useRolesQuery = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: roleService.getRoles,
  });
};
