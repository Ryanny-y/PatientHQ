import { type ReactElement, useMemo, useState } from "react";
import { UserPlus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

import { usePatients } from "@/features/patients/hooks/usePatients";

import PatientStatsCards from "@/features/patients/components/PatientStatsCards";
import PatientFilterToolbar from "@/features/patients/components/PatientFilterToolbar";
import PatientTable from "@/features/patients/components/PatientTable";
import PatientCardList from "@/features/patients/components/PatientCardList";
import ViewPatientDrawer from "@/features/patients/components/ViewPatientDrawer";
import EditPatientModal from "@/features/patients/components/EditPatientModal";
import PatientHistoryModal from "@/features/patients/components/PatientHistoryModal";

import type { Patient } from "@/features/patients/types/patient";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const PatientListPage = (): ReactElement => {
  const navigate = useNavigate();

  const {
    filtered,
    refetch,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    sortOption,
    setSortOption,

    modalMode,
    selectedPatient,
    openModal,
    closeModal,

    updatePatient,
  } = usePatients();

  // extra filters NOT in hook (keep local for now)
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [bloodTypeFilter, setBloodTypeFilter] = useState<string>("all");

  // apply additional filters on top of hook result
  const finalPatients = useMemo(() => {
    let result = filtered;

    if (genderFilter !== "all") {
      result = result.filter((p) => p.gender === genderFilter);
    }

    if (bloodTypeFilter !== "all") {
      result = result.filter((p) => p.bloodType === bloodTypeFilter);
    }

    return result;
  }, [filtered, genderFilter, bloodTypeFilter]);

  // ---------- actions ----------
  const handleSaveEdit = async (data: Partial<Patient>) => {
    if (!selectedPatient) return;

    const res = await updatePatient({
      id: selectedPatient.patientId,
      ...data,
    });

    if (res?.success) {
      toast.success("Patient updated successfully");
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
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => navigate("/patients/register")}>
            <UserPlus className="h-4 w-4 mr-2" />
            Register Patient
          </Button>
        </div>
      </div>

      {/* Stats */}
      <PatientStatsCards patients={finalPatients} />

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
        sortBy={sortOption}
        onSortByChange={setSortOption}
        onRefresh={refetch}
      />

      {/* Table */}
      <div className="hidden lg:block">
        <PatientTable
          patients={finalPatients}
          onViewProfile={(p) => openModal("view", p)}
          onEditPatient={(p) => openModal("edit", p)}
          onViewHistory={(p) => openModal("history", p)}
        />
      </div>

      {/* Mobile */}
      <div className="lg:hidden">
        <PatientCardList
          patients={finalPatients}
          onViewProfile={(p) => openModal("view", p)}
          onEditPatient={(p) => openModal("edit", p)}
          onViewHistory={(p) => openModal("history", p)}
        />
      </div>

      {/* Drawer */}
      <ViewPatientDrawer
        patient={selectedPatient}
        open={modalMode === "view"}
        onClose={closeModal}
      />

      {/* Edit */}
      <EditPatientModal
        patient={selectedPatient}
        open={modalMode === "edit"}
        onClose={closeModal}
        onSave={handleSaveEdit}
      />

      {/* History */}
      <PatientHistoryModal
        patient={selectedPatient}
        open={modalMode === "history"}
        onClose={closeModal}
      />
    </div>
  );
};

export default PatientListPage;
