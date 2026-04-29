import { useQuery } from "@tanstack/react-query";
import { patientService } from "../services/patientService";

export const usePatientQuery = (params: {
  page: number;
  size: number;
  search?: string;
  status?: string;
  gender?: string;
  bloodType?: string;
  sort?: string;
}) => {
  return useQuery({
    queryKey: ["patients", params],
    queryFn: () => patientService.getPatients(params),
    placeholderData: (prev) => prev,
  });
};