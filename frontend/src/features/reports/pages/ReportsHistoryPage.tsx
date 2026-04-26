import { useMemo, useState, type ReactElement } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/shared/hooks/useToast';
import { Download, Printer, FilePlus } from 'lucide-react';
import { RoleStateSwitcher } from '../components/RoleStateSwitcher';
import { ReportsTab } from '../components/ReportsTab';
import { HistoryTab } from '../components/HistoryTab';
import { AnalyticsTab } from '../components/AnalyticsTab';
import { GenerateReportModal } from '../components/GenerateReportModal';
import { ReportPreviewModal } from '../components/ReportPreviewModal';
import { DeleteReportDialog } from '../components/DeleteReportDialog';
import {
  mockReports,
  mockHistoryEvents,
  mockPatients,
  mockReportStats,
  mockAnalytics,
  reportTypes,
} from '../utils/mockReportData';
import type {
  ReportRecord,
  GenerateReportForm,
  HistoryEvent,
  PatientSummary,
  UserRole,
} from '../types/report';

const ReportsHistoryPage = (): ReactElement => {
  const [activeTab, setActiveTab] = useState<'reports' | 'history' | 'analytics'>('reports');
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [reports, setReports] = useState<ReportRecord[]>(mockReports);
  const [historyEvents] = useState<HistoryEvent[]>(mockHistoryEvents);
  const [selectedReport, setSelectedReport] = useState<ReportRecord | null>(null);
  const [reportPreviewOpen, setReportPreviewOpen] = useState(false);
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientSummary | null>(mockPatients[0] ?? null);

  const [reportFilters, setReportFilters] = useState({
    search: '',
    dateFrom: '',
    dateTo: '',
    reportType: 'all',
    generatedBy: 'all',
    sortBy: 'newest' as 'newest' | 'oldest',
  });

  const [historyFilters, setHistoryFilters] = useState({
    search: '',
    dateFrom: '',
    dateTo: '',
    eventType: 'all',
  });

  const toast = useToast().toast;

  const userName = userRole === 'doctor' ? 'Dr. Antonio Garcia' : userRole === 'nurse' ? 'Nurse Carla Mendoza' : 'Clinical Operations';

  const filteredReports = useMemo(() => {
    const filtered = reports.filter((report) => {
      const searchTerm = reportFilters.search.toLowerCase();
      const matchesSearch =
        report.report_id.toString().includes(searchTerm) ||
        report.patient_name?.toLowerCase().includes(searchTerm) ||
        report.report_type.toLowerCase().includes(searchTerm);
      if (!matchesSearch) return false;

      const createdAt = new Date(report.created_at);
      if (reportFilters.dateFrom && createdAt < new Date(reportFilters.dateFrom)) return false;
      if (reportFilters.dateTo && createdAt > new Date(reportFilters.dateTo)) return false;
      if (reportFilters.reportType !== 'all' && report.report_type !== reportFilters.reportType) return false;
      if (reportFilters.generatedBy !== 'all' && report.generated_by !== reportFilters.generatedBy) return false;

      return true;
    });

    return filtered.sort((a, b) => {
      if (reportFilters.sortBy === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });
  }, [reports, reportFilters]);

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

  const handleGenerateReport = (data: GenerateReportForm) => {
    const nextId = Math.max(...reports.map((item) => item.report_id), 9000) + 1;
    const patient = mockPatients.find((item) => item.patient_id === data.patient_id);
    const newReport: ReportRecord = {
      report_id: nextId,
      patient_id: data.patient_id,
      patient_name: patient?.full_name,
      generated_by: userName,
      report_type: data.report_type as ReportRecord['report_type'],
      summary: `${data.report_type} created for ${patient?.full_name ?? 'system overview'} with notes ${data.include_notes ? 'included' : 'disabled'}.`,
      created_at: new Date().toISOString().split('T')[0],
    };
    setReports((prev) => [newReport, ...prev]);
    toast('Report generated successfully.', 'success');
    if (data.output_format === 'Print Preview') {
      setSelectedReport(newReport);
      setReportPreviewOpen(true);
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
    toast('Export completed.', 'success');
  };

  const handlePrintReport = (_report: ReportRecord) => {
    toast('Print preview opened for secure report review.', 'success');
  };

  const handleRegenerateReport = (report: ReportRecord) => {
    toast(`Report #${report.report_id} regenerated successfully.`, 'success');
  };

  const handleDeleteReport = (reportId: number) => {
    setReports((prev) => prev.filter((report) => report.report_id !== reportId));
    setDeleteDialogOpen(false);
    toast('Report deleted.', 'warning');
  };

  const handleSelectPatient = (patientId: number) => {
    const patient = mockPatients.find((item) => item.patient_id === patientId) ?? selectedPatient;
    setSelectedPatient(patient ?? null);
    toast('History loaded for selected patient.', 'success');
  };

  const generateByOptions = Array.from(new Set(['all', ...reports.map((report) => report.generated_by)])).map((value) => ({ label: value, value }));

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
          <Button variant="outline" onClick={() => toast('Confidential export completed.', 'success')}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" onClick={() => toast('Print command submitted for hospital reports.', 'success')}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      <RoleStateSwitcher currentRole={userRole} onRoleChange={setUserRole} />

      <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {(['reports', 'history', 'analytics'] as const).map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab(tab)}
              className="capitalize"
            >
              {tab === 'reports' ? 'Reports' : tab === 'history' ? 'Patient History' : 'Analytics Overview'}
            </Button>
          ))}
        </div>
      </div>

      {activeTab === 'reports' && (
        <ReportsTab
          reports={reports}
          filteredReports={filteredReports}
          userRole={userRole}
          stats={mockReportStats}
          filters={reportFilters}
          reportTypes={reportTypes.map((type) => ({ label: type, value: type }))}
          generatedByOptions={generateByOptions}
          onSearchChange={(value) => setReportFilters((prev) => ({ ...prev, search: value }))}
          onDateFromChange={(value) => setReportFilters((prev) => ({ ...prev, dateFrom: value }))}
          onDateToChange={(value) => setReportFilters((prev) => ({ ...prev, dateTo: value }))}
          onReportTypeChange={(value) => setReportFilters((prev) => ({ ...prev, reportType: value }))}
          onGeneratedByChange={(value) => setReportFilters((prev) => ({ ...prev, generatedBy: value }))}
          onSortChange={(value) => setReportFilters((prev) => ({ ...prev, sortBy: value }))}
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

      {activeTab === 'analytics' && (
        <AnalyticsTab userRole={userRole} analyticsData={mockAnalytics} />
      )}

      <GenerateReportModal
        open={generateModalOpen}
        onClose={() => setGenerateModalOpen(false)}
        onSubmit={handleGenerateReport}
        patients={mockPatients.map((patient) => ({ id: patient.patient_id, full_name: patient.full_name }))}
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
