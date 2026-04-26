import { useState, useMemo, type ReactElement } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/shared/hooks/useToast";
import { Plus, Download, Calendar as CalendarIcon } from "lucide-react";
import { AppointmentStatsCards } from "../components/AppointmentStatsCards";
import { AppointmentFilterToolbar } from "../components/AppointmentFilterToolbar";
import { AppointmentTable } from "../components/AppointmentTable";
import { AppointmentCardListMobile } from "../components/AppointmentCardListMobile";
import { AppointmentCalendarView } from "../components/AppointmentCalendarView";
import { ViewAppointmentDrawer } from "../components/ViewAppointmentDrawer";
import { AppointmentFormModal } from "../components/AppointmentFormModal";
import { RescheduleAppointmentModal } from "../components/RescheduleAppointmentModal";
import { CancelAppointmentDialog } from "../components/CancelAppointmentDialog";
import { RoleStateSwitcher } from "../components/RoleStateSwitcher";
import {
  mockAppointments,
  mockAppointmentStats,
  mockPatients,
  mockDoctors,
  mockSpecializations,
} from "../utils/mockAppointmentData";
import type { Appointment, UserRole, FilterOptions, AppointmentFormData } from "../types/appointment";

const AppointmentsPage = (): ReactElement => {
  // Mock user role - in real app this would come from auth context
  const [userRole, setUserRole] = useState<UserRole>("admin"); // Change to 'doctor' or 'nurse' to test RBAC
  const [currentUserId] = useState<number>(12); // Mock current user ID
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');

  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    dateRange: { from: null, to: null },
    status: "all",
    doctor: "all",
    specialization: "all",
    sortBy: "nearest",
  });

  // Modal and drawer states
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const { toast } = useToast();

  // Filter and sort appointments
  const filteredAppointments = useMemo(() => {
    let filtered = appointments.filter((appointment) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matches =
          appointment.appointment_id.toString().includes(searchLower) ||
          appointment.patient_name.toLowerCase().includes(searchLower) ||
          appointment.doctor_name.toLowerCase().includes(searchLower);
        if (!matches) return false;
      }

      // Date range filter
      if (filters.dateRange.from || filters.dateRange.to) {
        const appointmentDate = new Date(appointment.appointment_date);
        if (filters.dateRange.from && appointmentDate < filters.dateRange.from) return false;
        if (filters.dateRange.to && appointmentDate > filters.dateRange.to) return false;
      }

      // Status filter
      if (filters.status && filters.status !== "all" && appointment.status !== filters.status) {
        return false;
      }

      // Doctor filter
      if (filters.doctor && filters.doctor !== "all" && appointment.doctor_id.toString() !== filters.doctor) {
        return false;
      }

      // Specialization filter
      if (
        filters.specialization &&
        filters.specialization !== "all" &&
        appointment.specialization !== filters.specialization
      ) {
        return false;
      }

      return true;
    });

    // Sort appointments
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "nearest":
          return new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime();
        case "latest":
          return new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime();
        case "patient_name":
          return a.patient_name.localeCompare(b.patient_name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [appointments, filters]);

  // Event handlers
  const handleRefresh = () => {
    toast("Appointments refreshed successfully.", "success");
  };

  const handleExport = () => {
    // Mock export functionality
    const csvContent = [
      ['Appointment ID', 'Patient Name', 'Doctor Name', 'Date & Time', 'Status', 'Reason'],
      ...filteredAppointments.map(apt => [
        apt.appointment_id.toString(),
        apt.patient_name,
        apt.doctor_name,
        apt.appointment_date,
        apt.status,
        apt.reason
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `appointments_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast("Appointments exported successfully.", "success");
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

  const handleConfirmAppointment = (appointment: Appointment) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.appointment_id === appointment.appointment_id ? { ...a, status: "CONFIRMED" as const } : a
      )
    );
    toast("Appointment confirmed successfully.", "success");
  };

  const handleCompleteAppointment = (appointment: Appointment) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.appointment_id === appointment.appointment_id ? { ...a, status: "COMPLETED" as const } : a
      )
    );
    toast("Appointment marked as completed.", "success");
  };

  const handleRescheduleAppointment = (appointmentId: number, data: Partial<Appointment>) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.appointment_id === appointmentId ? { ...a, ...data } : a
      )
    );
    toast("Appointment rescheduled successfully.", "success");
  };

  const handleCancelAppointment = (appointmentId: number, reason: string) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.appointment_id === appointmentId
          ? { ...a, status: "CANCELLED" as const, notes: reason || a.notes }
          : a
      )
    );
    toast("Appointment cancelled successfully.", "warning");
  };

  const handleSubmitAppointment = (data: AppointmentFormData) => {
    const newAppointment: Appointment = {
      appointment_id: Math.max(...appointments.map((a) => a.appointment_id)) + 1,
      patient_id: data.patient_id,
      patient_name: mockPatients.find((p) => p.id === data.patient_id)?.name || "Unknown Patient",
      patient_contact: mockPatients.find((p) => p.id === data.patient_id)?.contact,
      doctor_id: data.doctor_id,
      doctor_name: mockDoctors.find((d) => d.id === data.doctor_id)?.name || "Unknown Doctor",
      specialization: mockDoctors.find((d) => d.id === data.doctor_id)?.specialization || "",
      appointment_date: data.appointment_date,
      reason: data.reason,
      status: "PENDING",
      notes: data.notes,
      created_at: new Date().toISOString().split("T")[0],
      duration_minutes: data.duration_minutes || 30,
    };

    setAppointments((prev) => [newAppointment, ...prev]);
    toast("Appointment scheduled successfully.", "success");
  };

  const handleNotifyPatient = (appointment: Appointment) => {
    toast(`Reminder sent to ${appointment.patient_name}.`, "success");
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
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
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

      {/* Role Switcher for Testing */}
      <RoleStateSwitcher currentRole={userRole} onRoleChange={setUserRole} />

      {/* Stats Cards */}
      <AppointmentStatsCards stats={mockAppointmentStats} />

      {/* Filter Toolbar - Only show in table view */}
      {viewMode === 'table' && (
        <AppointmentFilterToolbar
          filters={filters}
          onFiltersChange={setFilters}
          onRefresh={handleRefresh}
          doctors={mockDoctors}
          specializations={mockSpecializations}
        />
      )}

      {/* Appointments Display */}
      {viewMode === 'table' ? (
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
              onNotifyPatient={handleNotifyPatient}
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
              onCancelAppointment={(appointment: Appointment) => {
                setSelectedAppointment(appointment);
                setCancelDialogOpen(true);
              }}
              onNotifyPatient={handleNotifyPatient}
            />
          </div>

          {/* Pagination */}
          {filteredAppointments.length > 0 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600">
                Showing {filteredAppointments.length} of {appointments.length} appointments
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
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
        onNotify={handleNotifyPatient}
      />

      <AppointmentFormModal
        open={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleSubmitAppointment}
        patients={mockPatients}
        doctors={mockDoctors}
        userRole={userRole}
        currentUserId={currentUserId}
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
