import { useState } from 'react';
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

  const sort =
    sortBy === 'newest' ? 'recordedAt,desc' :
    sortBy === 'oldest' ? 'recordedAt,asc' :
    'patientName,asc';

  const { data: response, isLoading, refetch } = useVitalSignsQuery({
    page: page - 1,
    size: PAGE_SIZE,
    search: search || undefined,
    dateFilter: dateFilter === 'all' ? undefined : dateFilter,
    sort,
  });

  const { data: meta } = useVitalSignsMetaQuery();
  const mutations = useVitalSignsMutation();

  const data = response?.data?.content ?? [];
  const totalPages = response?.data?.totalPages ?? 1;

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
