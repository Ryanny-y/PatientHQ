import { useState, useMemo } from 'react';
import type {
  DoctorAccount,
  doctorModalMode,
  statusFilter,
  sortOption,
} from '@/features/doctorAccounts/types/doctorAccount';

import { useDoctorsQuery } from './useDoctorsQuery';
import { useDoctorMutations } from './useDoctorMutation';

const PAGE_SIZE = 7;

export const useDoctorAccounts = () => {
  // server state
  const { data: accounts = [] } = useDoctorsQuery();
  const mutations = useDoctorMutations();

  // UI state only
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<statusFilter>('all');
  const [specializationFilter, setSpecializationFilter] = useState('all');
  const [sortOption, setSortOption] = useState<sortOption>('newest');
  const [page, setPage] = useState(1);
  const [modalMode, setModalMode] = useState<doctorModalMode>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorAccount | null>(null);

  // reset page helpers
  const handleSetSearch = (v: string) => {
    setSearch(v);
    setPage(1);
  };

  const handleSetStatus = (v: statusFilter) => {
    setStatusFilter(v);
    setPage(1);
  };

  const handleSetSpec = (v: string) => {
    setSpecializationFilter(v);
    setPage(1);
  };

  const handleSetSort = (v: sortOption) => {
    setSortOption(v);
    setPage(1);
  };

  // Derive unique specializations from current accounts list
  const allSpecializations = useMemo(
    () => [...new Set(accounts.map((a) => a.specialization))].sort(),
    [accounts]
  );

  // 🔥 FILTER LOGIC
  const filtered = useMemo(() => {
    let result = [...accounts];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (d) =>
          d.username.toLowerCase().includes(q) ||
          d.fullName.toLowerCase().includes(q) ||
          (d.email?.toLowerCase().includes(q) ?? false) ||
          d.licenseNumber.toLowerCase().includes(q)
      );
    }

    if (statusFilter === 'active') result = result.filter((d) => d.isActive);
    if (statusFilter === 'inactive') result = result.filter((d) => !d.isActive);

    if (specializationFilter !== 'all') {
      result = result.filter((d) => d.specialization === specializationFilter);
    }

    result.sort((a, b) => {
      if (sortOption === 'newest')
        return (
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
        );

      if (sortOption === 'oldest')
        return (
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
        );

      return a.fullName.localeCompare(b.fullName);
    });

    return result;
  }, [accounts, search, statusFilter, specializationFilter, sortOption]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // modal
  const openModal = (mode: NonNullable<doctorModalMode>, doctor?: DoctorAccount) => {
    setSelectedDoctor(doctor ?? null);
    setModalMode(mode);
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedDoctor(null);
  };

  return {
    // data
    filtered: paginated,
    allFilteredCount: filtered.length,
    totalCount: accounts.length,
    activeCount: accounts.filter((d) => d.isActive).length,
    inactiveCount: accounts.filter((d) => !d.isActive).length,
    specializationCount: new Set(accounts.map((d) => d.specialization)).size,

    // pagination
    page,
    pageSize: PAGE_SIZE,
    totalPages,
    setPage,

    // filters
    search,
    setSearch: handleSetSearch,
    statusFilter,
    setStatusFilter: handleSetStatus,
    specializationFilter,
    setSpecializationFilter: handleSetSpec,
    sortOption,
    setSortOption: handleSetSort,
    allSpecializations,

    // modal
    modalMode,
    selectedDoctor,
    openModal,
    closeModal,

    // mutations
    createDoctor: mutations.createDoctor.mutateAsync,
    updateDoctor: mutations.updateDoctor.mutateAsync,
    deleteDoctor: mutations.deleteDoctor.mutateAsync,
    toggleStatus: mutations.toggleStatus.mutateAsync,
    resetPassword: mutations.resetPassword.mutateAsync,
  };
};
