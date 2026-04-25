import { useState, useMemo } from 'react';
import { mockAdminAccounts } from '@/features/adminAccounts/utils/mockAdminData';
import type {
  AdminAccount,
  modalMode,
  statusFilter,
  sortOption,
  addAdminFormValues,
  editAdminFormValues,
} from '@/features/adminAccounts/types/adminAccount';

interface useAdminAccountsReturn {
  // data
  filtered: AdminAccount[];
  allFilteredCount: number;
  totalCount: number;
  activeCount: number;
  inactiveCount: number;
  recentCount: number;
  // pagination
  page: number;
  pageSize: number;
  totalPages: number;
  setPage: (p: number) => void;
  // filters
  search: string;
  setSearch: (v: string) => void;
  statusFilter: statusFilter;
  setStatusFilter: (v: statusFilter) => void;
  sortOption: sortOption;
  setSortOption: (v: sortOption) => void;
  // modal
  modalMode: modalMode;
  selectedAdmin: AdminAccount | null;
  openModal: (mode: NonNullable<modalMode>, admin?: AdminAccount) => void;
  closeModal: () => void;
  // actions
  createAdmin: (values: addAdminFormValues) => void;
  updateAdmin: (id: number, values: editAdminFormValues) => void;
  resetPassword: (id: number) => void;
  toggleStatus: (id: number) => void;
  deleteAdmin: (id: number) => void;
}

const PAGE_SIZE = 6;

// Admins created within the last 30 days count as "recently added"
const isRecent = (dateStr: string): boolean => {
  const diff = Date.now() - new Date(dateStr).getTime();
  return diff < 30 * 24 * 60 * 60 * 1000;
};

export const useAdminAccounts = (): useAdminAccountsReturn => {
  const [accounts, setAccounts] = useState<AdminAccount[]>(mockAdminAccounts);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<statusFilter>('all');
  const [sortOption, setSortOption] = useState<sortOption>('newest');
  const [page, setPage] = useState(1);
  const [modalMode, setModalMode] = useState<modalMode>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminAccount | null>(null);

  // Reset to page 1 whenever filters change
  const handleSetSearch = (v: string): void => { setSearch(v); setPage(1); };
  const handleSetStatus = (v: statusFilter): void => { setStatusFilter(v); setPage(1); };
  const handleSetSort = (v: sortOption): void => { setSortOption(v); setPage(1); };

  const filtered = useMemo(() => {
    let result = [...accounts];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.username.toLowerCase().includes(q) ||
          a.full_name.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q)
      );
    }

    if (statusFilter === 'active') result = result.filter((a) => a.is_active);
    if (statusFilter === 'inactive') result = result.filter((a) => !a.is_active);

    result.sort((a, b) => {
      if (sortOption === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortOption === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return a.full_name.localeCompare(b.full_name);
    });

    return result;
  }, [accounts, search, statusFilter, sortOption]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openModal = (mode: NonNullable<modalMode>, admin?: AdminAccount): void => {
    setSelectedAdmin(admin ?? null);
    setModalMode(mode);
  };

  const closeModal = (): void => {
    setModalMode(null);
    setSelectedAdmin(null);
  };

  const createAdmin = (values: addAdminFormValues): void => {
    const newAdmin: AdminAccount = {
      admin_id: Math.max(...accounts.map((a) => a.admin_id)) + 1,
      user_id: Math.max(...accounts.map((a) => a.user_id)) + 1,
      username: values.username,
      full_name: values.full_name,
      email: values.email,
      contact_number: values.contact_number,
      is_active: values.is_active,
      created_at: new Date().toISOString().split('T')[0],
      last_login: 'Never',
      password_last_reset: new Date().toISOString().split('T')[0],
    };
    setAccounts((prev) => [newAdmin, ...prev]);
  };

  const updateAdmin = (id: number, values: editAdminFormValues): void => {
    setAccounts((prev) =>
      prev.map((a) =>
        a.admin_id === id
          ? { ...a, username: values.username, full_name: values.full_name, email: values.email, contact_number: values.contact_number, is_active: values.is_active }
          : a
      )
    );
  };

  const resetPassword = (_id: number): void => {
    // In real app: call API. Here just a no-op with toast handled by caller.
  };

  const toggleStatus = (id: number): void => {
    setAccounts((prev) =>
      prev.map((a) => (a.admin_id === id ? { ...a, is_active: !a.is_active } : a))
    );
  };

  const deleteAdmin = (id: number): void => {
    setAccounts((prev) => prev.filter((a) => a.admin_id !== id));
  };

  return {
    filtered: paginated,
    allFilteredCount: filtered.length,
    totalCount: accounts.length,
    activeCount: accounts.filter((a) => a.is_active).length,
    inactiveCount: accounts.filter((a) => !a.is_active).length,
    recentCount: accounts.filter((a) => isRecent(a.created_at)).length,
    page,
    pageSize: PAGE_SIZE,
    totalPages,
    setPage,
    search,
    setSearch: handleSetSearch,
    statusFilter,
    setStatusFilter: handleSetStatus,
    sortOption,
    setSortOption: handleSetSort,
    modalMode,
    selectedAdmin,
    openModal,
    closeModal,
    createAdmin,
    updateAdmin,
    resetPassword,
    toggleStatus,
    deleteAdmin,
  };
};
