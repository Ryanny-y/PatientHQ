import { useState, useMemo } from "react";
import type {
  AdminAccount,
  modalMode,
  statusFilter,
  sortOption,
} from "../types/adminAccount";

import { useAdminsQuery } from "./useAdminsQuery";
import { useAdminMutations } from "./useAdminMutation";

const PAGE_SIZE = 6;

const isRecent = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  return diff < 30 * 24 * 60 * 60 * 1000;
};

export const useAdminAccounts = () => {
  // server state
  const { data: accounts = [] } = useAdminsQuery();
  const mutations = useAdminMutations();

  // UI state only
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<statusFilter>("all");
  const [sortOption, setSortOption] =
    useState<sortOption>("newest");
  const [page, setPage] = useState(1);

  const [modalMode, setModalMode] =
    useState<modalMode>(null);

  const [selectedAdmin, setSelectedAdmin] =
    useState<AdminAccount | null>(null);

  // reset page helpers
  const handleSetSearch = (v: string) => {
    setSearch(v);
    setPage(1);
  };

  const handleSetStatus = (v: statusFilter) => {
    setStatusFilter(v);
    setPage(1);
  };

  const handleSetSort = (v: sortOption) => {
    setSortOption(v);
    setPage(1);
  };

  // 🔥 FILTER LOGIC (unchanged)
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

    if (statusFilter === "active")
      result = result.filter((a) => a.isActive);

    if (statusFilter === "inactive")
      result = result.filter((a) => !a.isActive);

    result.sort((a, b) => {
      if (sortOption === "newest")
        return (
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
        );

      if (sortOption === "oldest")
        return (
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
        );

      return a.fullName.localeCompare(b.fullName);
    });

    return result;
  }, [accounts, search, statusFilter, sortOption]);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE),
  );

  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  // modal
  const openModal = (mode: NonNullable<modalMode>, admin?: AdminAccount) => {
    setSelectedAdmin(admin ?? null);
    setModalMode(mode);
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedAdmin(null);
  };

  return {
    // data
    filtered: paginated,
    allFilteredCount: filtered.length,
    totalCount: accounts.length,
    activeCount: accounts.filter((a) => a.isActive).length,
    inactiveCount: accounts.filter((a) => !a.isActive).length,
    recentCount: accounts.filter((a) =>
      isRecent(a.createdAt),
    ).length,

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
    sortOption,
    setSortOption: handleSetSort,

    // modal
    modalMode,
    selectedAdmin,
    openModal,
    closeModal,

    // mutations
    createAdmin: mutations.createAdmin.mutateAsync,
    updateAdmin: mutations.updateAdmin.mutateAsync,
    deleteAdmin: mutations.deleteAdmin.mutateAsync,
    toggleStatus: mutations.toggleStatus.mutateAsync,
    resetPassword: mutations.resetPassword.mutateAsync,
  };
};