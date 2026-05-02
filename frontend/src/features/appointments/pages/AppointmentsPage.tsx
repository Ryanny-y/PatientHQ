import { useState, useMemo, type ReactElement } from "react";
import { Button } from "@/components/ui/button";
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
import { useAppointments } from "../hooks/useAppointments";
import { usePatientQuery } from "@/features/patients/hooks/usePatientQuery";
import { useDoctorsQuery } from "@/features/doctorAccounts/hooks/useDoctorsQuery";
import type {
  Appointment,
  CreateAppointmentFormValues,
  UpdateAppointmentFormValues,
} from "../types/appointment";
import { toast } from "sonner";

const AppointmentsPage = (): ReactElement => {
  const { user } = useAuth();
  const userRole = (user?.role || 'ADMIN').toLowerCase() as 'admin' | 'doctor' | 'nurse';

  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const {
    meta,
    data: appointments,
    isLoading,
    page,
    totalPages,
    totalElements,
    setPage,
    refetch,
    filters,
    updateFilter,
    createAppointment,
    updateAppointment,
  } = useAppointments();

  const { data: patientsResponse } = usePatientQuery({ page: 0, size: 1000 });
  const patients = useMemo(() => {
    const raw = patientsResponse?.data?.content ?? [];
    return raw.map((p) => ({
      patientId: String(p.patientId),
      fullName: p.fullName,
      contactNumber: p.contactNumber,
    }));
  }, [patientsResponse]);

  const { data: doctorsResponse } = useDoctorsQuery({ page: 0, size: 1000, isActive: true });
  const doctors = useMemo(() => {
    const raw = doctorsResponse?.data?.content ?? [];
    return raw.map((d) => ({
      doctorId: d.doctorId,
      fullName: d.fullName,
      specialization: d.specialization,
    }));
  }, [doctorsResponse]);

  const specializations = useMemo(
    () => Array.from(new Set(doctors.map((d) => d.specialization))),
    [doctors],
  );


  const handleRefresh = (): void => {
    refetch();
    toast.success("Appointments refreshed successfully.");
  };

  const handleViewAppointment = (appointment: Appointment): void => {
    setSelectedAppointment(appointment);
    setViewDrawerOpen(true);
  };

  const handleEditAppointment = (appointment: Appointment): void => {
    setSelectedAppointment(appointment);
    setRescheduleModalOpen(true);
  };

  const handleConfirmAppointment = async (appointment: Appointment): Promise<void> => {
    try {
      await updateAppointment(appointment.appointmentId, { status: 'CONFIRMED' });
      toast.success("Appointment confirmed.");
    } catch {
      toast.error("Failed to confirm appointment");
    }
  };

  const handleCompleteAppointment = async (appointment: Appointment): Promise<void> => {
    try {
      await updateAppointment(appointment.appointmentId, { status: 'COMPLETED' });
      toast.success("Appointment marked as completed.");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleRescheduleAppointment = async (appointmentId: string, data: Partial<UpdateAppointmentFormValues>): Promise<void> => {
    try {
      await updateAppointment(appointmentId, {
        appointmentDate: data.appointmentDate,
        reason: data.reason,
        notes: data.notes,
      });
      toast.success("Appointment rescheduled successfully.");
    } catch {
      toast.error("Failed to reschedule appointment");
    }
  };

  const handleCancelAppointment = async (appointmentId: string, reason: string): Promise<void> => {
    try {
      await updateAppointment(appointmentId, { status: 'CANCELLED', notes: reason });
      toast.warning("Appointment cancelled.");
    } catch {
      toast.error("Failed to cancel appointment");
    }
  };

  const handleSubmitAppointment = async (values: CreateAppointmentFormValues): Promise<void> => {
    try {
      await createAppointment(values);
      toast.success("Appointment scheduled successfully.");
      setFormModalOpen(false);
    } catch {
      toast.error("Failed to schedule appointment");
    }
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
            <Button onClick={() => setFormModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Appointment
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <AppointmentStatsCards meta={meta?.data} />

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
              appointments={appointments}
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
              appointments={appointments}
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
                Showing {appointments.length} of {totalElements} appointments
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
          appointments={appointments}
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
