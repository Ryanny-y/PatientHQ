import { useState, useEffect } from 'react';
import { getPatients } from '@/features/patients/services/patientService';
import type { Patient } from '@/features/patients/types/Patient';

interface usePatientListReturn {
  patients: Patient[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const usePatientList = (): usePatientListReturn => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    const response = await getPatients();

    if (!response.success) {
      setError(response.message);
    } else {
      setPatients(response.data);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return { patients, isLoading, error, refetch: fetchPatients };
};
