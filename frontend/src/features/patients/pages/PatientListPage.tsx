import { type ReactElement } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

import { usePatients } from "@/features/patients/hooks/usePatients";

import PatientStatsCards from "@/features/patients/components/PatientStatsCards";
import PatientFilterToolbar from "@/features/patients/components/PatientFilterToolbar";
import PatientTable from "@/features/patients/components/PatientTable";
import PatientCardList from "@/features/patients/components/PatientCardList";
import ViewPatientDrawer from "@/features/patients/components/ViewPatientDrawer";
import EditPatientModal from "@/features/patients/components/EditPatientModal";
import PatientHistoryModal from "@/features/patients/components/PatientHistoryModal";
import { AssignDoctorModal } from "@/features/patients/components/AssignDoctorModal";

import type { editPatientFormValues } from "@/features/patients/types/patient";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PERMISSIONS, usePermissions } from "@/shared/security/permissions";

const PatientListPage = (): ReactElement => {
  const navigate = useNavigate();
  const { can } = usePermissions();
  const canCreatePatient = can(PERMISSIONS.PATIENT_CREATE);
  const canEditPatient = can(PERMISSIONS.PATIENT_UPDATE);
  const canAssignDoctor = can(PERMISSIONS.DOCTOR_ASSIGNMENT_ASSIGN);
  const canViewHistory = can(PERMISSIONS.PATIENT_HISTORY_VIEW);

  const {
    metaData,
    data,
    refetch,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    genderFilter,
    setGenderFilter,

    bloodTypeFilter,
    setBloodTypeFilter,

    isAssigned,
    setIsAssigned,

    sortOption,
    setSortOption,

    modalMode,
    selectedPatient,
    openModal,
    closeModal,

    doctors,
    assignDoctor,
    updatePatient,
  } = usePatients();

  // ---------- actions ----------
  const handleSaveEdit = async (values: editPatientFormValues): Promise<void> => {
    if (!selectedPatient) return;
    try {
      await updatePatient({ id: String(selectedPatient.patientId), values });
      toast.success('Patient updated successfully');
      closeModal();
    } catch {
      toast.error('Failed to update patient');
    }
  };

  const handleAssignDoctor = async (patientId: string, doctorId: string) => {
    try {
      await assignDoctor({ patientId, doctorId });
      toast.success("Doctor assigned successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to assign doctor");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Patient List</h1>
          <p className="text-sm text-slate-500 mt-1">
            View and manage registered patients across the hospital system.
          </p>
        </div>

        <div className="flex gap-2">
          {canCreatePatient && (
            <Button onClick={() => navigate("/patients/register")}>
              <UserPlus className="h-4 w-4 mr-2" />
              Register Patient
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <PatientStatsCards metaData={metaData} />

      {/* Filters */}
      <PatientFilterToolbar
        searchQuery={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        genderFilter={genderFilter}
        onGenderFilterChange={setGenderFilter}
        bloodTypeFilter={bloodTypeFilter}
        onBloodTypeFilterChange={setBloodTypeFilter}
        isAssigned={isAssigned}
        setIsAssigned={setIsAssigned}
        sortBy={sortOption}
        onSortByChange={setSortOption}
        onRefresh={refetch}
      />

      {/* Table */}
      <div className="hidden lg:block">
        <PatientTable
          patients={data}
          onViewProfile={(p) => openModal("view", p)}
          onEditPatient={(p) => openModal("edit", p)}
          onViewHistory={(p) => openModal("history", p)}
          onAssignDoctor={(p) => openModal("assign", p)}
          canEditPatient={canEditPatient}
          canViewHistory={canViewHistory}
          canAssignDoctor={canAssignDoctor}
        />
      </div>

      {/* Mobile */}
      <div className="lg:hidden">
        <PatientCardList
          patients={data}
          onViewProfile={(p) => openModal("view", p)}
          onEditPatient={(p) => openModal("edit", p)}
          onViewHistory={(p) => openModal("history", p)}
          onAssignDoctor={(p) => openModal("assign", p)}
          canEditPatient={canEditPatient}
          canViewHistory={canViewHistory}
          canAssignDoctor={canAssignDoctor}
        />
      </div>

      {/* Drawer */}
      <ViewPatientDrawer
        patient={selectedPatient}
        open={modalMode === "view"}
        onClose={closeModal}
      />

      {/* Edit */}
      {canEditPatient && (
        <EditPatientModal
          patient={selectedPatient}
          open={modalMode === "edit"}
          onClose={closeModal}
          onSave={handleSaveEdit}
        />
      )}

      {/* History */}
      {canViewHistory && (
        <PatientHistoryModal
          patient={selectedPatient}
          open={modalMode === "history"}
          onClose={closeModal}
        />
      )}

      {/* Assign Doctor */}
      {canAssignDoctor && (
        <AssignDoctorModal
          patient={selectedPatient}
          doctors={doctors}
          open={modalMode === "assign"}
          onClose={closeModal}
          onAssign={handleAssignDoctor}
        />
      )}
    </div>
  );
};

export default PatientListPage;
