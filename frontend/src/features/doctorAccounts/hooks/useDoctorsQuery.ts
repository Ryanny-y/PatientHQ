import { useQuery } from "@tanstack/react-query";
import { doctorService } from "../services/doctorService";

export const useDoctorsQuery = () => {
  return useQuery({
    queryKey: ["doctors"],
    queryFn: doctorService.getDoctors,
  });
};
