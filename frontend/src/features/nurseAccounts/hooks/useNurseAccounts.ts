import { useState, useMemo } from "react";
import type {
  NurseAccount,
  nurseModalMode,
  statusFilter,
  sortOption,
} from "@/features/nurseAccounts/types/nurseAccount";

import { useNurseQuery } from "./useNurseQuery";
import { useNurseMutation } from "./useNurseMutation";

const PAGE_SIZE = 7;

export const useNurseAccounts = () => {
  // server state
  const { data: accounts = [], refetch } = useNurseQuery();
  const mutations = useNurseMutation();

  // UI state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<statusFilter>("all");
  const [wardFilter, setWardFilter] = useState("all");
  const [sortOption, setSortOption] =
    useState<sortOption>("newest");
  const [page, setPage] = useState(1);

  const [modalMode, setModalMode] =
    useState<nurseModalMode>(null);

  const [selectedNurse, setSelectedNurse] =
    useState<NurseAccount | null>(null);

  const resetPage = () => setPage(1);

  // setters
  const handleSetSearch = (v: string) => {
    setSearch(v);
    resetPage();
  };

  const handleSetStatus = (v: statusFilter) => {
    setStatusFilter(v);
    resetPage();
  };

  const handleSetWard = (v: string) => {
    setWardFilter(v);
    resetPage();
  };

  const handleSetSort = (v: sortOption) => {
    setSortOption(v);
    resetPage();
  };

  // wards
  const allWards = useMemo(
    () =>
      [...new Set(accounts.map((a) => a.assignedWard))].sort(),
    [accounts],
  );

  // filtering
  const filtered = useMemo(() => {
    let result = [...accounts];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (n) =>
          n.username.toLowerCase().includes(q) ||
          n.fullName.toLowerCase().includes(q) ||
          n.email.toLowerCase().includes(q) ||
          n.licenseNumber.toLowerCase().includes(q),
      );
    }

    if (statusFilter === "active")
      result = result.filter((n) => n.isActive);

    if (statusFilter === "inactive")
      result = result.filter((n) => !n.isActive);

    if (wardFilter !== "all") {
      result = result.filter(
        (n) => n.assignedWard === wardFilter,
      );
    }

    result.sort((a, b) => {
      if (sortOption === "newest")
        return (
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
        );

      if (sortOption === "oldest")
        return (
          new Date(a.created_at).getTime() -
          new Date(b.created_at).getTime()
        );

      return a.fullName.localeCompare(b.fullName);
    });

    return result;
  }, [accounts, search, statusFilter, wardFilter, sortOption]);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE),
  );

  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  // modal
  const openModal = (
    mode: NonNullable<nurseModalMode>,
    nurse?: NurseAccount,
  ) => {
    setSelectedNurse(nurse ?? null);
    setModalMode(mode);
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedNurse(null);
  };

  return {
    // data
    filtered: paginated,
    allFilteredCount: filtered.length,
    totalCount: accounts.length,
    activeCount: accounts.filter((n) => n.isActive).length,
    inactiveCount: accounts.filter((n) => !n.isActive).length,
    wardCount: new Set(
      accounts.map((n) => n.assignedWard),
    ).size,

    refetch,

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
    wardFilter,
    setWardFilter: handleSetWard,
    sortOption,
    setSortOption: handleSetSort,
    
    allWards,

    // modal
    modalMode,
    selectedNurse,
    openModal,
    closeModal,

    // mutations
    createNurse: mutations.createNurse.mutateAsync,
    updateNurse: mutations.updateNurse.mutateAsync,
    deleteNurse: mutations.deleteNurse.mutateAsync,
    toggleStatus: mutations.toggleStatus.mutateAsync,
    resetPassword: mutations.resetPassword.mutateAsync,
  };
};