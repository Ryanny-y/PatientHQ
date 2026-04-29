import { useState } from "react";
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
  // UI state only
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<statusFilter>("all");
  const [wardFilter, setWardFilter] = useState("all");
  const [sortOption, setSortOption] = useState<sortOption>("newest");
  const [page, setPage] = useState(1);
  const [modalMode, setModalMode] = useState<nurseModalMode>(null);
  const [selectedNurse, setSelectedNurse] = useState<NurseAccount | null>(null);

  // server state
  const { data, refetch } = useNurseQuery({
    page: page - 1,
    size: PAGE_SIZE,
    search,
    isActive: statusFilter === "all" ? undefined : statusFilter === "active",
    assignedWard: wardFilter === "all" ? undefined : wardFilter,
    sort:
      sortOption === "newest"
        ? "user.createdAt,desc"
        : sortOption === "oldest"
          ? "user.createdAt,asc"
          : "fullName,asc",
  });
  const mutations = useNurseMutation();

  const accounts = data?.data?.content ?? [];
  const totalPages = data?.data?.totalPages ?? 1;
  const totalCount = data?.data?.totalElements ?? 0;

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
    data: accounts,
    totalCount,
    totalPages,

    activeCount: accounts.filter((n) => n.isActive).length ?? 0,
    inactiveCount: accounts.filter((n) => !n.isActive).length ?? 0,
    wardCount: new Set(
      accounts.map((n) => n.assignedWard),
    ).size,

    refetch,

    // pagination
    page,
    pageSize: PAGE_SIZE,
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

    allWards: [], // Will be populated from server if needed

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