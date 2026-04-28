import { type ReactElement } from "react";
import { UserPlus, Download, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNurseAccounts } from "@/features/nurseAccounts/hooks/useNurseAccounts";
import NurseStatsCards from "@/features/nurseAccounts/components/NurseStatsCards";
import NurseSearchToolbar from "@/features/nurseAccounts/components/NurseSearchToolbar";
import NurseTable from "@/features/nurseAccounts/components/NurseTable";
import NurseCardListMobile from "@/features/nurseAccounts/components/NurseCardListMobile";
import ViewNurseModal from "@/features/nurseAccounts/components/ViewNurseModal";
import NurseFormModal from "@/features/nurseAccounts/components/NurseFormModal";
import NurseResetPasswordModal from "@/features/nurseAccounts/components/NurseResetPasswordModal";
import NurseDeleteConfirmDialog from "@/features/nurseAccounts/components/NurseDeleteConfirmDialog";
import type {
  addNurseFormValues,
  editNurseFormValues,
} from "@/features/nurseAccounts/types/nurseAccount";
import { toast } from "sonner";

const NurseAccountsPage = (): ReactElement => {
  const {
    filtered,
    totalCount,
    activeCount,
    inactiveCount,
    wardCount,
    allFilteredCount,
    page,
    pageSize,
    totalPages,
    setPage,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    wardFilter,
    setWardFilter,
    sortOption,
    setSortOption,
    allWards,
    modalMode,
    selectedNurse,
    openModal,
    closeModal,
    createNurse,
    updateNurse,
    resetPassword,
    toggleStatus,
    deleteNurse,
    refetch
  } = useNurseAccounts();

  const handleCreate = async (values: addNurseFormValues): Promise<void> => {
    try {
      const res = await createNurse(values);
      if (res.success) {
        toast.success(res.message);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create nurse account. Please try again.",
      );
    }
  };

  const handleUpdate = async (values: editNurseFormValues): Promise<void> => {
    try {
      if (!selectedNurse) return;
      const res = await updateNurse({ id: selectedNurse.nurseId, values });
      if (res.success) {
        toast.success(res.message);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update admin account. Please try again.",
      );
    }
  };

  const handleResetPassword = async (): Promise<void> => {
    try {
      if (!selectedNurse) return;
      await resetPassword(selectedNurse.nurseId);
      toast.success("Password reset successfully. Credentials updated.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update nurse account. Please try again.",
      );
    }
  };

  const handleToggleStatus = async (
    nurseId: string,
    isCurrentlyActive: boolean,
  ): Promise<void> => {
    try {
      await toggleStatus(nurseId);

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
    if (!selectedNurse) return;
    try {
      const res = await deleteNurse(selectedNurse.nurseId);
      if (res.success) {
        toast.success(res.message);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete admin account. Please try again.",
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <HeartPulse className="h-5 w-5 text-violet-600" />
            <h2 className="text-xl font-bold text-slate-900">Nurse Accounts</h2>
          </div>
          <p className="text-sm text-slate-500">
            Manage nursing staff access, credentials, and ward assignments.
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
            className="gap-1.5 bg-violet-600 hover:bg-violet-700"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Add Nurse
          </Button>
        </div>
      </div>

      {/* Stats */}
      <NurseStatsCards
        total={totalCount}
        active={activeCount}
        inactive={inactiveCount}
        wardCount={wardCount}
      />

      {/* Toolbar */}
      <NurseSearchToolbar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        wardFilter={wardFilter}
        onWardChange={setWardFilter}
        sortOption={sortOption}
        onSortChange={setSortOption}
        onRefresh={refetch}
        totalFiltered={allFilteredCount}
        wards={allWards}
      />

      {/* Desktop Table */}
      <div className="hidden md:block">
        <NurseTable
          nurses={filtered}
          onView={(n) => openModal("view", n)}
          onEdit={(n) => openModal("edit", n)}
          onResetPassword={(n) => openModal("reset-password", n)}
          onToggleStatus={(n) => handleToggleStatus(n.nurseId, n.isActive)}
          onDelete={(n) => openModal("delete", n)}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          totalFiltered={allFilteredCount}
          pageSize={pageSize}
        />
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden">
        <NurseCardListMobile
          nurses={filtered}
          onView={(n) => openModal("view", n)}
          onEdit={(n) => openModal("edit", n)}
          onResetPassword={(n) => openModal("reset-password", n)}
          onToggleStatus={(n) => handleToggleStatus(n.nurseId, n.isActive)}
          onDelete={(n) => openModal("delete", n)}
        />
      </div>

      {/* Modals */}
      <ViewNurseModal
        nurse={selectedNurse}
        open={modalMode === "view"}
        onClose={closeModal}
        onEdit={() => {
          closeModal();
          openModal("edit", selectedNurse ?? undefined);
        }}
      />

      <NurseFormModal
        mode="add"
        open={modalMode === "add"}
        onClose={closeModal}
        onSubmitAdd={handleCreate}
      />

      <NurseFormModal
        mode="edit"
        nurse={selectedNurse}
        open={modalMode === "edit"}
        onClose={closeModal}
        onSubmitEdit={handleUpdate}
      />

      <NurseResetPasswordModal
        nurse={selectedNurse}
        open={modalMode === "reset-password"}
        onClose={closeModal}
        onSubmit={handleResetPassword}
      />

      <NurseDeleteConfirmDialog
        nurse={selectedNurse}
        open={modalMode === "delete"}
        onClose={closeModal}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default NurseAccountsPage;
