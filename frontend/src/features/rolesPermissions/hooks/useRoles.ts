import { useQuery } from '@tanstack/react-query';
import { getRoles } from '../services/rolesService';

export const useRoles = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
  });
};