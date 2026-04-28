import { useQuery } from "@tanstack/react-query";
import { nurseService } from "../services/nurseService";

export const useNurseQuery = () => {
  return useQuery({
    queryKey: ["nurses"],
    queryFn: nurseService.getNurses,
  });
}