import { type ReactElement } from 'react';
import { UserPlus, Download, HeartPulse } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToastContainer, useToast } from '@/shared/hooks/useToast';
import { useNurseAccounts } from '@/features/nurseAccounts/hooks/useNurseAccounts';
import NurseStatsCards from '@/features/nurseAccounts/components/NurseStatsCards';
import NurseSearchToolbar from '@/features/nurseAccounts/components/NurseSearchToolbar';
import NurseTable from '@/features/nurseAccounts/components/NurseTable';
import NurseCardListMobile from '@/features/nurseAccounts/components/NurseCardListMobile';
import ViewNurseModal from '@/features/nurseAccounts/components/ViewNurseModal';
import NurseFormModal from '@/features/nurseAccounts/components/NurseFormModal';
import NurseResetPasswordModal from '@/features/nurseAccounts/components/NurseResetPasswordModal';
import NurseDeleteConfirmDialog from '@/features/nurseAccounts/components/NurseDeleteConfirmDialog';
import type { addNurseFormValues, editNurseFormValues } from '@/features/nurseAccounts/types/nurseAccount';

const NurseAccountsPage = (): ReactElement => {
  const { toasts, toast, dismiss } = useToast();
  const {
    filtered, totalCount, activeCount, inactiveCount, wardCount,
    allFilteredCount,
    page, pageSize, totalPages, setPage,
    search, setSearch,
    statusFilter, setStatusFilter,
    wardFilter, setWardFilter,
    sortOption, setSortOption,
    allWards,
    modalMode, selectedNurse, openModal, closeModal,
    createNurse, updateNurse, resetPassword, toggleStatus, deleteNurse,
  } = useNurseAccounts();

  const handleCreate = (values: addNurseFormValues): void => {
    createNurse(values);
    toast('Nurse account created successfully.');
  };

  const handleUpdate = (values: editNurseFormValues): void => {
    if (!selectedNurse) return;
    updateNurse(selectedNurse.nurse_id, values);
    toast('Nursing credentials updated successfully.');
  };

  const handleResetPassword = (): void => {
    if (!selectedNurse) return;
    resetPassword(selectedNurse.nurse_id);
    toast('Password reset successfully. Nursing credentials updated.');
  };

  const handleToggleStatus = (nurseId: number, isCurrentlyActive: boolean): void => {
    toggleStatus(nurseId);
    toast(
      isCurrentlyActive ? 'Operational access has been disabled.' : 'Operational access has been enabled.',
      isCurrentlyActive ? 'warning' : 'success'
    );
  };

  const handleDelete = (): void => {
    if (!selectedNurse) return;
    deleteNurse(selectedNurse.nurse_id);
    toast('Nurse account permanently deleted.', 'error');
  };

  const handleRefresh = (): void => {
    setSearch('');
    setWardFilter('all');
    setStatusFilter('all');
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
          <p className="text-sm text-slate-500">Manage nursing staff access, credentials, and ward assignments.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" className="hidden sm:flex gap-1.5">
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
          <Button size="sm" onClick={() => openModal('add')} className="gap-1.5 bg-violet-600 hover:bg-violet-700">
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
        onRefresh={handleRefresh}
        totalFiltered={allFilteredCount}
        wards={allWards}
      />

      {/* Desktop Table */}
      <div className="hidden md:block">
        <NurseTable
          nurses={filtered}
          onView={(n) => openModal('view', n)}
          onEdit={(n) => openModal('edit', n)}
          onResetPassword={(n) => openModal('reset-password', n)}
          onToggleStatus={(n) => handleToggleStatus(n.nurse_id, n.is_active)}
          onDelete={(n) => openModal('delete', n)}
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
          onView={(n) => openModal('view', n)}
          onEdit={(n) => openModal('edit', n)}
          onResetPassword={(n) => openModal('reset-password', n)}
          onToggleStatus={(n) => handleToggleStatus(n.nurse_id, n.is_active)}
          onDelete={(n) => openModal('delete', n)}
        />
      </div>

      {/* Modals */}
      <ViewNurseModal
        nurse={selectedNurse}
        open={modalMode === 'view'}
        onClose={closeModal}
        onEdit={() => { closeModal(); openModal('edit', selectedNurse ?? undefined); }}
      />

      <NurseFormModal
        mode="add"
        open={modalMode === 'add'}
        onClose={closeModal}
        onSubmitAdd={handleCreate}
      />

      <NurseFormModal
        mode="edit"
        nurse={selectedNurse}
        open={modalMode === 'edit'}
        onClose={closeModal}
        onSubmitEdit={handleUpdate}
      />

      <NurseResetPasswordModal
        nurse={selectedNurse}
        open={modalMode === 'reset-password'}
        onClose={closeModal}
        onSubmit={handleResetPassword}
      />

      <NurseDeleteConfirmDialog
        nurse={selectedNurse}
        open={modalMode === 'delete'}
        onClose={closeModal}
        onConfirm={handleDelete}
      />

      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </div>
  );
};

export default NurseAccountsPage;
