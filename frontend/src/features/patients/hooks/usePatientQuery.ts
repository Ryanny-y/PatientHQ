import { useQuery } from "@tanstack/react-query";
import { patientService } from "../services/patientService";

export const usePatientQuery = () => {
  return useQuery({
    queryKey: ["patients"],
    queryFn: patientService.getPatients,
  });
}