import { useQuery } from '@tanstack/react-query';
import { permissionService } from '../services/permissionService';

export const usePermissionsQuery = () => {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: () => permissionService.getPermissions(),
  });
};