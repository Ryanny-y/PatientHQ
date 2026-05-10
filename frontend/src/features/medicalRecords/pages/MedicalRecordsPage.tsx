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

const escapeHtml = (value: string | undefined): string =>
  (value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const MedicalRecordsPage = (): ReactElement => {
  const [currentUserId] = useState<string>("1"); // Mock current user ID
  const { can } = usePermissions();
  const canCreateRecord = can(PERMISSIONS.MEDICAL_RECORD_CREATE);
  const canEditRecord = can(PERMISSIONS.MEDICAL_RECORD_UPDATE);

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
    const printWindow = window.open("", "_blank", "width=900,height=700");

    if (!printWindow) {
      toast("Unable to open print preview. Please allow pop-ups and try again.", "error");
      return;
    }

    const createdAt = new Date(record.createdAt).toLocaleString();
    const updatedAt = record.lastUpdated
      ? new Date(record.lastUpdated).toLocaleString()
      : "Not updated";

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>Clinical Summary ${escapeHtml(record.recordId)}</title>
          <style>
            body { font-family: Arial, sans-serif; color: #0f172a; margin: 32px; line-height: 1.5; }
            header { border-bottom: 2px solid #e2e8f0; margin-bottom: 24px; padding-bottom: 16px; }
            h1 { font-size: 24px; margin: 0 0 4px; }
            h2 { font-size: 16px; margin: 24px 0 8px; color: #334155; }
            .meta { color: #64748b; font-size: 13px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 24px; }
            .label { color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: .04em; }
            .value { font-weight: 600; margin-top: 2px; }
            .box { border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; white-space: pre-wrap; }
            @media print { body { margin: 20mm; } button { display: none; } }
          </style>
        </head>
        <body>
          <header>
            <h1>Clinical Summary</h1>
            <div class="meta">Medical Record #${escapeHtml(record.recordId)}</div>
          </header>

          <section class="grid">
            <div><div class="label">Patient</div><div class="value">${escapeHtml(record.patientName || "Unknown Patient")}</div></div>
            <div><div class="label">Patient ID</div><div class="value">${escapeHtml(record.patientId)}</div></div>
            <div><div class="label">Doctor</div><div class="value">${escapeHtml(record.doctorName || "Unknown Doctor")}</div></div>
            <div><div class="label">Status</div><div class="value">${escapeHtml(record.patientStatus || "Active")}</div></div>
            <div><div class="label">Created</div><div class="value">${escapeHtml(createdAt)}</div></div>
            <div><div class="label">Last Updated</div><div class="value">${escapeHtml(updatedAt)}</div></div>
          </section>

          <h2>Diagnosis</h2>
          <div class="box">${escapeHtml(record.diagnosis)}</div>

          <h2>Treatment</h2>
          <div class="box">${escapeHtml(record.treatment)}</div>

          <h2>Prescription</h2>
          <div class="box">${escapeHtml(record.prescription || "No prescription recorded.")}</div>

          <h2>Clinical Notes</h2>
          <div class="box">${escapeHtml(record.notes || "No notes recorded.")}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    toast(`Print preview opened for Record #${record.recordId.slice(-8)}.`, "success");
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
          onArchiveRecord={handleArchiveRecord}
          canEditRecord={canEditRecord}
        />
      </div>

      <div className="lg:hidden">
        <MedicalRecordCardListMobile
          records={filteredRecords}
          onViewRecord={handleViewRecord}
          onEditRecord={handleEditRecord}
          onPrintRecord={handlePrintRecord}
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
