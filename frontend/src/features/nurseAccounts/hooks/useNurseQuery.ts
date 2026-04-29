import { useQuery } from "@tanstack/react-query";
import { nurseService } from "../services/nurseService";

export const useNurseQuery = (params: {
  page: number;
  size: number;
  search?: string;
  isActive?: boolean;
  assignedWard?: string;
  sort?: string;
}) => {
  return useQuery({
    queryKey: ["nurses", params],
    queryFn: () => nurseService.getNurses(params),
    placeholderData: (prev) => prev,
  });
};