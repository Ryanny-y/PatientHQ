import { useState, useMemo } from 'react';
import { mockAuditLogs } from '@/features/auditLogs/utils/mockAuditData';
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
  exportLogs: () => void;
  flagEvent: (logId: number) => void;
}

const PAGE_SIZE = 10;

// Helper to check if date is today
const isToday = (dateStr: string): boolean => {
  const today = new Date();
  const logDate = new Date(dateStr);
  return logDate.toDateString() === today.toDateString();
};

// Helper to check if date is in range
const isInDateRange = (dateStr: string, range: DateRange): boolean => {
  if (!range.from && !range.to) return true;
  const logDate = new Date(dateStr);
  if (range.from && logDate < range.from) return false;
  if (range.to && logDate > range.to) return false;
  return true;
};

// Get unique active users today
const getActiveUsersToday = (logs: AuditLog[]): number => {
  const todayLogs = logs.filter(log => isToday(log.created_at));
  const uniqueUsers = new Set(todayLogs.map(log => log.user_id));
  return uniqueUsers.size;
};

export const useAuditLogs = (): useAuditLogsReturn => {
  const [logs] = useState<AuditLog[]>(mockAuditLogs);
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

  // Reset to page 1 whenever filters change
  const handleSetSearch = (v: string): void => { setSearch(v); setPage(1); };
  const handleSetDateRange = (v: DateRange): void => { setDateRange(v); setPage(1); };
  const handleSetRole = (v: roleFilter): void => { setRoleFilter(v); setPage(1); };
  const handleSetEntityType = (v: entityTypeFilter): void => { setEntityTypeFilter(v); setPage(1); };
  const handleSetSeverity = (v: severityFilter): void => { setSeverityFilter(v); setPage(1); };
  const handleSetIpSearch = (v: string): void => { setIpSearch(v); setPage(1); };
  const handleSetSort = (v: sortOption): void => { setSortOption(v); setPage(1); };

  const filtered = useMemo(() => {
    let result = [...logs];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (log) =>
          log.username.toLowerCase().includes(q) ||
          log.action.toLowerCase().includes(q) ||
          log.entity_type.toLowerCase().includes(q) ||
          log.description.toLowerCase().includes(q) ||
          String(log.log_id).includes(q)
      );
    }

    // Date range filter
    result = result.filter(log => isInDateRange(log.created_at, dateRange));

    // Role filter
    if (roleFilter !== 'All') {
      result = result.filter(log => log.role === roleFilter);
    }

    // Entity type filter
    if (entityTypeFilter !== 'All') {
      result = result.filter(log => log.entity_type === entityTypeFilter);
    }

    // Severity filter
    if (severityFilter !== 'All') {
      result = result.filter(log => log.severity === severityFilter);
    }

    // IP search
    if (ipSearch.trim()) {
      result = result.filter(log => log.ip_address.includes(ipSearch.trim()));
    }

    // Sort
    result.sort((a, b) => {
      if (sortOption === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortOption === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return 0;
    });

    return result;
  }, [logs, search, dateRange, roleFilter, entityTypeFilter, severityFilter, ipSearch, sortOption]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Stats calculations
  const totalLogsToday = logs.filter(log => isToday(log.created_at)).length;
  const failedLoginAttempts = logs.filter(log => isToday(log.created_at) && log.action === 'LOGIN_FAILED').length;
  const criticalActions = logs.filter(log => isToday(log.created_at) && log.severity === 'Critical').length;
  const activeUsersToday = getActiveUsersToday(logs);

  const openModal = (mode: modalMode, log?: AuditLog): void => {
    setSelectedLog(log ?? null);
    setModalMode(mode);
  };

  const closeModal = (): void => {
    setModalMode(null);
    setSelectedLog(null);
  };

  const refreshLogs = (): void => {
    // In real app, fetch new data
    console.log('Refreshing logs...');
  };

  const exportLogs = (): void => {
    // In real app, trigger export
    console.log('Exporting logs...');
  };

  const flagEvent = (logId: number): void => {
    // In real app, flag the event
    console.log('Flagging event:', logId);
  };

  return {
    // data
    filtered: paginated,
    allFilteredCount: filtered.length,
    totalLogsToday,
    failedLoginAttempts,
    criticalActions,
    activeUsersToday,
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
    exportLogs,
    flagEvent,
  };
};