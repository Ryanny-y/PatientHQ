import { useState, useMemo } from 'react';
import { usePatientQuery } from '@/features/patients/hooks/usePatientQuery';
import { useDataIntegrityMutation } from './useDataIntegrityMutation';
import type { IntegrityStatus, IntegrityVerificationDto } from '../types/dataIntegrity';

export interface PatientRow {
  patientId: string;
  patientName: string;
}

interface UseDataIntegrityReturn {
  patients: PatientRow[];
  isLoading: boolean;
  search: string;
  setSearch: (v: string) => void;
  statusFilter: IntegrityStatus | 'all';
  setStatusFilter: (v: IntegrityStatus | 'all') => void;
  // Local cache: patientId → last verification result
  verifiedResults: Record<string, IntegrityVerificationDto>;
  // Currently open drawer result
  drawerResult: IntegrityVerificationDto | null;
  drawerOpen: boolean;
  closeDrawer: () => void;
  // Per-patient loading sets
  verifyingIds: Set<string>;
  recomputingIds: Set<string>;
  verifyPatient: (patientId: string) => Promise<void>;
  recomputePatient: (patientId: string) => Promise<void>;
  // Derived stats from local cache
  stats: { total: number; valid: number; pending: number; tampered: number; unverified: number };
}

export const useDataIntegrity = (): UseDataIntegrityReturn => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<IntegrityStatus | 'all'>('all');
  // Local cache of verification results keyed by patientId
  const [verifiedResults, setVerifiedResults] = useState<Record<string, IntegrityVerificationDto>>({});
  const [drawerResult, setDrawerResult] = useState<IntegrityVerificationDto | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  // Track which patients are currently being processed
  const [verifyingIds, setVerifyingIds] = useState<Set<string>>(new Set());
  const [recomputingIds, setRecomputingIds] = useState<Set<string>>(new Set());

  const { data: patientsResponse, isLoading } = usePatientQuery({
    page: 0,
    size: 1000,
    sort: 'fullName,asc',
  });

  const mutations = useDataIntegrityMutation();

  const allPatients: PatientRow[] = useMemo(() => {
    const raw = patientsResponse?.data?.content ?? [];
    return raw.map((p) => ({
      patientId: String(p.patientId),
      patientName: p.fullName,
    }));
  }, [patientsResponse]);

  // Apply search + status filter (status filter works against local cache)
  const patients = useMemo(() => {
    return allPatients.filter((p) => {
      const matchesSearch = p.patientName.toLowerCase().includes(search.toLowerCase());
      if (!matchesSearch) return false;
      if (statusFilter === 'all') return true;
      const cached = verifiedResults[p.patientId];
      // Unverified patients only show under 'all'
      if (!cached) return false;
      return cached.status === statusFilter;
    });
  }, [allPatients, search, statusFilter, verifiedResults]);

  const stats = useMemo(() => {
    const verified = Object.values(verifiedResults);
    return {
      total: allPatients.length,
      valid: verified.filter((r) => r.status === 'VALID').length,
      pending: verified.filter((r) => r.status === 'PENDING').length,
      tampered: verified.filter((r) => r.status === 'TAMPERED').length,
      unverified: allPatients.length - verified.length,
    };
  }, [allPatients, verifiedResults]);

  const verifyPatient = async (patientId: string): Promise<void> => {
    setVerifyingIds((prev) => new Set(prev).add(patientId));
    try {
      const result = await mutations.verifyIntegrity.mutateAsync(patientId);
      // Cache the result locally
      setVerifiedResults((prev) => ({ ...prev, [patientId]: result.data }));
      setDrawerResult(result.data);
      setDrawerOpen(true);
    } finally {
      setVerifyingIds((prev) => {
        const next = new Set(prev);
        next.delete(patientId);
        return next;
      });
    }
  };

  const recomputePatient = async (patientId: string): Promise<void> => {
    setRecomputingIds((prev) => new Set(prev).add(patientId));
    try {
      await mutations.recomputeIntegrity.mutateAsync(patientId);
      // Evict cached result so user knows they need to re-verify
      setVerifiedResults((prev) => {
        const next = { ...prev };
        delete next[patientId];
        return next;
      });
    } finally {
      setRecomputingIds((prev) => {
        const next = new Set(prev);
        next.delete(patientId);
        return next;
      });
    }
  };

  const closeDrawer = (): void => {
    setDrawerOpen(false);
    setDrawerResult(null);
  };

  return {
    patients,
    isLoading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    verifiedResults,
    drawerResult,
    drawerOpen,
    closeDrawer,
    verifyingIds,
    recomputingIds,
    verifyPatient,
    recomputePatient,
    stats,
  };
};
