import { useQuery } from "@tanstack/react-query";
import { doctorService } from "../services/doctorService";

export const useDoctorsQuery = (params: {
  page: number;
  size: number;
  search?: string;
  isActive?: boolean;
  specialization?: string;
  sort?: string;
}) => {
  return useQuery({
    queryKey: ["doctors", params],
    queryFn: () => doctorService.getDoctors(params),
    placeholderData: (prev) => prev,
  });
};
