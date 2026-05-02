import { useMemo, useState, type ReactElement } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/shared/context/AuthContext';
import { FilePlus } from 'lucide-react';
import { ReportsTab } from './components/ReportsTab';
import { HistoryTab } from './components/HistoryTab';
import { GenerateReportModal } from './components/GenerateReportModal';
import { ReportPreviewModal } from './components/ReportPreviewModal';
import { DeleteReportDialog } from './components/DeleteReportDialog';
import { useReports } from './hooks/useReports';
import {
  mockHistoryEvents,
  mockPatients,
} from './utils/mockReportData';
import type {
  ReportRecord,
  GenerateReportForm,
  HistoryEvent,
  PatientSummary,
  UserRole,
} from './types/report';
import { toast } from 'sonner';

const ReportsHistoryPage = (): ReactElement => {
  const [activeTab, setActiveTab] = useState<'reports' | 'history' | 'analytics'>('reports');
  const { user } = useAuth();
  const userRole = ((user?.role ?? 'ADMIN').toLowerCase() as UserRole);
  const {
    reports,
    filteredReports,
    stats,
    filters: reportFilters,
    patientOptions,
    generatedByOptions,
    reportTypeOptions,
    isGenerating,
    updateFilter: updateReportFilter,
    generateReport,
  } = useReports();
  const [historyEvents] = useState<HistoryEvent[]>(mockHistoryEvents);
  const [selectedReport, setSelectedReport] = useState<ReportRecord | null>(null);
  const [reportPreviewOpen, setReportPreviewOpen] = useState(false);
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientSummary | null>(mockPatients[0] ?? null);

  const [historyFilters, setHistoryFilters] = useState({
    search: '',
    dateFrom: '',
    dateTo: '',
    eventType: 'all',
  });

  const generatedByUserId = user?.id;

  const filteredHistory = useMemo(() => {
    return historyEvents
      .filter((event) => {
        const searchTerm = historyFilters.search.toLowerCase();
        const matchesSearch =
          event.patient_name.toLowerCase().includes(searchTerm) ||
          event.reference_id.toString().includes(searchTerm) ||
          event.description.toLowerCase().includes(searchTerm);
        if (!matchesSearch) return false;
        if (historyFilters.eventType !== 'all' && event.event_type !== historyFilters.eventType) return false;
        const eventDate = new Date(event.event_date);
        if (historyFilters.dateFrom && eventDate < new Date(historyFilters.dateFrom)) return false;
        if (historyFilters.dateTo && eventDate > new Date(historyFilters.dateTo)) return false;
        return true;
      })
      .sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime());
  }, [historyEvents, historyFilters]);

  const handleGenerateReport = async (data: GenerateReportForm) => {
    console.log("ds");
    
    if (!generatedByUserId) {
      toast.error('Cannot generate report because the current user ID is missing from the login response.');
      return;
    }

    try {
      const newReport = await generateReport(data, generatedByUserId);
      toast.success('Report generated successfully.');
      if (data.output_format === 'Print Preview') {
        setSelectedReport(newReport);
        setReportPreviewOpen(true);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate report.');
      throw error;
    }
  };

  const handleViewReport = (report: ReportRecord) => {
    setSelectedReport(report);
    setReportPreviewOpen(true);
  };

  const handleDownloadReport = (report: ReportRecord) => {
    const csv = `Report ID,Patient,Type,Created At,Summary\n${report.report_id},${report.patient_name ?? 'Operational'},${report.report_type},${report.created_at},"${report.summary}"`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `report_${report.report_id}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success('Export completed.');
  };

  const handlePrintReport = () => {
    toast.success('Print preview opened for secure report review.');
  };

  const handleRegenerateReport = (report: ReportRecord) => {
    if (!report.patient_id || !generatedByUserId) {
      toast.error('Cannot regenerate this report because required user or patient data is missing.');
      return;
    }

    generateReport(
      {
        patient_id: String(report.patient_id),
        report_type: report.report_type,
        output_format: 'Print Preview',
        summary: report.summary,
      },
      generatedByUserId,
    ).then((newReport) => {
      setSelectedReport(newReport);
      setReportPreviewOpen(true);
      toast.success(`Report #${newReport.report_id} regenerated successfully.`);
    }).catch((error: Error) => {
      toast.error(error.message || 'Failed to regenerate report.');
    });
  };

  const handleDeleteReport = () => {
    setDeleteDialogOpen(false);
    toast.warning('Delete is not available from the current reports API.');
  };

  const handleSelectPatient = (patientId: number) => {
    const patient = mockPatients.find((item) => item.patient_id === patientId) ?? selectedPatient;
    setSelectedPatient(patient ?? null);
    toast.success('History loaded for selected patient.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reports & History</h1>
          <p className="mt-2 max-w-2xl text-slate-600">Generate operational reports and review patient historical timelines.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={() => setGenerateModalOpen(true)}>
            <FilePlus className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {(['reports', 'history'] as const).map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab(tab)}
              className="capitalize"
            >
              {tab === 'reports' ? 'Reports' : 'Patient History'}
            </Button>
          ))}
        </div>
      </div>

      {activeTab === 'reports' && (
        <ReportsTab
          reports={reports}
          filteredReports={filteredReports}
          userRole={userRole}
          stats={stats}
          filters={reportFilters}
          reportTypes={reportTypeOptions}
          generatedByOptions={generatedByOptions}
          onSearchChange={(value) => updateReportFilter('search', value)}
          onDateFromChange={(value) => updateReportFilter('dateFrom', value)}
          onDateToChange={(value) => updateReportFilter('dateTo', value)}
          onReportTypeChange={(value) => updateReportFilter('reportType', value)}
          onGeneratedByChange={(value) => updateReportFilter('generatedBy', value)}
          onSortChange={(value) => updateReportFilter('sortBy', value)}
          onOpenGenerate={() => setGenerateModalOpen(true)}
          onView={handleViewReport}
          onDownload={handleDownloadReport}
          onPrint={handlePrintReport}
          onRegenerate={handleRegenerateReport}
          onDelete={(report) => {
            setSelectedReport(report);
            setDeleteDialogOpen(true);
          }}
        />
      )}

      {activeTab === 'history' && (
        <HistoryTab
          events={historyEvents}
          filteredEvents={filteredHistory}
          selectedPatient={selectedPatient}
          userRole={userRole}
          filters={historyFilters}
          onSearchChange={(value) => setHistoryFilters((prev) => ({ ...prev, search: value }))}
          onDateFromChange={(value) => setHistoryFilters((prev) => ({ ...prev, dateFrom: value }))}
          onDateToChange={(value) => setHistoryFilters((prev) => ({ ...prev, dateTo: value }))}
          onEventTypeChange={(value) => setHistoryFilters((prev) => ({ ...prev, eventType: value }))}
          onSelectPatient={handleSelectPatient}
        />
      )}

      <GenerateReportModal
        open={generateModalOpen}
        onClose={() => setGenerateModalOpen(false)}
        onSubmit={handleGenerateReport}
        patients={patientOptions}
        isSubmitting={isGenerating}
      />

      <ReportPreviewModal
        open={reportPreviewOpen}
        onClose={() => setReportPreviewOpen(false)}
        report={selectedReport}
        onDownload={handleDownloadReport}
        onPrint={handlePrintReport}
      />

      <DeleteReportDialog
        open={deleteDialogOpen}
        report={selectedReport}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteReport}
      />
    </div>
  );
};

export default ReportsHistoryPage;
