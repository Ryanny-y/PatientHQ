import { type ReactElement } from "react";
import { UserPlus, Download, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDoctorAccounts } from "@/features/doctorAccounts/hooks/useDoctorAccounts";
import DoctorStatsCards from "@/features/doctorAccounts/components/DoctorStatsCards";
import DoctorSearchToolbar from "@/features/doctorAccounts/components/DoctorSearchToolbar";
import DoctorTable from "@/features/doctorAccounts/components/DoctorTable";
import DoctorCardListMobile from "@/features/doctorAccounts/components/DoctorCardListMobile";
import ViewDoctorModal from "@/features/doctorAccounts/components/ViewDoctorModal";
import DoctorFormModal from "@/features/doctorAccounts/components/DoctorFormModal";
import DoctorResetPasswordModal from "@/features/doctorAccounts/components/DoctorResetPasswordModal";
import DoctorDeleteConfirmDialog from "@/features/doctorAccounts/components/DoctorDeleteConfirmDialog";
import type {
  addDoctorFormValues,
  editDoctorFormValues,
} from "@/features/doctorAccounts/types/doctorAccount";
import { toast } from "sonner";

const DoctorAccountsPage = (): ReactElement => {
  const {
    filtered,
    totalCount,
    activeCount,
    inactiveCount,
    specializationCount,
    allFilteredCount,
    page,
    pageSize,
    totalPages,
    setPage,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    specializationFilter,
    setSpecializationFilter,
    sortOption,
    setSortOption,
    allSpecializations,
    modalMode,
    selectedDoctor,
    openModal,
    closeModal,
    createDoctor,
    updateDoctor,
    resetPassword,
    toggleStatus,
    deleteDoctor,
  } = useDoctorAccounts();

  const handleCreate = async (values: addDoctorFormValues): Promise<void> => {
    try {
      const res = await createDoctor(values);
      if (res.success) {
        toast.success(res.message);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create doctor account. Please try again.",
      );
    }
  };

  const handleUpdate = async (values: editDoctorFormValues): Promise<void> => {
    try {
      if (!selectedDoctor) return;
      const res = await updateDoctor({
        id: selectedDoctor.doctorId,
        values,
      });
      if (res.success) {
        toast.success(res.message);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update doctor account. Please try again.",
      );
    }
  };

  const handleResetPassword = async (): Promise<void> => {
    if (!selectedDoctor) return;
    try {
      const res = await resetPassword(selectedDoctor.doctorId);
      if (res.success) {
        toast.success(res.message);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to reset doctor password. Please try again.",
      );
    }
  };

  const handleToggleStatus = async (
    doctorId: string,
    isCurrentlyActive: boolean,
  ): Promise<void> => {
    try {
      await toggleStatus(doctorId);

      if (isCurrentlyActive) {
        toast.warning("Account has been deactivated.");
      } else {
        toast.success("Account has been activated.");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update admin account. Please try again.",
      );
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!selectedDoctor) return;
    try {
      const res = await deleteDoctor(selectedDoctor.doctorId);
      if (res.success) {
        toast.success(res.message);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete doctor account. Please try again.",
      );
    }
  };

  const handleRefresh = (): void => {
    setSearch("");
    setSpecializationFilter("all");
    setStatusFilter("all");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Stethoscope className="h-5 w-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900">
              Doctor Accounts
            </h2>
          </div>
          <p className="text-sm text-slate-500">
            Manage physician access, credentials, and clinical profiles.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
          <Button
            size="sm"
            onClick={() => openModal("add")}
            className="gap-1.5 bg-emerald-600 hover:bg-emerald-700"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Add Doctor
          </Button>
        </div>
      </div>

      {/* Stats */}
      <DoctorStatsCards
        total={totalCount}
        active={activeCount}
        inactive={inactiveCount}
        specializationCount={specializationCount}
      />

      {/* Toolbar */}
      <DoctorSearchToolbar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        specializationFilter={specializationFilter}
        onSpecializationChange={setSpecializationFilter}
        sortOption={sortOption}
        onSortChange={setSortOption}
        onRefresh={handleRefresh}
        totalFiltered={allFilteredCount}
        specializations={allSpecializations}
      />

      {/* Desktop Table */}
      <div className="hidden md:block">
        <DoctorTable
          doctors={filtered}
          onView={(d) => openModal("view", d)}
          onEdit={(d) => openModal("edit", d)}
          onResetPassword={(d) => openModal("reset-password", d)}
          onToggleStatus={(d) => handleToggleStatus(d.doctorId, d.isActive)}
          onDelete={(d) => openModal("delete", d)}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          totalFiltered={allFilteredCount}
          pageSize={pageSize}
        />
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden">
        <DoctorCardListMobile
          doctors={filtered}
          onView={(d) => openModal("view", d)}
          onEdit={(d) => openModal("edit", d)}
          onResetPassword={(d) => openModal("reset-password", d)}
          onToggleStatus={(d) => handleToggleStatus(d.doctorId, d.isActive)}
          onDelete={(d) => openModal("delete", d)}
        />
      </div>

      {/* Modals */}
      <ViewDoctorModal
        doctor={selectedDoctor}
        open={modalMode === "view"}
        onClose={closeModal}
        onEdit={() => {
          closeModal();
          openModal("edit", selectedDoctor ?? undefined);
        }}
      />

      <DoctorFormModal
        mode="add"
        open={modalMode === "add"}
        onClose={closeModal}
        onSubmitAdd={handleCreate}
      />

      <DoctorFormModal
        mode="edit"
        doctor={selectedDoctor}
        open={modalMode === "edit"}
        onClose={closeModal}
        onSubmitEdit={handleUpdate}
      />

      <DoctorResetPasswordModal
        doctor={selectedDoctor}
        open={modalMode === "reset-password"}
        onClose={closeModal}
        onSubmit={handleResetPassword}
      />

      <DoctorDeleteConfirmDialog
        doctor={selectedDoctor}
        open={modalMode === "delete"}
        onClose={closeModal}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default DoctorAccountsPage;
