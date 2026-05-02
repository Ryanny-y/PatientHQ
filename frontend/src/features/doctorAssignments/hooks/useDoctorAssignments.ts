import { useState } from 'react';
import { useDoctorAssignmentQuery } from './useDoctorAssignmentQuery';
import type {
  assignmentSortOption,
  assignmentStatusFilter,
  DoctorAssignment,
} from '../types/assignment';

type modalMode = 'view' | 'reassign' | 'remove' | null;

const PAGE_SIZE = 10;

export const useDoctorAssignments = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<assignmentStatusFilter>('all');
  const [patientStatusFilter, setPatientStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<assignmentSortOption>('newest');
  const [modalMode, setModalMode] = useState<modalMode>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<DoctorAssignment | null>(null);

  const isActive = statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : undefined;

  const sort =
    sortBy === 'newest' ? 'assignedDate,desc' :
    sortBy === 'oldest' ? 'assignedDate,asc' :
    sortBy === 'patient-asc' ? 'patient.fullName,asc' :
    'doctor.fullName,asc';

  const { data: response, isLoading, refetch } = useDoctorAssignmentQuery({
    page: page - 1,
    size: PAGE_SIZE,
    search: searchQuery,
    isActive,
    patientStatus: patientStatusFilter !== 'all' ? patientStatusFilter : undefined,
    sort,
  });

  const data = response?.data?.content ?? [];

  const totalPages = response?.data?.totalPages ?? 1;

  const handleSetPage = (v: number) => setPage(v);

  const handleSetSearch = (v: string) => { setSearchQuery(v); setPage(1); };
  const handleSetStatus = (v: assignmentStatusFilter) => { setStatusFilter(v); setPage(1); };
  const handleSetPatientStatus = (v: string) => { setPatientStatusFilter(v); setPage(1); };
  const handleSetSort = (v: assignmentSortOption) => { setSortBy(v); setPage(1); };

  const openModal = (mode: NonNullable<modalMode>, assignment?: DoctorAssignment) => {
    setSelectedAssignment(assignment ?? null);
    setModalMode(mode);
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedAssignment(null);
  };

  return {
    data,
    isLoading,
    page,
    totalPages,
    setPage: handleSetPage,
    refetch,
    searchQuery,
    setSearchQuery: handleSetSearch,
    statusFilter,
    setStatusFilter: handleSetStatus,
    patientStatusFilter,
    setPatientStatusFilter: handleSetPatientStatus,
    sortBy,
    setSortBy: handleSetSort,
    modalMode,
    selectedAssignment,
    openModal,
    closeModal,
  };
};
