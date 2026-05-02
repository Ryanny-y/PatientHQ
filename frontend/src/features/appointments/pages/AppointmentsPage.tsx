import { useState, useMemo, type ReactElement } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/shared/hooks/useToast";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { useAuth } from "@/shared/context/AuthContext";
import { AppointmentStatsCards } from "../components/AppointmentStatsCards";
import { AppointmentFilterToolbar } from "../components/AppointmentFilterToolbar";
import { AppointmentTable } from "../components/AppointmentTable";
import { AppointmentCardListMobile } from "../components/AppointmentCardListMobile";
import { AppointmentCalendarView } from "../components/AppointmentCalendarView";
import { ViewAppointmentDrawer } from "../components/ViewAppointmentDrawer";
import { AppointmentFormModal } from "../components/AppointmentFormModal";
import { RescheduleAppointmentModal } from "../components/RescheduleAppointmentModal";
import { CancelAppointmentDialog } from "../components/CancelAppointmentDialog";
import { useAppointmentQuery } from "../hooks/useAppointmentQuery";
import { useAppointmentMutation } from "../hooks/useAppointmentMutation";
import { usePatientQuery } from "@/features/patients/hooks/usePatientQuery";
import { useDoctorsQuery } from "@/features/doctorAccounts/hooks/useDoctorsQuery";
import type {
  Appointment,
  FilterOptions,
  AppointmentStats,
  CreateAppointmentFormValues,
  UpdateAppointmentFormValues,
} from "../types/appointment";

const PAGE_SIZE = 10;

const AppointmentsPage = (): ReactElement => {
  const { toast } = useToast();
  const { user } = useAuth();
  const userRole = (user?.role || 'ADMIN').toLowerCase() as 'admin' | 'doctor' | 'nurse';

  // View mode
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');

  // Filters state (mirrors original FilterOptions, but with doctorId as string)
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    dateRange: { from: null, to: null },
    status: "all",
    doctor: "all",
    specialization: "all",
    sortBy: "nearest",
  });

  // Pagination
  const [page, setPage] = useState(1);

  // Modal/drawer state
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Fetch patients for dropdown (all)
  const { data: patientsResponse } = usePatientQuery({ page: 0, size: 1000 });
  const patients = useMemo(() => {
    const raw = patientsResponse?.data?.content ?? [];
    return raw.map((p) => ({
      patientId: String(p.patientId),
      fullName: p.fullName,
      contactNumber: p.contactNumber,
    }));
  }, [patientsResponse]);

  // Fetch doctors for dropdown and filter
  const { data: doctorsResponse } = useDoctorsQuery({ page: 0, size: 1000, isActive: true });
  const doctors = useMemo(() => {
    const raw = doctorsResponse?.data?.content ?? [];
    return raw.map((d) => ({
      doctorId: d.doctorId,
      fullName: d.fullName,
      specialization: d.specialization,
    }));
  }, [doctorsResponse]);

  const specializations = useMemo(() => {
    const specs = doctors.map((d) => d.specialization);
    return Array.from(new Set(specs));
  }, [doctors]);

  // Build server-side sort param
  const sortParam =
    filters.sortBy === 'nearest' ? 'appointmentDate,asc' :
    filters.sortBy === 'latest' ? 'appointmentDate,desc' :
    'patientName,asc';

  // Fetch appointments from server
  const { data: response, isLoading, refetch } = useAppointmentQuery({
    page: page - 1,
    size: PAGE_SIZE,
    search: filters.search || undefined,
    status: filters.status !== 'all' ? filters.status : undefined,
    doctorId: filters.doctor !== 'all' ? filters.doctor : undefined,
    sort: sortParam,
  });

  const mutations = useAppointmentMutation();

  const pageData = response?.data?.content ?? [];
  const totalPages = response?.data?.totalPages ?? 1;
  const totalElements = response?.data?.totalElements ?? 0;

  // Client-side filtering: dateRange and specialization (not supported by backend)
  const filteredAppointments = useMemo(() => {
    let result = pageData.filter((appointment) => {
      // Date range filter
      if (filters.dateRange.from || filters.dateRange.to) {
        const aptDate = new Date(appointment.appointmentDate);
        if (filters.dateRange.from && aptDate < filters.dateRange.from) return false;
        if (filters.dateRange.to) {
          // Set to end of day for inclusive to
          const end = new Date(filters.dateRange.to);
          end.setHours(23, 59, 59, 999);
          if (aptDate > end) return false;
        }
      }
      return true;
    });

    if (filters.specialization && filters.specialization !== 'all') {
      result = result.filter((apt) => apt.specialization === filters.specialization);
    }

    return result;
  }, [pageData, filters.dateRange, filters.specialization]);

  // Compute dummy stats from totalElements only (others require aggregated data)
  const stats: AppointmentStats = {
    totalAppointments: totalElements,
    todayAppointments: 0, // could compute from current page only but inaccurate
    pendingConfirmations: 0,
    completedThisWeek: 0,
  };

  // Event handlers
  const handleRefresh = () => {
    refetch();
    toast("Appointments refreshed successfully.", "success");
  };

  const handleViewAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setViewDrawerOpen(true);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setRescheduleModalOpen(true);
  };

  const handleCreateAppointment = () => {
    setFormModalOpen(true);
  };

  const handleConfirmAppointment = async (appointment: Appointment) => {
    try {
      await mutations.updateAppointment.mutateAsync({
        id: appointment.appointmentId,
        values: { status: 'CONFIRMED' },
      });
      toast("Appointment confirmed.", "success");
    } catch {
      toast("Failed to confirm appointment", "error");
    }
  };

  const handleCompleteAppointment = async (appointment: Appointment) => {
    try {
      await mutations.updateAppointment.mutateAsync({
        id: appointment.appointmentId,
        values: { status: 'COMPLETED' },
      });
      toast("Appointment marked as completed.", "success");
    } catch {
      toast("Failed to update status", "error");
    }
  };

  const handleRescheduleAppointment = async (appointmentId: string, data: Partial<UpdateAppointmentFormValues>) => {
    try {
      await mutations.updateAppointment.mutateAsync({
        id: appointmentId,
        values: {
          appointmentDate: data.appointmentDate,
          reason: data.reason,
          notes: data.notes,
        },
      });
      toast("Appointment rescheduled successfully.", "success");
    } catch {
      toast("Failed to reschedule appointment", "error");
    }
  };

  const handleCancelAppointment = async (appointmentId: string, reason: string) => {
    try {
      await mutations.updateAppointment.mutateAsync({
        id: appointmentId,
        values: { status: 'CANCELLED', notes: reason },
      });
      toast("Appointment cancelled.", "warning");
    } catch {
      toast("Failed to cancel appointment", "error");
    }
  };

  const handleSubmitAppointment = async (values: CreateAppointmentFormValues) => {
    try {
      await mutations.createAppointment.mutateAsync(values);
      toast("Appointment scheduled successfully.", "success");
      setFormModalOpen(false);
    } catch {
      toast("Failed to schedule appointment", "error");
    }
  };

  const updateFilter = <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    // Reset to page 1 for most filters except dateRange maybe
    if (key !== 'dateRange') setPage(1);
  };

  const canCreateAppointments = userRole === "admin" || userRole === "doctor";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Appointments</h1>
          <p className="text-slate-600 mt-1">
            Manage patient schedules, consultations, and physician availability.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setViewMode(viewMode === 'table' ? 'calendar' : 'table')}>
            <CalendarIcon className="h-4 w-4 mr-2" />
            {viewMode === 'table' ? 'Calendar' : 'Table'} View
          </Button>
          {canCreateAppointments && (
            <Button onClick={handleCreateAppointment}>
              <Plus className="h-4 w-4 mr-2" />
              New Appointment
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <AppointmentStatsCards stats={stats} />

      {/* Filter Toolbar - Only show in table view */}
      {viewMode === 'table' && (
        <AppointmentFilterToolbar
          filters={filters}
          onFiltersChange={updateFilter}
          onRefresh={handleRefresh}
          doctors={doctors}
          specializations={specializations}
        />
      )}

      {/* Appointments Display */}
      {isLoading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          Loading appointments...
        </div>
      ) : viewMode === 'table' ? (
        <>
          <div className="hidden lg:block">
            <AppointmentTable
              appointments={filteredAppointments}
              userRole={userRole}
              onViewAppointment={handleViewAppointment}
              onEditAppointment={handleEditAppointment}
              onConfirmAppointment={handleConfirmAppointment}
              onCompleteAppointment={handleCompleteAppointment}
              onRescheduleAppointment={handleEditAppointment}
              onCancelAppointment={(appointment) => {
                setSelectedAppointment(appointment);
                setCancelDialogOpen(true);
              }}
            />
          </div>

          <div className="lg:hidden">
            <AppointmentCardListMobile
              appointments={filteredAppointments}
              userRole={userRole}
              onViewAppointment={handleViewAppointment}
              onEditAppointment={handleEditAppointment}
              onConfirmAppointment={handleConfirmAppointment}
              onCompleteAppointment={handleCompleteAppointment}
              onRescheduleAppointment={handleEditAppointment}
              onCancelAppointment={(appointment) => {
                setSelectedAppointment(appointment);
                setCancelDialogOpen(true);
              }}
            />
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600">
                Showing {filteredAppointments.length} of {totalElements} appointments
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <AppointmentCalendarView
          appointments={filteredAppointments}
          onViewAppointment={handleViewAppointment}
        />
      )}

      {/* Modals and Dialogs */}
      <ViewAppointmentDrawer
        appointment={selectedAppointment}
        open={viewDrawerOpen}
        onClose={() => setViewDrawerOpen(false)}
        onEdit={handleEditAppointment}
      />

      <AppointmentFormModal
        open={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleSubmitAppointment}
        patients={patients}
        doctors={doctors}
      />

      <RescheduleAppointmentModal
        appointment={selectedAppointment}
        open={rescheduleModalOpen}
        onClose={() => setRescheduleModalOpen(false)}
        onSubmit={handleRescheduleAppointment}
      />

      <CancelAppointmentDialog
        appointment={selectedAppointment}
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        onConfirm={handleCancelAppointment}
      />
    </div>
  );
};

export default AppointmentsPage;
