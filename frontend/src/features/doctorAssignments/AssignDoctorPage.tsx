import { type ReactElement } from "react";
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
import type { ReassignPayload } from "@/features/doctorAssignments/components/AssignmentModals";
import { useDoctorAssignments } from "@/features/doctorAssignments/hooks/useDoctorAssignments";
import { doctorAssignmentService } from "@/features/doctorAssignments/service/doctorAssignmentService";
import { useDoctorsQuery } from "@/features/doctorAccounts/hooks/useDoctorsQuery";

const AssignDoctorPage = (): ReactElement => {
  const { toasts, toast, dismiss } = useToast();

  const {
    data,
    isLoading,
    refetch,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    patientStatusFilter,
    setPatientStatusFilter,
    sortBy,
    setSortBy,
    modalMode,
    selectedAssignment,
    openModal,
    closeModal,
  } = useDoctorAssignments();

  const activeAssignments = data.filter((a) => a.isActive).length;

  const { data: doctorsResponse } = useDoctorsQuery({ page: 0, size: 200, isActive: true });

  const handleConfirmReassign = async (payload: ReassignPayload): Promise<void> => {
    try {
      await doctorAssignmentService.reassignDoctor({
        assignmentId: payload.assignmentId,
        newDoctorId: payload.newDoctorId,
      });
      toast("Doctor reassigned successfully");
      refetch();
    } catch {
      toast("Failed to reassign doctor", "error");
    }
  };

  const handleConfirmRemove = async (): Promise<void> => {
    if (!selectedAssignment) return;
    try {
      await doctorAssignmentService.deleteAssignment(selectedAssignment.assignmentId);
      toast("Assignment removed");
      closeModal();
      refetch();
    } catch {
      toast("Failed to remove assignment", "error");
    }
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
        unassignedPatients={0}
        availableDoctors={0}
        highWorkloadDoctors={0}
      />

      <AssignmentFilterToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        patientStatusFilter={patientStatusFilter}
        onPatientStatusChange={setPatientStatusFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        onRefresh={() => { refetch(); toast("Assignments refreshed"); }}
      />

      {isLoading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          Loading assignments...
        </div>
      ) : (
        <>
          <div className="hidden lg:block">
            <AssignmentTable
              assignments={data}
              role="Admin"
              onViewAssignment={(a) => openModal("view", a)}
              onReassignAssignment={(a) => openModal("reassign", a)}
              onRemoveAssignment={(a) => openModal("remove", a)}
            />
          </div>

          <div className="lg:hidden">
            <AssignmentCardListMobile
              assignments={data}
              role="Admin"
              onViewAssignment={(a) => openModal("view", a)}
              onReassignAssignment={(a) => openModal("reassign", a)}
              onRemoveAssignment={(a) => openModal("remove", a)}
            />
          </div>
        </>
      )}

      <ViewAssignmentDrawer
        assignment={selectedAssignment}
        open={modalMode === "view"}
        onOpenChange={(open) => { if (!open) closeModal(); }}
      />
      <ReassignDoctorModal
        open={modalMode === "reassign"}
        onOpenChange={(open) => { if (!open) closeModal(); }}
        assignment={selectedAssignment}
        doctors={doctorsResponse?.data?.content ?? []}
        onConfirm={handleConfirmReassign}
      />
      <RemoveAssignmentDialog
        open={modalMode === "remove"}
        onOpenChange={(open) => { if (!open) closeModal(); }}
        assignment={selectedAssignment}
        onRemove={handleConfirmRemove}
      />
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </div>
  );
};

export default AssignDoctorPage;
