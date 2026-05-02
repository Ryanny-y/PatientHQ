import { useState } from "react";
import { usePatientMutation } from "./usePatientMutation";
import { usePatientMetaQuery, usePatientQuery } from "./usePatientQuery";
import type {
  isAssigned,
  Patient,
  patientModalMode,
  sortOption,
  statusFilter,
} from "../types/patient";

const PAGE_SIZE = 7;

export const usePatients = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<statusFilter>("all");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [bloodTypeFilter, setBloodTypeFilter] = useState<string>("all");
  const [sortOption, setSortOption] = useState<sortOption>("newest");
  const [isAssigned, setIsAssigned] = useState<isAssigned>("all");
  const [page, setPage] = useState(1);
  const [modalMode, setModalMode] = useState<patientModalMode>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const { data, refetch } = usePatientQuery({
    page: page - 1,
    size: PAGE_SIZE,
    search,
    status:
      statusFilter === "all" ? undefined : statusFilter.toLowerCase(),
    gender: genderFilter === "all" ? undefined : genderFilter,
    bloodType: bloodTypeFilter === "all" ? undefined : bloodTypeFilter,
    assigned: isAssigned === "all" ? undefined : isAssigned === "assigned",
    sort:
      sortOption === "newest"
        ? "createdAt,desc"
        : sortOption === "oldest"
          ? "createdAt,asc"
          : sortOption === "name-az"
            ? "fullName,asc"
            : "fullName,desc",
  });
  const { data: metaData } = usePatientMetaQuery();
  const mutations = usePatientMutation();

  const accounts = data?.data?.content ?? [];
  const totalPages = data?.data?.totalPages ?? 1;

  // reset page helpers
  const handleSetSearch = (v: string) => {
    setSearch(v);
    setPage(1);
  };

  const handleSetStatus = (v: statusFilter) => {
    setStatusFilter(v);
    setPage(1);
  };

  const handleSetGender = (v: string) => {
    setGenderFilter(v);
    setPage(1);
  };

  const handleSetBloodType = (v: string) => {
    setBloodTypeFilter(v);
    setPage(1);
  };

  const handleSetSort = (v: sortOption) => {
    setSortOption(v);
    setPage(1);
  };

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
    metaData: metaData?.data,
    data: accounts,

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
    genderFilter,
    setGenderFilter: handleSetGender,
    bloodTypeFilter,
    setBloodTypeFilter: handleSetBloodType,
    isAssigned,
    setIsAssigned,
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
