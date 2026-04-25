import { useState, useMemo } from 'react';
import { mockDoctorAccounts } from '@/features/doctorAccounts/utils/mockDoctorData';
import type {
  DoctorAccount,
  doctorModalMode,
  statusFilter,
  sortOption,
  addDoctorFormValues,
  editDoctorFormValues,
} from '@/features/doctorAccounts/types/doctorAccount';

interface useDoctorAccountsReturn {
  filtered: DoctorAccount[];
  allFilteredCount: number;
  totalCount: number;
  activeCount: number;
  inactiveCount: number;
  specializationCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  setPage: (p: number) => void;
  search: string;
  setSearch: (v: string) => void;
  statusFilter: statusFilter;
  setStatusFilter: (v: statusFilter) => void;
  specializationFilter: string;
  setSpecializationFilter: (v: string) => void;
  sortOption: sortOption;
  setSortOption: (v: sortOption) => void;
  allSpecializations: string[];
  modalMode: doctorModalMode;
  selectedDoctor: DoctorAccount | null;
  openModal: (mode: NonNullable<doctorModalMode>, doctor?: DoctorAccount) => void;
  closeModal: () => void;
  createDoctor: (values: addDoctorFormValues) => void;
  updateDoctor: (id: number, values: editDoctorFormValues) => void;
  resetPassword: (id: number) => void;
  toggleStatus: (id: number) => void;
  deleteDoctor: (id: number) => void;
}

const PAGE_SIZE = 7;

export const useDoctorAccounts = (): useDoctorAccountsReturn => {
  const [accounts, setAccounts] = useState<DoctorAccount[]>(mockDoctorAccounts);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<statusFilter>('all');
  const [specializationFilter, setSpecializationFilter] = useState('all');
  const [sortOption, setSortOption] = useState<sortOption>('newest');
  const [page, setPage] = useState(1);
  const [modalMode, setModalMode] = useState<doctorModalMode>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorAccount | null>(null);

  const resetPage = (): void => setPage(1);

  const handleSetSearch = (v: string): void => { setSearch(v); resetPage(); };
  const handleSetStatus = (v: statusFilter): void => { setStatusFilter(v); resetPage(); };
  const handleSetSpec = (v: string): void => { setSpecializationFilter(v); resetPage(); };
  const handleSetSort = (v: sortOption): void => { setSortOption(v); resetPage(); };

  // Derive unique specializations from current accounts list
  const allSpecializations = useMemo(
    () => [...new Set(accounts.map((a) => a.specialization))].sort(),
    [accounts]
  );

  const filtered = useMemo(() => {
    let result = [...accounts];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (d) =>
          d.username.toLowerCase().includes(q) ||
          d.full_name.toLowerCase().includes(q) ||
          d.email.toLowerCase().includes(q) ||
          d.license_number.toLowerCase().includes(q)
      );
    }

    if (statusFilter === 'active') result = result.filter((d) => d.is_active);
    if (statusFilter === 'inactive') result = result.filter((d) => !d.is_active);

    if (specializationFilter !== 'all') {
      result = result.filter((d) => d.specialization === specializationFilter);
    }

    result.sort((a, b) => {
      if (sortOption === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortOption === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return a.full_name.localeCompare(b.full_name);
    });

    return result;
  }, [accounts, search, statusFilter, specializationFilter, sortOption]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openModal = (mode: NonNullable<doctorModalMode>, doctor?: DoctorAccount): void => {
    setSelectedDoctor(doctor ?? null);
    setModalMode(mode);
  };

  const closeModal = (): void => {
    setModalMode(null);
    setSelectedDoctor(null);
  };

  const createDoctor = (values: addDoctorFormValues): void => {
    const newDoctor: DoctorAccount = {
      doctor_id: Math.max(...accounts.map((d) => d.doctor_id)) + 1,
      user_id: Math.max(...accounts.map((d) => d.user_id)) + 1,
      username: values.username,
      full_name: values.full_name,
      specialization: values.specialization,
      license_number: values.license_number,
      email: values.email,
      contact_number: values.contact_number,
      is_active: values.is_active,
      created_at: new Date().toISOString().split('T')[0],
      assigned_patients: 0,
      upcoming_appointments: 0,
      last_login: 'Never',
    };
    setAccounts((prev) => [newDoctor, ...prev]);
  };

  const updateDoctor = (id: number, values: editDoctorFormValues): void => {
    setAccounts((prev) =>
      prev.map((d) =>
        d.doctor_id === id
          ? { ...d, ...values }
          : d
      )
    );
  };

  const resetPassword = (_id: number): void => {
    // No-op — toast handled by caller
  };

  const toggleStatus = (id: number): void => {
    setAccounts((prev) =>
      prev.map((d) => (d.doctor_id === id ? { ...d, is_active: !d.is_active } : d))
    );
  };

  const deleteDoctor = (id: number): void => {
    setAccounts((prev) => prev.filter((d) => d.doctor_id !== id));
  };

  return {
    filtered: paginated,
    allFilteredCount: filtered.length,
    totalCount: accounts.length,
    activeCount: accounts.filter((d) => d.is_active).length,
    inactiveCount: accounts.filter((d) => !d.is_active).length,
    specializationCount: new Set(accounts.map((d) => d.specialization)).size,
    page,
    pageSize: PAGE_SIZE,
    totalPages,
    setPage,
    search,
    setSearch: handleSetSearch,
    statusFilter,
    setStatusFilter: handleSetStatus,
    specializationFilter,
    setSpecializationFilter: handleSetSpec,
    sortOption,
    setSortOption: handleSetSort,
    allSpecializations,
    modalMode,
    selectedDoctor,
    openModal,
    closeModal,
    createDoctor,
    updateDoctor,
    resetPassword,
    toggleStatus,
    deleteDoctor,
  };
};
