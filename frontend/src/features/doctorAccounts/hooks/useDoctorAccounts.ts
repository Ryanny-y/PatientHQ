import { useState } from "react";
import type {
  DoctorAccount,
  doctorModalMode,
  statusFilter,
  sortOption,
} from "@/features/doctorAccounts/types/doctorAccount";

import { useDoctorsQuery } from "./useDoctorsQuery";
import { useDoctorMutations } from "./useDoctorMutation";

const PAGE_SIZE = 10;

export const useDoctorAccounts = () => {
  // UI state only
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<statusFilter>("all");
  const [sortOption, setSortOption] = useState<sortOption>("newest");
  const [page, setPage] = useState(1);
  const [modalMode, setModalMode] = useState<doctorModalMode>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorAccount | null>(
    null,
  );

  // server state
  const { data, refetch } = useDoctorsQuery({
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
  const mutations = useDoctorMutations();

  const accounts = data?.data?.content ?? [];
  const totalPages = data?.data?.totalPages ?? 1;
  const totalCount = data?.data?.totalElements ?? 0;

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
  const openModal = (
    mode: NonNullable<doctorModalMode>,
    doctor?: DoctorAccount,
  ) => {
    setSelectedDoctor(doctor ?? null);
    setModalMode(mode);
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedDoctor(null);
  };

  return {
    // data
    data: accounts,
    totalCount,
    totalPages,

    activeCount: accounts.filter((d) => d.isActive).length ?? 0,
    inactiveCount: accounts.filter((d) => !d.isActive).length ?? 0,
    specializationCount: new Set(
      data?.data.content.map((d) => d.specialization),
    ).size,

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
    selectedDoctor,
    openModal,
    closeModal,

    // mutations
    createDoctor: mutations.createDoctor.mutateAsync,
    updateDoctor: mutations.updateDoctor.mutateAsync,
    deleteDoctor: mutations.deleteDoctor.mutateAsync,
    toggleStatus: mutations.toggleStatus.mutateAsync,
    resetPassword: mutations.resetPassword.mutateAsync,
    refetch,
  };
};
