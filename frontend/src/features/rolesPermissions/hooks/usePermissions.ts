import { useQuery } from '@tanstack/react-query';
import { getPermissions } from '../services/rolesService';

export const usePermissions = () => {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: getPermissions,
  });
};