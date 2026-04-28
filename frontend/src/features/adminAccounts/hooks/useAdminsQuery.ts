import { useQuery } from "@tanstack/react-query";
import { adminService } from "../services/adminService";

export const useAdminsQuery = (params: {
  page: number;
  size: number;
  search?: string;
  isActive?: boolean;
  sort?: string;
}) => {
  return useQuery({
    queryKey: ["admins", params],
    queryFn: () => adminService.getAdmins(params),
    placeholderData: (prev) => prev,
  });
};