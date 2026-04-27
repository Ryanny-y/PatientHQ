import { useState, useMemo } from "react";
import { mockAdminAccounts } from "@/features/adminAccounts/utils/mockAdminData";
import type {
  AdminAccount,
  modalMode,
  statusFilter,
  sortOption,
  addAdminFormValues,
  editAdminFormValues,
} from "@/features/adminAccounts/types/adminAccount";
import useFetchData from "@/shared/hooks/useFetchData";
import type { ApiResponse } from "@/shared/types/api";

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
  const { data, loading, error } = useFetchData<ApiResponse<AdminAccount[]>>("admins");
  const accounts = data?.data ?? [];
  console.log(accounts);
  
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<statusFilter>("all");
  const [sortOption, setSortOption] = useState<sortOption>("newest");
  const [page, setPage] = useState(1);
  const [modalMode, setModalMode] = useState<modalMode>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminAccount | null>(null);

  // Reset to page 1 whenever filters change
  const handleSetSearch = (v: string): void => {
    setSearch(v);
    setPage(1);
  };
  const handleSetStatus = (v: statusFilter): void => {
    setStatusFilter(v);
    setPage(1);
  };
  const handleSetSort = (v: sortOption): void => {
    setSortOption(v);
    setPage(1);
  };

  const filtered = useMemo(() => {
    let result = [...accounts];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.username.toLowerCase().includes(q) ||
          a.fullName.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q),
      );
    }

    if (statusFilter === "active") result = result.filter((a) => a.isActive);
    if (statusFilter === "inactive")
      result = result.filter((a) => !a.isActive);

    result.sort((a, b) => {
      if (sortOption === "newest")
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      if (sortOption === "oldest")
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      return a.fullName.localeCompare(b.fullName);
    });

    return result;
  }, [accounts, search, statusFilter, sortOption]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openModal = (
    mode: NonNullable<modalMode>,
    admin?: AdminAccount,
  ): void => {
    setSelectedAdmin(admin ?? null);
    setModalMode(mode);
  };

  const closeModal = (): void => {
    setModalMode(null);
    setSelectedAdmin(null);
  };

  const createAdmin = (values: addAdminFormValues): void => {
    const newAdmin: AdminAccount = {
      adminId: Math.max(...accounts.map((a) => a.adminId)) + 1,
      userId: Math.max(...accounts.map((a) => a.userId)) + 1,
      username: values.username,
      fullName: values.fullName,
      email: values.email,
      contactNumber: values.contactNumber,
      isActive: values.isActive,
      createdAt: new Date().toISOString().split("T")[0],
      last_login: "Never",
      // password_last_reset: new Date().toISOString().split("T")[0],
    };
    // setAccounts((prev) => [newAdmin, ...prev]);
  };

  const updateAdmin = (id: number, values: editAdminFormValues): void => {
    // setAccounts((prev) =>
    //   prev.map((a) =>
    //     a.adminId === id
    //       ? {
    //           ...a,
    //           username: values.username,
    //           fullName: values.fullName,
    //           email: values.email,
    //           contactNumber: values.contactNumber,
    //           isActive: values.isActive,
    //         }
    //       : a,
    //   ),
    // );
  };

  const resetPassword = (_id: number): void => {
    // In real app: call API. Here just a no-op with toast handled by caller.
  };

  const toggleStatus = (id: number): void => {
    // setAccounts((prev) =>
    //   prev.map((a) =>
    //     a.adminId === id ? { ...a, isActive: !a.isActive } : a,
    //   ),
    // );
  };

  const deleteAdmin = (id: number): void => {
    // setAccounts((prev) => prev.filter((a) => a.adminId !== id));
  };

  return {
    filtered: paginated,
    allFilteredCount: filtered.length,
    totalCount: accounts.length,
    activeCount: accounts.filter((a) => a.isActive).length,
    inactiveCount: accounts.filter((a) => !a.isActive).length,
    recentCount: accounts.filter((a) => isRecent(a.createdAt)).length,
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
