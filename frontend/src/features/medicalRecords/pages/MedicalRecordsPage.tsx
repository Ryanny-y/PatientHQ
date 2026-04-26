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
import {
  mockMedicalRecords,
  mockMedicalRecordStats,
  mockPatients,
  mockDoctors,
} from "../utils/mockMedicalData";
import type {
  MedicalRecord,
  UserRole,
  FilterOptions,
  MedicalRecordFormData,
} from "../types/medicalRecord";

const MedicalRecordsPage = (): ReactElement => {
  // Mock user role - in real app this would come from auth context
  const [userRole] = useState<UserRole>("admin"); // Change to 'doctor' or 'nurse' to test RBAC
  const [currentUserId] = useState<number>(1); // Mock current user ID

  const [records, setRecords] = useState<MedicalRecord[]>(mockMedicalRecords);
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    dateRange: { from: null, to: null },
    doctor: "all",
    patientStatus: "all",
    sortBy: "newest",
  });

  // Modal and drawer states
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(
    null,
  );

  const { toast } = useToast();

  // Filter and sort records
  const filteredRecords = useMemo(() => {
    let filtered = records.filter((record) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matches =
          record.record_id.toString().includes(searchLower) ||
          record.patient_name.toLowerCase().includes(searchLower) ||
          record.diagnosis.toLowerCase().includes(searchLower) ||
          record.doctor_name.toLowerCase().includes(searchLower);
        if (!matches) return false;
      }

      // Date range filter
      if (filters.dateRange.from || filters.dateRange.to) {
        const recordDate = new Date(record.created_at);
        if (filters.dateRange.from && recordDate < filters.dateRange.from)
          return false;
        if (filters.dateRange.to && recordDate > filters.dateRange.to)
          return false;
      }

      // Doctor filter
      if (filters.doctor && filters.doctor !== "all" && record.doctor_id.toString() !== filters.doctor)
        return false;

      // Patient status filter
      if (
        filters.patientStatus &&
        filters.patientStatus !== "all" &&
        record.patient_status !== filters.patientStatus
      )
        return false;

      return true;
    });

    // Sort records
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "newest":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "oldest":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case "patient_name":
          return a.patient_name.localeCompare(b.patient_name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [records, filters]);

  // Event handlers
  const handleRefresh = () => {
    // Mock refresh - in real app would refetch data
    toast("Medical records have been updated.", "success");
  };

  const handleViewRecord = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setViewDrawerOpen(true);
  };

  const handleEditRecord = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setEditModalOpen(true);
  };

  const handleAddRecord = () => {
    setAddModalOpen(true);
  };

  const handlePrintRecord = (record: MedicalRecord) => {
    toast(
      `Printing clinical summary for Record #${record.record_id}`,
      "success",
    );
  };

  const handleGenerateReport = (record: MedicalRecord) => {
    toast(
      `Patient report for ${record.patient_name} has been generated.`,
      "success",
    );
  };

  const handleArchiveRecord = (record: MedicalRecord) => {
    // Mock archive - in real app would call API
    setRecords((prev) => prev.filter((r) => r.record_id !== record.record_id));
    toast(`Medical Record #${record.record_id} has been archived.`, "warning");
  };

  const handleCreateRecord = (data: MedicalRecordFormData) => {
    const newRecord: MedicalRecord = {
      record_id: Math.max(...records.map((r) => r.record_id)) + 1,
      patient_id: data.patient_id,
      patient_name:
        mockPatients.find((p) => p.id === data.patient_id)?.name ||
        "Unknown Patient",
      doctor_id: data.doctor_id,
      doctor_name:
        mockDoctors.find((d) => d.id === data.doctor_id)?.name ||
        "Unknown Doctor",
      diagnosis: data.diagnosis,
      treatment: data.treatment,
      prescription: data.prescription || "",
      notes: data.notes || "",
      created_at: new Date().toISOString().split("T")[0],
      last_updated: new Date().toISOString().split("T")[0],
      patient_status:
        (mockPatients.find((p) => p.id === data.patient_id)?.status as any) ||
        "Active",
    };

    setRecords((prev) => [newRecord, ...prev]);
    toast("Medical record has been successfully created.", "success");
  };

  const handleUpdateRecord = (
    recordId: number,
    data: Partial<MedicalRecord>,
  ) => {
    setRecords((prev) =>
      prev.map((record) =>
        record.record_id === recordId
          ? {
              ...record,
              ...data,
              last_updated: new Date().toISOString().split("T")[0],
            }
          : record,
      ),
    );
    toast("Medical record has been successfully updated.", "success");
  };

  const canAddRecords = userRole === "admin" || userRole === "doctor";

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
          {canAddRecords && (
            <Button onClick={handleAddRecord}>
              <Plus className="h-4 w-4 mr-2" />
              Add Record
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <MedicalRecordStatsCards stats={mockMedicalRecordStats} />

      {/* Filter Toolbar */}
      <MedicalRecordFilterToolbar
        filters={filters}
        onFiltersChange={setFilters}
        onRefresh={handleRefresh}
        doctors={mockDoctors}
      />

      {/* Records Display */}
      <div className="hidden lg:block">
        <MedicalRecordsTable
          records={filteredRecords}
          userRole={userRole}
          onViewRecord={handleViewRecord}
          onEditRecord={handleEditRecord}
          onPrintRecord={handlePrintRecord}
          onGenerateReport={handleGenerateReport}
          onArchiveRecord={handleArchiveRecord}
        />
      </div>

      <div className="lg:hidden">
        <MedicalRecordCardListMobile
          records={filteredRecords}
          userRole={userRole}
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
            Showing {filteredRecords.length} of {records.length} records
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Modals and Drawers */}
      <ViewMedicalRecordDrawer
        record={selectedRecord}
        open={viewDrawerOpen}
        onClose={() => setViewDrawerOpen(false)}
        onPrint={handlePrintRecord}
        onGenerateReport={handleGenerateReport}
      />

      <MedicalRecordFormModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleCreateRecord}
        patients={mockPatients}
        doctors={mockDoctors}
        userRole={userRole}
        currentUserId={currentUserId}
      />

      <EditMedicalRecordModal
        record={selectedRecord}
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleUpdateRecord}
      />
    </div>
  );
};

export default MedicalRecordsPage;
