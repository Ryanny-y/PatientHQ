import { useState } from 'react';
import { useDoctorAssignmentQuery } from './useDoctorAssignmentQuery';
import type {
  assignmentSortOption,
  assignmentStatusFilter,
  DoctorAssignment,
} from '../types/assignment';

type modalMode = 'view' | 'reassign' | 'remove' | null;

const PAGE_SIZE = 10;

interface useDoctorAssignmentsReturn {
  data: DoctorAssignment[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
  refetch: () => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  statusFilter: assignmentStatusFilter;
  setStatusFilter: (v: assignmentStatusFilter) => void;
  specializationFilter: string;
  setSpecializationFilter: (v: string) => void;
  patientStatusFilter: string;
  setPatientStatusFilter: (v: string) => void;
  sortBy: assignmentSortOption;
  setSortBy: (v: assignmentSortOption) => void;
  modalMode: modalMode;
  selectedAssignment: DoctorAssignment | null;
  openModal: (mode: NonNullable<modalMode>, assignment?: DoctorAssignment) => void;
  closeModal: () => void;
}

export const useDoctorAssignments = (): useDoctorAssignmentsReturn => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<assignmentStatusFilter>('all');
  const [specializationFilter, setSpecializationFilter] = useState('all');
  const [patientStatusFilter, setPatientStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<assignmentSortOption>('newest');
  const [modalMode, setModalMode] = useState<modalMode>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<DoctorAssignment | null>(null);

  const activeOnly = statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : undefined;

  const sort =
    sortBy === 'newest' ? 'assignedDate,desc' :
    sortBy === 'oldest' ? 'assignedDate,asc' :
    sortBy === 'patient-asc' ? 'patientName,asc' :
    'doctorName,asc';

  const { data: response, isLoading, refetch } = useDoctorAssignmentQuery({
    page: page - 1,
    size: PAGE_SIZE,
    activeOnly,
    sort,
  });

  const rawData = response?.data?.content ?? [];

  // Client-side filtering for search, specialization, and patient status
  // (backend doesn't expose these as query params yet)
  const data = rawData.filter((a) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !a.patientName.toLowerCase().includes(q) &&
        !a.doctorName.toLowerCase().includes(q) &&
        !a.assignmentId.toLowerCase().includes(q)
      ) return false;
    }
    if (specializationFilter !== 'all' && a.doctorSpecialization !== specializationFilter) return false;
    if (patientStatusFilter !== 'all' && a.patientStatus !== patientStatusFilter) return false;
    return true;
  });

  const totalPages = response?.data?.totalPages ?? 1;

  const handleSetPage = (v: number) => setPage(v);

  const handleSetSearch = (v: string) => { setSearchQuery(v); setPage(1); };
  const handleSetStatus = (v: assignmentStatusFilter) => { setStatusFilter(v); setPage(1); };
  const handleSetSpecialization = (v: string) => { setSpecializationFilter(v); setPage(1); };
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
    specializationFilter,
    setSpecializationFilter: handleSetSpecialization,
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
