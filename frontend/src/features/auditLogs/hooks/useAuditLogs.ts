import { useState } from 'react';
import { useAuditLogMetaQuery, useAuditLogQuery } from '@/features/auditLogs/hooks/useAuditLogQuery';
import type {
  AuditLog,
  modalMode,
  roleFilter,
  entityTypeFilter,
  severityFilter,
  sortOption,
  DateRange,
} from '@/features/auditLogs/types/auditLog';

interface useAuditLogsReturn {
  // data
  filtered: AuditLog[];
  allFilteredCount: number;
  totalLogsToday: number;
  failedLoginAttempts: number;
  criticalActions: number;
  activeUsersToday: number;
  isLoading: boolean;
  errorMessage: string | null;
  // pagination
  page: number;
  pageSize: number;
  totalPages: number;
  setPage: (p: number) => void;
  // filters
  search: string;
  setSearch: (v: string) => void;
  dateRange: DateRange;
  setDateRange: (v: DateRange) => void;
  roleFilter: roleFilter;
  setRoleFilter: (v: roleFilter) => void;
  entityTypeFilter: entityTypeFilter;
  setEntityTypeFilter: (v: entityTypeFilter) => void;
  severityFilter: severityFilter;
  setSeverityFilter: (v: severityFilter) => void;
  ipSearch: string;
  setIpSearch: (v: string) => void;
  sortOption: sortOption;
  setSortOption: (v: sortOption) => void;
  autoRefresh: boolean;
  setAutoRefresh: (v: boolean) => void;
  // modal
  modalMode: modalMode;
  selectedLog: AuditLog | null;
  openModal: (mode: modalMode, log?: AuditLog) => void;
  closeModal: () => void;
  // actions
  refreshLogs: () => void;
  flagEvent: (logId: string) => void;
}

const PAGE_SIZE = 10;

const toDateParam = (date: Date | undefined): string | undefined =>
  date ? date.toISOString().split('T')[0] : undefined;

export const useAuditLogs = (): useAuditLogsReturn => {
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [roleFilter, setRoleFilter] = useState<roleFilter>('All');
  const [entityTypeFilter, setEntityTypeFilter] = useState<entityTypeFilter>('All');
  const [severityFilter, setSeverityFilter] = useState<severityFilter>('All');
  const [ipSearch, setIpSearch] = useState('');
  const [sortOption, setSortOption] = useState<sortOption>('newest');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [page, setPage] = useState(1);
  const [modalMode, setModalMode] = useState<modalMode>(null);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const { data, error, isLoading, refetch } = useAuditLogQuery({
    page: page - 1,
    size: PAGE_SIZE,
    search: search.trim() || undefined,
    role: roleFilter === 'All' ? undefined : roleFilter,
    entityType: entityTypeFilter === 'All' ? undefined : entityTypeFilter,
    severity: severityFilter === 'All' ? undefined : severityFilter,
    ipAddress: ipSearch.trim() || undefined,
    dateFrom: toDateParam(dateRange.from),
    dateTo: toDateParam(dateRange.to),
    sort: sortOption === 'newest' ? 'createdAt,desc' : 'createdAt,asc',
    autoRefresh,
  });
  const { data: metaData, error: metaError, refetch: refetchMeta } = useAuditLogMetaQuery(autoRefresh);

  // Reset to page 1 whenever filters change
  const handleSetSearch = (v: string): void => { setSearch(v); setPage(1); };
  const handleSetDateRange = (v: DateRange): void => { setDateRange(v); setPage(1); };
  const handleSetRole = (v: roleFilter): void => { setRoleFilter(v); setPage(1); };
  const handleSetEntityType = (v: entityTypeFilter): void => { setEntityTypeFilter(v); setPage(1); };
  const handleSetSeverity = (v: severityFilter): void => { setSeverityFilter(v); setPage(1); };
  const handleSetIpSearch = (v: string): void => { setIpSearch(v); setPage(1); };
  const handleSetSort = (v: sortOption): void => { setSortOption(v); setPage(1); };

  const logs = data?.data?.content ?? [];
  const totalFiltered = data?.data?.totalElements ?? 0;
  const totalPages = data?.data?.totalPages ?? 1;
  const meta = metaData?.data;

  const openModal = (mode: modalMode, log?: AuditLog): void => {
    setSelectedLog(log ?? null);
    setModalMode(mode);
  };

  const closeModal = (): void => {
    setModalMode(null);
    setSelectedLog(null);
  };

  const refreshLogs = (): void => {
    refetch();
    refetchMeta();
  };

  const flagEvent = (logId: string): void => {
    // In real app, flag the event
    console.log('Flagging event:', logId);
  };

  return {
    // data
    filtered: logs,
    allFilteredCount: totalFiltered,
    totalLogsToday: meta?.totalLogsToday ?? 0,
    failedLoginAttempts: meta?.failedLoginAttempts ?? 0,
    criticalActions: meta?.criticalActions ?? 0,
    activeUsersToday: meta?.activeUsersToday ?? 0,
    isLoading,
    errorMessage: error instanceof Error
      ? error.message
      : metaError instanceof Error
        ? metaError.message
        : null,
    // pagination
    page,
    pageSize: PAGE_SIZE,
    totalPages,
    setPage,
    // filters
    search,
    setSearch: handleSetSearch,
    dateRange,
    setDateRange: handleSetDateRange,
    roleFilter,
    setRoleFilter: handleSetRole,
    entityTypeFilter,
    setEntityTypeFilter: handleSetEntityType,
    severityFilter,
    setSeverityFilter: handleSetSeverity,
    ipSearch,
    setIpSearch: handleSetIpSearch,
    sortOption,
    setSortOption: handleSetSort,
    autoRefresh,
    setAutoRefresh,
    // modal
    modalMode,
    selectedLog,
    openModal,
    closeModal,
    // actions
    refreshLogs,
    flagEvent,
  };
};
