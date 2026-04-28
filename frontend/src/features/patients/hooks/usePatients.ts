import { useMemo, useState } from "react";
import { usePatientMutation } from "./usePatientMutation";
import { usePatientQuery } from "./usePatientQuery";
import type {
  Patient,
  patientModalMode,
  sortOption,
  statusFilter,
} from "../types/patient";

const PAGE_SIZE = 7;

export const usePatients = () => {
  const { data: accounts = [], refetch } = usePatientQuery();
  const mutations = usePatientMutation();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<statusFilter>("all");
  const [sortOption, setSortOption] = useState<sortOption>("newest");
  const [page, setPage] = useState(1);
  const [modalMode, setModalMode] = useState<patientModalMode>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

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

  // 🔥 FILTER LOGIC
  const filtered = useMemo(() => {
    let result = [...accounts];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (d) =>
          d.fullName.toLowerCase().includes(q) ||
          (d.email?.toLowerCase().includes(q) ?? false)
      );
    }

    if (statusFilter === "active") result = result.filter((d) => d.status === "ACTIVE");
    if (statusFilter === "inactive") result = result.filter((d) => d.status !== "INACTIVE");
    if (statusFilter === "admitted") result = result.filter((d) => d.status === "ADMITTED");
    if (statusFilter === "discharged") result = result.filter((d) => d.status === "DISCHARGED");

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

  // modal
  const openModal = (
    mode: NonNullable<patientModalMode>,
    patient?: Patient,
  ) => {
    setSelectedPatient(patient ?? null);
    setModalMode(mode);
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedPatient(null);
  };

  return {
    // data
    filtered: paginated,
    allFilteredCount: filtered.length,
    totalCount: accounts.length,
    activeCount: accounts.filter((d) => d.status === "ACTIVE").length,
    inactiveCount: accounts.filter((d) => d.status === "INACTIVE").length,

    // pagination
    page,
    pageSize: PAGE_SIZE,
    totalPages,
    setPage,

    refetch,

    // filters
    search,
    setSearch: handleSetSearch,
    statusFilter,
    setStatusFilter: handleSetStatus,
    sortOption,
    setSortOption: handleSetSort,

    // modal
    modalMode,
    selectedPatient,
    openModal,
    closeModal,

    // mutations
    createPatient: mutations.createPatient.mutateAsync,
    updatePatient: mutations.updatePatient.mutateAsync,
    deletePatient: mutations.deletePatient.mutateAsync,
  };
};
