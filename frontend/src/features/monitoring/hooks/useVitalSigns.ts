import { useMemo, useState } from 'react';
import { useVitalSignsMetaQuery, useVitalSignsQuery } from './useVitalSignsQuery';
import { useVitalSignsMutation } from './useVitalSignsMutation';
import type { addVitalSignsFormValues, vitalDateFilter, vitalSortOption, VitalSigns } from '../types/vitalSigns';

type modalMode = 'view' | 'add' | 'edit' | 'delete' | null;

const PAGE_SIZE = 10;

interface useVitalSignsReturn {
  data: VitalSigns[];
  meta: ReturnType<typeof useVitalSignsMetaQuery>['data'];
  isLoading: boolean;
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
  refetch: () => void;
  search: string;
  setSearch: (v: string) => void;
  dateFilter: vitalDateFilter;
  setDateFilter: (v: vitalDateFilter) => void;
  sortBy: vitalSortOption;
  setSortBy: (v: vitalSortOption) => void;
  modalMode: modalMode;
  selectedVital: VitalSigns | null;
  openModal: (mode: NonNullable<modalMode>, vital?: VitalSigns) => void;
  closeModal: () => void;
  createVitalSigns: (values: addVitalSignsFormValues) => Promise<void>;
  updateVitalSigns: (id: string, values: Partial<addVitalSignsFormValues>) => Promise<void>;
  deleteVitalSigns: (id: string) => Promise<void>;
}

export const useVitalSigns = (): useVitalSignsReturn => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState<vitalDateFilter>('all');
  const [sortBy, setSortBy] = useState<vitalSortOption>('newest');
  const [modalMode, setModalMode] = useState<modalMode>(null);
  const [selectedVital, setSelectedVital] = useState<VitalSigns | null>(null);

  const { data: response, isLoading, refetch } = useVitalSignsQuery();

  const { data: meta } = useVitalSignsMetaQuery();
  const mutations = useVitalSignsMutation();

  const filteredData = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);

    return (response?.data ?? [])
      .filter((vital) => {
        const searchTerm = search.trim().toLowerCase();
        if (!searchTerm) return true;

        return [
          vital.patientName,
          vital.patientId,
          vital.recordedByName,
          vital.recordedBy,
        ].some((value) => value?.toLowerCase().includes(searchTerm));
      })
      .filter((vital) => {
        if (dateFilter === 'all') return true;

        const recordedAt = new Date(vital.recordedAt);
        if (Number.isNaN(recordedAt.getTime())) return false;

        if (dateFilter === 'today') {
          return recordedAt.toDateString() === now.toDateString();
        }

        return recordedAt >= weekAgo;
      })
      .sort((a, b) => {
        if (sortBy === 'patient-asc') {
          return (a.patientName ?? '').localeCompare(b.patientName ?? '');
        }

        const aTime = new Date(a.recordedAt).getTime();
        const bTime = new Date(b.recordedAt).getTime();
        return sortBy === 'oldest' ? aTime - bTime : bTime - aTime;
      });
  }, [dateFilter, response?.data, search, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
  const data = filteredData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSetSearch = (v: string) => { setSearch(v); setPage(1); };
  const handleSetDateFilter = (v: vitalDateFilter) => { setDateFilter(v); setPage(1); };
  const handleSetSort = (v: vitalSortOption) => { setSortBy(v); setPage(1); };

  const openModal = (mode: NonNullable<modalMode>, vital?: VitalSigns) => {
    setSelectedVital(vital ?? null);
    setModalMode(mode);
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedVital(null);
  };

  const createVitalSigns = async (values: addVitalSignsFormValues): Promise<void> => {
    await mutations.createVitalSigns.mutateAsync(values);
  };

  const updateVitalSigns = async (id: string, values: Partial<addVitalSignsFormValues>): Promise<void> => {
    await mutations.updateVitalSigns.mutateAsync({ id, values });
  };

  const deleteVitalSigns = async (id: string): Promise<void> => {
    await mutations.deleteVitalSigns.mutateAsync(id);
  };

  return {
    data,
    meta,
    isLoading,
    page,
    totalPages,
    setPage,
    refetch,
    search,
    setSearch: handleSetSearch,
    dateFilter,
    setDateFilter: handleSetDateFilter,
    sortBy,
    setSortBy: handleSetSort,
    modalMode,
    selectedVital,
    openModal,
    closeModal,
    createVitalSigns,
    updateVitalSigns,
    deleteVitalSigns,
  };
};
