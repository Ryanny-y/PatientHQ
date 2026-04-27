import { type ReactElement } from 'react';
import { UserPlus, Download, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToastContainer, useToast } from '@/shared/hooks/useToast';
import { useAuth } from '@/shared/context/AuthContext';
import { useAdminAccounts } from '@/features/adminAccounts/hooks/useAdminAccounts';
import AdminStatsCards from '@/features/adminAccounts/components/AdminStatsCards';
import SearchToolbar from '@/features/adminAccounts/components/SearchToolbar';
import AdminTable from '@/features/adminAccounts/components/AdminTable';
import AdminCardListMobile from '@/features/adminAccounts/components/AdminCardListMobile';
import ViewAdminModal from '@/features/adminAccounts/components/ViewAdminModal';
import AdminFormModal from '@/features/adminAccounts/components/AdminFormModal';
import ResetPasswordModal from '@/features/adminAccounts/components/ResetPasswordModal';
import DeleteConfirmDialog from '@/features/adminAccounts/components/DeleteConfirmDialog';
import type { addAdminFormValues, editAdminFormValues } from '@/features/adminAccounts/types/adminAccount';

const AdminAccountsPage = (): ReactElement => {
  const { user } = useAuth();
  const { toasts, toast, dismiss } = useToast();
  const {
    filtered, totalCount, activeCount, inactiveCount, recentCount,
    allFilteredCount,
    page, pageSize, totalPages, setPage,
    search, setSearch, statusFilter, setStatusFilter, sortOption, setSortOption,
    modalMode, selectedAdmin, openModal, closeModal,
    createAdmin, updateAdmin, resetPassword, toggleStatus, deleteAdmin,
  } = useAdminAccounts();

  const handleCreate = (values: addAdminFormValues): void => {
    createAdmin(values);
    toast('Admin account created successfully.');
  };

  const handleUpdate = (values: editAdminFormValues): void => {
    if (!selectedAdmin) return;
    updateAdmin(selectedAdmin.adminId, values);
    toast('Account changes saved successfully.');
  };

  const handleResetPassword = (): void => {
    if (!selectedAdmin) return;
    resetPassword(selectedAdmin.adminId);
    toast('Password reset successfully. Credentials updated.', 'success');
  };

  const handleToggleStatus = (adminId: number, isCurrentlyActive: boolean): void => {
    toggleStatus(adminId);
    toast(
      isCurrentlyActive ? 'Account has been deactivated.' : 'Account has been activated.',
      isCurrentlyActive ? 'warning' : 'success'
    );
  };

  const handleDelete = (): void => {
    if (!selectedAdmin) return;
    deleteAdmin(selectedAdmin.adminId);
    toast('Admin account permanently deleted.', 'error');
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
          <p className="text-sm text-slate-500">Manage hospital administrator access and credentials.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" className="hidden sm:flex gap-1.5">
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
          <Button size="sm" onClick={() => openModal('add')} className="gap-1.5">
            <UserPlus className="h-3.5 w-3.5" />
            Add Admin
          </Button>
        </div>
      </div>

      {/* Stats */}
      <AdminStatsCards
        total={totalCount}
        active={activeCount}
        inactive={inactiveCount}
        recent={recentCount}
      />

      {/* Toolbar */}
      <SearchToolbar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sortOption={sortOption}
        onSortChange={setSortOption}
        onRefresh={() => setSearch('')}
        totalFiltered={allFilteredCount}
      />

      {/* Desktop Table */}
      <div className="hidden md:block">
        <AdminTable
          admins={filtered}
          currentUsername={user?.username ?? ''}
          onView={(a) => openModal('view', a)}
          onEdit={(a) => openModal('edit', a)}
          onResetPassword={(a) => openModal('reset-password', a)}
          onToggleStatus={(a) => handleToggleStatus(a.adminId, a.isActive)}
          onDelete={(a) => openModal('delete', a)}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          totalFiltered={allFilteredCount}
          pageSize={pageSize}
        />
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden">
        <AdminCardListMobile
          admins={filtered}
          currentUsername={user?.username ?? ''}
          onView={(a) => openModal('view', a)}
          onEdit={(a) => openModal('edit', a)}
          onResetPassword={(a) => openModal('reset-password', a)}
          onToggleStatus={(a) => handleToggleStatus(a.adminId, a.isActive)}
          onDelete={(a) => openModal('delete', a)}
        />
      </div>

      {/* Modals */}
      <ViewAdminModal
        admin={selectedAdmin}
        open={modalMode === 'view'}
        onClose={closeModal}
        onEdit={() => { closeModal(); openModal('edit', selectedAdmin ?? undefined); }}
      />

      <AdminFormModal
        mode="add"
        open={modalMode === 'add'}
        onClose={closeModal}
        onSubmitAdd={handleCreate}
      />

      <AdminFormModal
        mode="edit"
        admin={selectedAdmin}
        open={modalMode === 'edit'}
        onClose={closeModal}
        onSubmitEdit={handleUpdate}
      />

      <ResetPasswordModal
        admin={selectedAdmin}
        open={modalMode === 'reset-password'}
        onClose={closeModal}
        onSubmit={handleResetPassword}
      />

      <DeleteConfirmDialog
        admin={selectedAdmin}
        open={modalMode === 'delete'}
        onClose={closeModal}
        onConfirm={handleDelete}
      />

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </div>
  );
};

export default AdminAccountsPage;
