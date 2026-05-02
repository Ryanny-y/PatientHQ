import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast, ToastContainer } from "@/shared/hooks/useToast";
import AssignmentStatsCards from "@/features/doctorAssignments/components/AssignmentStatsCards";
import AssignmentFilterToolbar from "@/features/doctorAssignments/components/AssignmentFilterToolbar";
import AssignmentTable from "@/features/doctorAssignments/components/AssignmentTable";
import AssignmentCardListMobile from "@/features/doctorAssignments/components/AssignmentCardListMobile";
import {
  ViewAssignmentDrawer,
  ReassignDoctorModal,
  RemoveAssignmentDialog,
} from "@/features/doctorAssignments/components/AssignmentModals";
import type {
  ReassignPayload,
} from "@/features/doctorAssignments/components/AssignmentModals";
import {
  allAssignments,
  doctorProfiles,
  unassignedPatients,
} from "@/features/patients/utils/assignmentMocks";
import type {
  AssignmentRecord,
  PatientSummary,
} from "@/features/doctorAssignments/types/assignment";

const AssignDoctorPage = (): React.ReactElement => {
  const { toasts, toast, dismiss } = useToast();

  const [assignments, setAssignments] =
    useState<AssignmentRecord[]>(allAssignments);
  const [unassigned, setUnassigned] =
    useState<PatientSummary[]>(unassignedPatients);
  const [role, setRole] = useState<"Admin" | "Doctor" | "Nurse">("Admin");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [specializationFilter, setSpecializationFilter] = useState("All");
  const [patientStatusFilter, setPatientStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedAssignment, setSelectedAssignment] =
    useState<AssignmentRecord | null>(null);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);

  const currentDoctorId = 12;

  const visibleAssignments = useMemo(() => {
    let filtered = assignments;

    if (role === "Doctor") {
      filtered = filtered.filter(
        (assignment) => assignment.doctor_id === currentDoctorId,
      );
    }

    if (searchQuery) {
      const normalized = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (assignment) =>
          assignment.patient_name.toLowerCase().includes(normalized) ||
          assignment.doctor_name.toLowerCase().includes(normalized) ||
          assignment.assignment_id.toString().includes(normalized),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((assignment) =>
        statusFilter === "active"
          ? assignment.is_active
          : !assignment.is_active,
      );
    }

    if (specializationFilter !== "All") {
      filtered = filtered.filter(
        (assignment) => assignment.specialization === specializationFilter,
      );
    }

    if (patientStatusFilter !== "all") {
      filtered = filtered.filter(
        (assignment) => assignment.patient_status === patientStatusFilter,
      );
    }

    filtered = [...filtered].sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.assigned_date).getTime() -
          new Date(a.assigned_date).getTime()
        );
      }
      if (sortBy === "oldest") {
        return (
          new Date(a.assigned_date).getTime() -
          new Date(b.assigned_date).getTime()
        );
      }
      if (sortBy === "patient-asc") {
        return a.patient_name.localeCompare(b.patient_name);
      }
      if (sortBy === "doctor-asc") {
        return a.doctor_name.localeCompare(b.doctor_name);
      }
      return 0;
    });

    return filtered;
  }, [
    assignments,
    searchQuery,
    statusFilter,
    specializationFilter,
    patientStatusFilter,
    sortBy,
    role,
  ]);

  const activeAssignments = visibleAssignments.filter(
    (assignment) => assignment.is_active,
  ).length;
  const availableDoctors = doctorProfiles.filter(
    (doctor) => doctor.is_active && doctor.current_load < 20,
  ).length;
  const highWorkloadDoctors = doctorProfiles.filter(
    (doctor) => doctor.is_active && doctor.current_load >= 16,
  ).length;

  const handleViewAssignment = (assignment: AssignmentRecord): void => {
    setSelectedAssignment(assignment);
    setViewDrawerOpen(true);
  };

  const handleReassignAssignment = (assignment: AssignmentRecord): void => {
    setSelectedAssignment(assignment);
    setReassignModalOpen(true);
  };

  const handleRemoveAssignment = (assignment: AssignmentRecord): void => {
    setSelectedAssignment(assignment);
    setRemoveDialogOpen(true);
  };

  const handleConfirmReassign = (payload: ReassignPayload): void => {
    const doctor = doctorProfiles.find(
      (item) => item.doctor_id === payload.new_doctor_id,
    );
    if (!doctor) {
      toast("Doctor selection not found.", "error");
      return;
    }
    setAssignments((prev) =>
      prev.map((assignment) =>
        assignment.assignment_id === payload.assignment_id
          ? {
              ...assignment,
              doctor_id: doctor.doctor_id,
              doctor_name: doctor.doctor_name,
              specialization: doctor.specialization,
            }
          : assignment,
      ),
    );
    toast("Assignment updated");
  };

  const handleConfirmRemove = (): void => {
    if (!selectedAssignment) return;
    setAssignments((prev) =>
      prev.map((assignment) =>
        assignment.assignment_id === selectedAssignment.assignment_id
          ? { ...assignment, is_active: false }
          : assignment,
      ),
    );

    setUnassigned((prev) => {
      if (
        prev.some((item) => item.patient_id === selectedAssignment.patient_id)
      ) {
        return prev;
      }
      return [
        ...prev,
        {
          patient_id: selectedAssignment.patient_id,
          full_name: selectedAssignment.patient_name,
          status: selectedAssignment.patient_status,
          room: selectedAssignment.patient_room,
          condition: "Stable",
        },
      ];
    });
    setRemoveDialogOpen(false);
    toast("Assignment removed");
  };

  const handleRefresh = (): void => {
    toast("Assignment queue refreshed");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Assign Doctor</h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage physician-to-patient assignments and care responsibility.
          </p>
        </div>
      </div>

      <AssignmentStatsCards
        activeAssignments={activeAssignments}
        unassignedPatients={unassigned.length}
        availableDoctors={availableDoctors}
        highWorkloadDoctors={highWorkloadDoctors}
      />

      <AssignmentFilterToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        specializationFilter={specializationFilter}
        onSpecializationChange={setSpecializationFilter}
        patientStatusFilter={patientStatusFilter}
        onPatientStatusChange={setPatientStatusFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        onRefresh={handleRefresh}
      />

      {role !== "Admin" && (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
          Access mode:{" "}
          <span className="font-semibold text-slate-900">{role}</span>. You can
          view assigned cases and patient load, but only administrators can
          create or remove assignments.
        </div>
      )}

      <div className="hidden lg:block">
        <AssignmentTable
          assignments={visibleAssignments}
          role={role}
          onViewAssignment={handleViewAssignment}
          onReassignAssignment={handleReassignAssignment}
          onRemoveAssignment={handleRemoveAssignment}
          onViewPatient={handleViewAssignment}
          onViewDoctor={handleViewAssignment}
        />
      </div>

      <div className="lg:hidden">
        <AssignmentCardListMobile
          assignments={visibleAssignments}
          role={role}
          onViewAssignment={handleViewAssignment}
          onReassignAssignment={handleReassignAssignment}
          onRemoveAssignment={handleRemoveAssignment}
        />
      </div>

      <ViewAssignmentDrawer
        assignment={selectedAssignment}
        open={viewDrawerOpen}
        onOpenChange={setViewDrawerOpen}
      />
      <ReassignDoctorModal
        open={reassignModalOpen}
        onOpenChange={setReassignModalOpen}
        assignment={selectedAssignment}
        doctors={doctorProfiles}
        onConfirm={handleConfirmReassign}
      />
      <RemoveAssignmentDialog
        open={removeDialogOpen}
        onOpenChange={setRemoveDialogOpen}
        assignment={selectedAssignment}
        onRemove={handleConfirmRemove}
      />
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </div>
  );
};

export default AssignDoctorPage;
