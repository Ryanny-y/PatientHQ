import { useQuery } from "@tanstack/react-query";
import { adminService } from "../services/adminService";

export const useAdminsQuery = () => {
  return useQuery({
    queryKey: ["admins"],
    queryFn: adminService.getAdmins,
  });
};