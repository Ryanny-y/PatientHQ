import { type ReactElement } from "react";
import { UserPlus, Download, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/shared/context/AuthContext";
import { useAdminAccounts } from "@/features/adminAccounts/hooks/useAdminAccounts";
import AdminStatsCards from "@/features/adminAccounts/components/AdminStatsCards";
import SearchToolbar from "@/features/adminAccounts/components/SearchToolbar";
import AdminTable from "@/features/adminAccounts/components/AdminTable";
import AdminCardListMobile from "@/features/adminAccounts/components/AdminCardListMobile";
import ViewAdminModal from "@/features/adminAccounts/components/ViewAdminModal";
import AdminFormModal from "@/features/adminAccounts/components/AdminFormModal";
import ResetPasswordModal from "@/features/adminAccounts/components/ResetPasswordModal";
import DeleteConfirmDialog from "@/features/adminAccounts/components/DeleteConfirmDialog";
import type {
  addAdminFormValues,
  editAdminFormValues,
} from "@/features/adminAccounts/types/adminAccount";
import { toast } from "sonner";

const AdminAccountsPage = (): ReactElement => {
  const { user } = useAuth();
  const {
    metaData,
    data: accounts,
    totalCount,
    page,
    pageSize,
    totalPages,
    setPage,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    sortOption,
    setSortOption,
    modalMode,
    selectedAdmin,
    openModal,
    closeModal,
    createAdmin,
    updateAdmin,
    resetPassword,
    toggleStatus,
    deleteAdmin,
    refetch,
  } = useAdminAccounts();

  const handleCreate = async (values: addAdminFormValues): Promise<void> => {
    try {
      const res = await createAdmin(values);
      if (res.success) {
        toast.success(res.message);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create admin account. Please try again.",
      );
    }
  };

  const handleUpdate = async (values: editAdminFormValues): Promise<void> => {
    try {
      if (!selectedAdmin) return;
      const res = await updateAdmin({
        id: selectedAdmin.adminId,
        values,
      });
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
      if (!selectedAdmin) return;
      await resetPassword(selectedAdmin.adminId);
      toast.success("Password reset successfully. Credentials updated.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update admin account. Please try again.",
      );
    }
  };

  const handleToggleStatus = async (
    adminId: string,
    isCurrentlyActive: boolean,
  ): Promise<void> => {
    try {
      await toggleStatus(adminId);

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
    if (!selectedAdmin) return;
    try {
      const res = await deleteAdmin(selectedAdmin.adminId);
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

  const handleRefresh = (): void => {
    setSearch("");
    setStatusFilter("all");
    setSortOption("newest");
    refetch();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">Admin Accounts</h2>
          </div>
          <p className="text-sm text-slate-500">
            Manage hospital administrator access and credentials.
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
            className="gap-1.5"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Add Admin
          </Button>
        </div>
      </div>

      {/* Stats */}
      <AdminStatsCards
        total={metaData?.totalAdmins ?? 0}
        active={metaData?.activeAccounts ?? 0}
        inactive={metaData?.inactiveAccounts ?? 0}
        recent={metaData?.recentlyAdded ?? 0}
      />

      {/* Toolbar */}
      <SearchToolbar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sortOption={sortOption}
        onSortChange={setSortOption}
        onRefresh={handleRefresh}
        totalFiltered={totalCount}
      />

      {/* Desktop Table */}
      <div className="hidden md:block">
        <AdminTable
          admins={accounts}
          currentUsername={user?.username ?? ""}
          onView={(a) => openModal("view", a)}
          onEdit={(a) => openModal("edit", a)}
          onResetPassword={(a) => openModal("reset-password", a)}
          onToggleStatus={(a) => handleToggleStatus(a.adminId, a.isActive)}
          onDelete={(a) => openModal("delete", a)}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          totalFiltered={totalCount}
          pageSize={pageSize}
        />
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden">
        <AdminCardListMobile
          admins={accounts}
          currentUsername={user?.username ?? ""}
          onView={(a) => openModal("view", a)}
          onEdit={(a) => openModal("edit", a)}
          onResetPassword={(a) => openModal("reset-password", a)}
          onToggleStatus={(a) => handleToggleStatus(a.adminId, a.isActive)}
          onDelete={(a) => openModal("delete", a)}
        />
      </div>

      {/* Modals */}
      <ViewAdminModal
        admin={selectedAdmin}
        open={modalMode === "view"}
        onClose={closeModal}
        onEdit={() => {
          closeModal();
          openModal("edit", selectedAdmin ?? undefined);
        }}
      />

      <AdminFormModal
        mode="add"
        open={modalMode === "add"}
        onClose={closeModal}
        onSubmitAdd={handleCreate}
      />

      <AdminFormModal
        mode="edit"
        admin={selectedAdmin}
        open={modalMode === "edit"}
        onClose={closeModal}
        onSubmitEdit={handleUpdate}
      />

      <ResetPasswordModal
        admin={selectedAdmin}
        open={modalMode === "reset-password"}
        onClose={closeModal}
        onSubmit={handleResetPassword}
      />

      <DeleteConfirmDialog
        admin={selectedAdmin}
        open={modalMode === "delete"}
        onClose={closeModal}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default AdminAccountsPage;
