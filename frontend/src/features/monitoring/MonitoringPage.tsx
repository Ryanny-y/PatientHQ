import { type ReactElement } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast, ToastContainer } from '@/shared/hooks/useToast';
import { useVitalSigns } from './hooks/useVitalSigns';
import { usePatientQuery } from '@/features/patients/hooks/usePatientQuery';
import VitalSignsStatsCards from './components/VitalSignsStatsCards';
import VitalSignsFilterToolbar from './components/VitalSignsFilterToolbar';
import VitalSignsTable from './components/VitalSignsTable';
import VitalSignsCardListMobile from './components/VitalSignsCardListMobile';
import {
  ViewVitalSignsDrawer,
  VitalSignsFormModal,
  DeleteVitalSignsDialog,
} from './components/VitalSignsModals';
import type { addVitalSignsFormValues } from './types/vitalSigns';
import { PERMISSIONS, usePermissions } from '@/shared/security/permissions';
import { useAuth } from '@/shared/context/AuthContext';

const MonitoringPage = (): ReactElement => {
  const { toasts, toast, dismiss } = useToast();
  const { can } = usePermissions();
  const { user } = useAuth();
  const canCreateVitals = user?.role === 'NURSE' && can(PERMISSIONS.VITAL_SIGNS_CREATE);

  const {
    data,
    meta,
    isLoading,
    page,
    totalPages,
    setPage,
    refetch,
    search,
    setSearch,
    dateFilter,
    setDateFilter,
    sortBy,
    setSortBy,
    modalMode,
    selectedVital,
    openModal,
    closeModal,
    createVitalSigns,
    updateVitalSigns,
    deleteVitalSigns,
  } = useVitalSigns();

  // Fetch all active patients for the form dropdown
  const { data: patientsResponse } = usePatientQuery({ page: 0, size: 200 });
  const patients = patientsResponse?.data?.content ?? [];

  const handleSubmit = async (values: addVitalSignsFormValues): Promise<void> => {
    try {
      if (modalMode === 'edit' && selectedVital) {
        await updateVitalSigns(selectedVital.vitalId, values);
        toast('Vital signs updated successfully');
      } else {
        await createVitalSigns(values);
        toast('Vital signs recorded successfully');
      }
      closeModal();
    } catch {
      toast('Failed to save vital signs', 'error');
    }
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (!selectedVital) return;
    try {
      await deleteVitalSigns(selectedVital.vitalId);
      toast('Record deleted');
      closeModal();
    } catch {
      toast('Failed to delete record', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Monitoring</h1>
          <p className="mt-2 text-sm text-slate-500">
            Track and manage patient vital signs and health measurements.
          </p>
        </div>
        {canCreateVitals && (
          <Button onClick={() => openModal('add')}>
            <Plus className="mr-2 h-4 w-4" />
            Record Vitals
          </Button>
        )}
      </div>

      <VitalSignsStatsCards meta={meta?.data} />

      <VitalSignsFilterToolbar
        search={search}
        onSearchChange={setSearch}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        onRefresh={() => { refetch(); toast('Records refreshed'); }}
      />

      {isLoading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          Loading vital signs...
        </div>
      ) : (
        <>
          <div className="hidden lg:block">
            <VitalSignsTable
              vitalSigns={data}
              onView={(v) => openModal('view', v)}
              onEdit={(v) => openModal('edit', v)}
              onDelete={(v) => openModal('delete', v)}
              canModify={false}
            />
          </div>
          <div className="lg:hidden">
            <VitalSignsCardListMobile
              vitalSigns={data}
              onView={(v) => openModal('view', v)}
              onEdit={(v) => openModal('edit', v)}
              onDelete={(v) => openModal('delete', v)}
              canModify={false}
            />
          </div>
        </>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}

      <ViewVitalSignsDrawer
        open={modalMode === 'view'}
        onOpenChange={(open) => { if (!open) closeModal(); }}
        vital={selectedVital}
      />
      {canCreateVitals && (
        <VitalSignsFormModal
          open={modalMode === 'add' || modalMode === 'edit'}
          onOpenChange={(open) => { if (!open) closeModal(); }}
          vital={modalMode === 'edit' ? selectedVital : null}
          patients={patients}
          onSubmit={handleSubmit}
        />
      )}
      <DeleteVitalSignsDialog
        open={modalMode === 'delete'}
        onOpenChange={(open) => { if (!open) closeModal(); }}
        vital={selectedVital}
        onConfirm={handleConfirmDelete}
      />

      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </div>
  );
};

export default MonitoringPage;
