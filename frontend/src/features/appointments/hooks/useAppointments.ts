import { useState } from 'react';
import { useAppointmentQuery } from './useAppointmentQuery';
import { useAppointmentMutation } from './useAppointmentMutation';
import type {
  Appointment,
  AppointmentFilters,
  AppointmentModalMode,
  CreateAppointmentFormValues,
  UpdateAppointmentFormValues,
} from '../types/appointment';

const PAGE_SIZE = 10;

interface UseAppointmentsReturn {
  data: Appointment[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  totalElements: number;
  setPage: (page: number) => void;
  refetch: () => void;
  filters: AppointmentFilters;
  setSearch: (v: string) => void;
  setStatus: (v: string) => void;
  setSortBy: (v: AppointmentFilters['sortBy']) => void;
  modalMode: AppointmentModalMode;
  selectedAppointment: Appointment | null;
  openModal: (mode: NonNullable<AppointmentModalMode>, appointment?: Appointment) => void;
  closeModal: () => void;
  createAppointment: (values: CreateAppointmentFormValues) => Promise<void>;
  updateAppointment: (id: string, values: UpdateAppointmentFormValues) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
}

export const useAppointments = (): UseAppointmentsReturn => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<AppointmentFilters>({
    search: '',
    status: 'all',
    sortBy: 'nearest',
  });
  const [modalMode, setModalMode] = useState<AppointmentModalMode>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const sort =
    filters.sortBy === 'nearest' ? 'appointmentDate,asc' :
    filters.sortBy === 'latest' ? 'appointmentDate,desc' :
    'patientName,asc';

  const { data: response, isLoading, refetch } = useAppointmentQuery({
    page: page - 1,
    size: PAGE_SIZE,
    search: filters.search || undefined,
    status: filters.status !== 'all' ? filters.status : undefined,
    sort,
  });

  const mutations = useAppointmentMutation();

  const data = response?.data?.content ?? [];
  const totalPages = response?.data?.totalPages ?? 1;
  const totalElements = response?.data?.totalElements ?? 0;

  const setSearch = (v: string) => { setFilters((f) => ({ ...f, search: v })); setPage(1); };
  const setStatus = (v: string) => { setFilters((f) => ({ ...f, status: v })); setPage(1); };
  const setSortBy = (v: AppointmentFilters['sortBy']) => { setFilters((f) => ({ ...f, sortBy: v })); setPage(1); };

  const openModal = (mode: NonNullable<AppointmentModalMode>, appointment?: Appointment) => {
    setSelectedAppointment(appointment ?? null);
    setModalMode(mode);
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedAppointment(null);
  };

  const createAppointment = async (values: CreateAppointmentFormValues): Promise<void> => {
    await mutations.createAppointment.mutateAsync(values);
  };

  const updateAppointment = async (id: string, values: UpdateAppointmentFormValues): Promise<void> => {
    await mutations.updateAppointment.mutateAsync({ id, values });
  };

  const deleteAppointment = async (id: string): Promise<void> => {
    await mutations.deleteAppointment.mutateAsync(id);
  };

  return {
    data,
    isLoading,
    page,
    totalPages,
    totalElements,
    setPage,
    refetch,
    filters,
    setSearch,
    setStatus,
    setSortBy,
    modalMode,
    selectedAppointment,
    openModal,
    closeModal,
    createAppointment,
    updateAppointment,
    deleteAppointment,
  };
};
