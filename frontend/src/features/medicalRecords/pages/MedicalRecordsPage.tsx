import { useState, useMemo, type ReactElement } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/shared/hooks/useToast";
import { Plus, Download } from "lucide-react";
import { MedicalRecordStatsCards } from "../components/MedicalRecordStatsCards";
import { MedicalRecordFilterToolbar } from "../components/MedicalRecordFilterToolbar";
import { MedicalRecordsTable } from "../components/MedicalRecordsTable";
import { MedicalRecordCardListMobile } from "../components/MedicalRecordCardListMobile";
import { ViewMedicalRecordDrawer } from "../components/ViewMedicalRecordDrawer";
import { MedicalRecordFormModal } from "../components/MedicalRecordFormModal";
import { EditMedicalRecordModal } from "../components/EditMedicalRecordModal";
import { useMedicalRecords } from "../hooks/useMedicalRecords";
import type {
  MedicalRecord,
  FilterOptions,
} from "../types/medicalRecord";
import { PERMISSIONS, usePermissions } from "@/shared/security/permissions";

const PAGE_SIZE = 10;

const MedicalRecordsPage = (): ReactElement => {
  const [currentUserId] = useState<string>("1"); // Mock current user ID
  const { can } = usePermissions();
  const canCreateRecord = can(PERMISSIONS.MEDICAL_RECORD_CREATE);
  const canEditRecord = can(PERMISSIONS.MEDICAL_RECORD_UPDATE);
  const canGenerateReport = can(PERMISSIONS.REPORT_GENERATE);

  const {
    meta,
    records,
    totalRecords,
    currentPage,
    patients,
    doctors,
    modalMode,
    selectedRecord,
    setPage,
    setModalMode,
    handleCreateRecord,
    handleUpdateRecord,
    handleDeleteRecord,
    handleViewRecord,
    handleEditRecord,
    handleAddRecord,
    handleRefresh,
  } = useMedicalRecords();

  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    dateRange: { from: null, to: null },
    doctor: "all",
    patientStatus: "all",
    sortBy: "newest",
  });

  const { toast } = useToast();

  // Filter and sort records (client-side filtering for now)
  const filteredRecords = useMemo(() => {
    const filtered = records.filter((record) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matches =
          record.recordId.toLowerCase().includes(searchLower) ||
          record.diagnosis.toLowerCase().includes(searchLower) ||
          record.patientName?.toLowerCase().includes(searchLower) ||
          record.doctorName?.toLowerCase().includes(searchLower);
        if (!matches) return false;
      }

      // Date range filter
      if (filters.dateRange.from || filters.dateRange.to) {
        const recordDate = new Date(record.createdAt);
        if (filters.dateRange.from && recordDate < filters.dateRange.from)
          return false;
        if (filters.dateRange.to && recordDate > filters.dateRange.to)
          return false;
      }

      // Doctor filter
      if (filters.doctor && filters.doctor !== "all" && record.doctorId !== filters.doctor)
        return false;

      // Patient status filter
      if (
        filters.patientStatus &&
        filters.patientStatus !== "all" &&
        record.patientStatus !== filters.patientStatus
      )
        return false;

      return true;
    });

    // Sort records
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "patient_name":
          return (a.patientName || "").localeCompare(b.patientName || "");
        default:
          return 0;
      }
    });

    return filtered;
  }, [records, filters]);

  // Event handlers
  const handlePrintRecord = (record: MedicalRecord) => {
    toast(
      `Printing clinical summary for Record #${record.recordId}`,
      "success",
    );
  };

  const handleGenerateReport = (record: MedicalRecord) => {
    toast(
      `Patient report for ${record.patientName || 'Patient'} has been generated.`,
      "success",
    );
  };

  const handleArchiveRecord = (record: MedicalRecord) => {
    // Mock archive - in real app would call API
    handleDeleteRecord(record.recordId);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Medical Records</h1>
          <p className="text-slate-600 mt-1">
            Review and manage patient clinical documentation securely.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
            {canCreateRecord && (
              <Button onClick={handleAddRecord}>
                <Plus className="h-4 w-4 mr-2" />
                Add Record
              </Button>
            )}
        </div>
      </div>

      {/* Stats Cards */}
      <MedicalRecordStatsCards meta={meta?.data} />

      {/* Filter Toolbar */}
      <MedicalRecordFilterToolbar
        filters={filters}
        onFiltersChange={setFilters}
        onRefresh={handleRefresh}
        doctors={doctors}
      />

      {/* Records Display */}
      <div className="hidden lg:block">
        <MedicalRecordsTable
          records={filteredRecords}
          onViewRecord={handleViewRecord}
          onEditRecord={handleEditRecord}
          onPrintRecord={handlePrintRecord}
          onGenerateReport={handleGenerateReport}
          onArchiveRecord={handleArchiveRecord}
          canEditRecord={canEditRecord}
          canGenerateReport={canGenerateReport}
        />
      </div>

      <div className="lg:hidden">
        <MedicalRecordCardListMobile
          records={filteredRecords}
          onViewRecord={handleViewRecord}
          onEditRecord={handleEditRecord}
          onPrintRecord={handlePrintRecord}
          onGenerateReport={handleGenerateReport}
          onArchiveRecord={handleArchiveRecord}
        />
      </div>

      {/* Pagination would go here */}
      {filteredRecords.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Showing {filteredRecords.length} of {totalRecords} records
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage * PAGE_SIZE >= totalRecords}
              onClick={() => setPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Modals and Drawers */}
      <ViewMedicalRecordDrawer
        record={selectedRecord}
        open={modalMode === 'view'}
        onClose={() => setModalMode(null)}
        onPrint={handlePrintRecord}
        onGenerateReport={handleGenerateReport}
      />

      {canCreateRecord && (
        <MedicalRecordFormModal
          open={modalMode === 'add'}
          onClose={() => setModalMode(null)}
          onSubmit={handleCreateRecord}
          patients={patients}
          doctors={doctors}
          currentUserId={currentUserId}
        />
      )}

      {canEditRecord && (
        <EditMedicalRecordModal
          record={selectedRecord}
          open={modalMode === 'edit'}
          onClose={() => setModalMode(null)}
          onSubmit={(recordId, data) => handleUpdateRecord(recordId, data)}
        />
      )}
    </div>
  );
};

export default MedicalRecordsPage;
