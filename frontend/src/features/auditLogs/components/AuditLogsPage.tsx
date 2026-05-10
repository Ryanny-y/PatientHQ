import { type ReactElement } from 'react';
import { FileText, FileBarChart, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/shared/hooks/useToast';
import { useAuditLogs } from '@/features/auditLogs/hooks/useAuditLogs';
import AuditStatsCards from '@/features/auditLogs/components/AuditStatsCards';
import AuditFilterToolbar from '@/features/auditLogs/components/AuditFilterToolbar';
import AuditLogsTable from '@/features/auditLogs/components/AuditLogsTable';
import AuditLogCardListMobile from '@/features/auditLogs/components/AuditLogCardListMobile';
import AuditDetailDrawer from '@/features/auditLogs/components/AuditDetailDrawer';
import SecurityAlertsPanel from '@/features/auditLogs/components/SecurityAlertsPanel';
import AuditChartsSection from '@/features/auditLogs/components/AuditChartsSection';

const AuditLogsPage = (): ReactElement => {
  const { toast } = useToast();
  const {
    filtered, allFilteredCount, totalLogsToday, failedLoginAttempts, criticalActions, activeUsersToday,
    isLoading, errorMessage,
    page, pageSize, totalPages, setPage,
    search, setSearch, dateRange, setDateRange, roleFilter, setRoleFilter,
    entityTypeFilter, setEntityTypeFilter, severityFilter, setSeverityFilter,
    ipSearch, setIpSearch, sortOption, setSortOption, autoRefresh, setAutoRefresh,
    modalMode, selectedLog, openModal, closeModal, refreshLogs, flagEvent,
  } = useAuditLogs();

  const handleViewDetails = (log: any) => {
    openModal('view-details', log);
  };

  const handleFlagEvent = (log: any) => {
    flagEvent(log.log_id);
    toast('Event flagged for review.', 'warning');
  };

  const handleRefresh = () => {
    refreshLogs();
    toast('Audit logs refreshed successfully.');
  };

  const handleGenerateReport = () => {
    toast('Compliance report generation started. This may take a few minutes.');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">Audit Logs</h2>
          </div>
          <p className="text-sm text-slate-500">
            Track user activity, access attempts, and critical system actions.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" className="hidden sm:flex gap-1.5" onClick={handleGenerateReport}>
            <FileBarChart className="h-3.5 w-3.5" />
            Compliance Report
          </Button>
          <Button size="sm" onClick={handleRefresh} className="gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" />
            Refresh Live Feed
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <AuditStatsCards
        totalLogsToday={totalLogsToday}
        failedLoginAttempts={failedLoginAttempts}
        criticalActions={criticalActions}
        activeUsersToday={activeUsersToday}
      />

      {/* Filter Toolbar */}
      <AuditFilterToolbar
        search={search}
        onSearchChange={setSearch}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        roleFilter={roleFilter}
        onRoleChange={setRoleFilter}
        entityTypeFilter={entityTypeFilter}
        onEntityTypeChange={setEntityTypeFilter}
        severityFilter={severityFilter}
        onSeverityChange={setSeverityFilter}
        ipSearch={ipSearch}
        onIpSearchChange={setIpSearch}
        sortOption={sortOption}
        onSortChange={setSortOption}
        autoRefresh={autoRefresh}
        onAutoRefreshChange={setAutoRefresh}
        onRefresh={handleRefresh}
        totalFiltered={allFilteredCount}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Table/Cards - Takes 3 columns on xl */}
        <div className="xl:col-span-3">
          {errorMessage && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {errorMessage}
            </div>
          )}
          {isLoading && (
            <div className="mb-4 rounded-xl border border-slate-100 bg-white p-4 text-sm text-slate-500">
              Loading audit logs...
            </div>
          )}
          {/* Desktop Table */}
          <div className="hidden md:block">
            <AuditLogsTable
              logs={filtered}
              onViewDetails={handleViewDetails}
              onFlagEvent={handleFlagEvent}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              totalFiltered={allFilteredCount}
              pageSize={pageSize}
            />
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden">
            <AuditLogCardListMobile
              logs={filtered}
              onViewDetails={handleViewDetails}
              onFlagEvent={handleFlagEvent}
            />
          </div>
        </div>

        {/* Sidebar - Takes 1 column on xl */}
        <div className="xl:col-span-1 space-y-6">
          <SecurityAlertsPanel logs={filtered} />
        </div>
      </div>

      {/* Analytics Section */}
      <AuditChartsSection logs={filtered} />

      {/* Modals/Drawers */}
      <AuditDetailDrawer
        log={selectedLog}
        open={modalMode === 'view-details'}
        onClose={closeModal}
      />
    </div>
  );
};

export default AuditLogsPage;
