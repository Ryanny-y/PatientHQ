import { useState, useMemo } from 'react';
import { useAppoinmentMetaQuery, useAppointmentQuery } from './useAppointmentQuery';
import { useAppointmentMutation } from './useAppointmentMutation';
import type {
  Appointment,
  AppointmentModalMode,
  FilterOptions,
  CreateAppointmentFormValues,
  UpdateAppointmentFormValues,
} from '../types/appointment';

const PAGE_SIZE = 10;

export const useAppointments = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    dateRange: { from: null, to: null },
    status: 'all',
    doctor: 'all',
    specialization: 'all',
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
    doctorId: filters.doctor !== 'all' ? filters.doctor : undefined,
    sort,
  });

  const mutations = useAppointmentMutation();
  const { data: meta } = useAppoinmentMetaQuery();

  const pageData = response?.data?.content ?? [];
  const totalPages = response?.data?.totalPages ?? 1;
  const totalElements = response?.data?.totalElements ?? 0;

  // Client-side filtering for dateRange and specialization (not supported by backend)
  const filteredData = useMemo(() => {
    let result = pageData.filter((appointment) => {
      if (filters.dateRange.from || filters.dateRange.to) {
        const aptDate = new Date(appointment.appointmentDate);
        if (filters.dateRange.from && aptDate < filters.dateRange.from) return false;
        if (filters.dateRange.to) {
          const end = new Date(filters.dateRange.to);
          end.setHours(23, 59, 59, 999);
          if (aptDate > end) return false;
        }
      }
      return true;
    });
    if (filters.specialization && filters.specialization !== 'all') {
      result = result.filter((apt) => apt.doctorSpecialization === filters.specialization);
    }
    return result;
  }, [pageData, filters.dateRange, filters.specialization]);

  const updateFilter = <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]): void => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    if (key !== 'dateRange') setPage(1);
  };

  const openModal = (mode: NonNullable<AppointmentModalMode>, appointment?: Appointment): void => {
    setSelectedAppointment(appointment ?? null);
    setModalMode(mode);
  };

  const closeModal = (): void => {
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
    meta,
    data: filteredData,
    isLoading,
    page,
    totalPages,
    totalElements,
    setPage,
    refetch,
    filters,
    updateFilter,
    modalMode,
    selectedAppointment,
    openModal,
    closeModal,
    createAppointment,
    updateAppointment,
    deleteAppointment,
  };
};
