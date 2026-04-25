import { useState, useMemo } from 'react';
import { mockNurseAccounts } from '@/features/nurseAccounts/utils/mockNurseData';
import type {
  NurseAccount,
  nurseModalMode,
  statusFilter,
  sortOption,
  addNurseFormValues,
  editNurseFormValues,
} from '@/features/nurseAccounts/types/nurseAccount';

interface useNurseAccountsReturn {
  filtered: NurseAccount[];
  allFilteredCount: number;
  totalCount: number;
  activeCount: number;
  inactiveCount: number;
  wardCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  setPage: (p: number) => void;
  search: string;
  setSearch: (v: string) => void;
  statusFilter: statusFilter;
  setStatusFilter: (v: statusFilter) => void;
  wardFilter: string;
  setWardFilter: (v: string) => void;
  sortOption: sortOption;
  setSortOption: (v: sortOption) => void;
  allWards: string[];
  modalMode: nurseModalMode;
  selectedNurse: NurseAccount | null;
  openModal: (mode: NonNullable<nurseModalMode>, nurse?: NurseAccount) => void;
  closeModal: () => void;
  createNurse: (values: addNurseFormValues) => void;
  updateNurse: (id: number, values: editNurseFormValues) => void;
  resetPassword: (id: number) => void;
  toggleStatus: (id: number) => void;
  deleteNurse: (id: number) => void;
}

const PAGE_SIZE = 7;

export const useNurseAccounts = (): useNurseAccountsReturn => {
  const [accounts, setAccounts] = useState<NurseAccount[]>(mockNurseAccounts);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<statusFilter>('all');
  const [wardFilter, setWardFilter] = useState('all');
  const [sortOption, setSortOption] = useState<sortOption>('newest');
  const [page, setPage] = useState(1);
  const [modalMode, setModalMode] = useState<nurseModalMode>(null);
  const [selectedNurse, setSelectedNurse] = useState<NurseAccount | null>(null);

  const resetPage = (): void => setPage(1);

  const handleSetSearch = (v: string): void => { setSearch(v); resetPage(); };
  const handleSetStatus = (v: statusFilter): void => { setStatusFilter(v); resetPage(); };
  const handleSetWard = (v: string): void => { setWardFilter(v); resetPage(); };
  const handleSetSort = (v: sortOption): void => { setSortOption(v); resetPage(); };

  const allWards = useMemo(
    () => [...new Set(accounts.map((a) => a.assigned_ward))].sort(),
    [accounts]
  );

  const filtered = useMemo(() => {
    let result = [...accounts];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (n) =>
          n.username.toLowerCase().includes(q) ||
          n.full_name.toLowerCase().includes(q) ||
          n.email.toLowerCase().includes(q) ||
          n.license_number.toLowerCase().includes(q)
      );
    }

    if (statusFilter === 'active') result = result.filter((n) => n.is_active);
    if (statusFilter === 'inactive') result = result.filter((n) => !n.is_active);

    if (wardFilter !== 'all') result = result.filter((n) => n.assigned_ward === wardFilter);

    result.sort((a, b) => {
      if (sortOption === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortOption === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return a.full_name.localeCompare(b.full_name);
    });

    return result;
  }, [accounts, search, statusFilter, wardFilter, sortOption]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openModal = (mode: NonNullable<nurseModalMode>, nurse?: NurseAccount): void => {
    setSelectedNurse(nurse ?? null);
    setModalMode(mode);
  };

  const closeModal = (): void => {
    setModalMode(null);
    setSelectedNurse(null);
  };

  const createNurse = (values: addNurseFormValues): void => {
    const newNurse: NurseAccount = {
      nurse_id: Math.max(...accounts.map((n) => n.nurse_id)) + 1,
      user_id: Math.max(...accounts.map((n) => n.user_id)) + 1,
      username: values.username,
      full_name: values.full_name,
      assigned_ward: values.assigned_ward,
      license_number: values.license_number,
      email: values.email,
      contact_number: values.contact_number,
      is_active: values.is_active,
      created_at: new Date().toISOString().split('T')[0],
      patients_monitored_today: 0,
      recent_vital_logs: 0,
      last_login: 'Never',
    };
    setAccounts((prev) => [newNurse, ...prev]);
  };

  const updateNurse = (id: number, values: editNurseFormValues): void => {
    setAccounts((prev) =>
      prev.map((n) => (n.nurse_id === id ? { ...n, ...values } : n))
    );
  };

  const resetPassword = (_id: number): void => { /* no-op — toast handled by caller */ };

  const toggleStatus = (id: number): void => {
    setAccounts((prev) =>
      prev.map((n) => (n.nurse_id === id ? { ...n, is_active: !n.is_active } : n))
    );
  };

  const deleteNurse = (id: number): void => {
    setAccounts((prev) => prev.filter((n) => n.nurse_id !== id));
  };

  return {
    filtered: paginated,
    allFilteredCount: filtered.length,
    totalCount: accounts.length,
    activeCount: accounts.filter((n) => n.is_active).length,
    inactiveCount: accounts.filter((n) => !n.is_active).length,
    wardCount: new Set(accounts.map((n) => n.assigned_ward)).size,
    page,
    pageSize: PAGE_SIZE,
    totalPages,
    setPage,
    search,
    setSearch: handleSetSearch,
    statusFilter,
    setStatusFilter: handleSetStatus,
    wardFilter,
    setWardFilter: handleSetWard,
    sortOption,
    setSortOption: handleSetSort,
    allWards,
    modalMode,
    selectedNurse,
    openModal,
    closeModal,
    createNurse,
    updateNurse,
    resetPassword,
    toggleStatus,
    deleteNurse,
  };
};
