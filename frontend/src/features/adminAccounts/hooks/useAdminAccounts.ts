import { useState } from "react";
import type {
  AdminAccount,
  modalMode,
  statusFilter,
  sortOption,
} from "../types/adminAccount";

import { useAdminMetaQuery, useAdminsQuery } from "./useAdminsQuery";
import { useAdminMutations } from "./useAdminMutation";

const PAGE_SIZE = 6;

export const useAdminAccounts = () => {
  // UI state only
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<statusFilter>("all");
  const [sortOption, setSortOption] = useState<sortOption>("newest");
  const [page, setPage] = useState(1);
  const [modalMode, setModalMode] = useState<modalMode>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminAccount | null>(null);

  // server state
  const { data, refetch } = useAdminsQuery({
    page: page - 1,
    size: PAGE_SIZE,
    search,
    isActive: statusFilter === "all" ? undefined : statusFilter === "active",
    sort:
      sortOption === "newest"
        ? "user.createdAt,desc"
        : sortOption === "oldest"
          ? "user.createdAt,asc"  
          : "fullName,asc",
  });
  const { data: metaData } = useAdminMetaQuery();
  const mutations = useAdminMutations();

  const accounts = data?.data?.content ?? [];
  const totalPages = data?.data?.totalPages ?? 1;
  const totalCount = metaData?.data?.totalAdmins ?? 0;

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
    metaData: metaData?.data,
    data: accounts,
    totalCount,
    totalPages,

    // pagination
    page,
    pageSize: PAGE_SIZE,
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
    refetch,
  };
};