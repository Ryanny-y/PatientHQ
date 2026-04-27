import { type ReactElement } from 'react';
import { Search, RefreshCw, Calendar, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type {
  roleFilter,
  entityTypeFilter,
  severityFilter,
  sortOption,
  DateRange,
} from '@/features/auditLogs/types/auditLog';

interface AuditFilterToolbarProps {
  search: string;
  onSearchChange: (v: string) => void;
  dateRange: DateRange;
  onDateRangeChange: (v: DateRange) => void;
  roleFilter: roleFilter;
  onRoleChange: (v: roleFilter) => void;
  entityTypeFilter: entityTypeFilter;
  onEntityTypeChange: (v: entityTypeFilter) => void;
  severityFilter: severityFilter;
  onSeverityChange: (v: severityFilter) => void;
  ipSearch: string;
  onIpSearchChange: (v: string) => void;
  sortOption: sortOption;
  onSortChange: (v: sortOption) => void;
  autoRefresh: boolean;
  onAutoRefreshChange: (v: boolean) => void;
  onRefresh: () => void;
  totalFiltered: number;
}

const AuditFilterToolbar = ({
  search,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  roleFilter,
  onRoleChange,
  entityTypeFilter,
  onEntityTypeChange,
  severityFilter,
  onSeverityChange,
  ipSearch,
  onIpSearchChange,
  sortOption,
  onSortChange,
  autoRefresh,
  onAutoRefreshChange,
  onRefresh,
  totalFiltered,
}: AuditFilterToolbarProps): ReactElement => (
  <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 space-y-4">
    {/* Top row: Search and Date Range */}
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        <Input
          placeholder="Search by log ID, username, action, entity..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-9 bg-slate-50 border-slate-200 text-sm"
        />
      </div>

      {/* Date From */}
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        <Input
          type="date"
          placeholder="From date"
          value={dateRange.from ? dateRange.from.toISOString().split('T')[0] : ''}
          onChange={(e) => onDateRangeChange({
            ...dateRange,
            from: e.target.value ? new Date(e.target.value) : undefined
          })}
          className="pl-9 h-9 bg-slate-50 border-slate-200 text-sm w-36"
        />
      </div>

      {/* Date To */}
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        <Input
          type="date"
          placeholder="To date"
          value={dateRange.to ? dateRange.to.toISOString().split('T')[0] : ''}
          onChange={(e) => onDateRangeChange({
            ...dateRange,
            to: e.target.value ? new Date(e.target.value) : undefined
          })}
          className="pl-9 h-9 bg-slate-50 border-slate-200 text-sm w-36"
        />
      </div>
    </div>

    {/* Bottom row: Filters */}
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        {/* Role filter */}
        <div className="flex items-center gap-1.5">
          <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <Select value={roleFilter} onValueChange={(v) => onRoleChange(v as roleFilter)}>
            <SelectTrigger className="h-9 w-28 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Roles</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Doctor">Doctor</SelectItem>
              <SelectItem value="Nurse">Nurse</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Entity Type filter */}
        <Select value={entityTypeFilter} onValueChange={(v) => onEntityTypeChange(v as entityTypeFilter)}>
          <SelectTrigger className="h-9 w-36 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Entities</SelectItem>
            <SelectItem value="USER">User</SelectItem>
            <SelectItem value="PATIENT">Patient</SelectItem>
            <SelectItem value="MEDICAL_RECORD">Medical Record</SelectItem>
            <SelectItem value="APPOINTMENT">Appointment</SelectItem>
            <SelectItem value="REPORT">Report</SelectItem>
            <SelectItem value="SYSTEM_SETTING">System Setting</SelectItem>
            <SelectItem value="LOGIN">Login</SelectItem>
            <SelectItem value="SECURITY">Security</SelectItem>
          </SelectContent>
        </Select>

        {/* Severity filter */}
        <Select value={severityFilter} onValueChange={(v) => onSeverityChange(v as severityFilter)}>
          <SelectTrigger className="h-9 w-28 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Severity</SelectItem>
            <SelectItem value="Info">Info</SelectItem>
            <SelectItem value="Warning">Warning</SelectItem>
            <SelectItem value="Critical">Critical</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={sortOption} onValueChange={(v) => onSortChange(v as sortOption)}>
          <SelectTrigger className="h-9 w-32 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {/* IP Search */}
        <div className="relative">
          <Input
            placeholder="IP Address"
            value={ipSearch}
            onChange={(e) => onIpSearchChange(e.target.value)}
            className="h-9 w-32 bg-slate-50 border-slate-200 text-sm"
          />
        </div>

        {/* Auto Refresh */}
        <div className="flex items-center gap-2">
          <Switch
            id="auto-refresh"
            checked={autoRefresh}
            onCheckedChange={onAutoRefreshChange}
          />
          <Label htmlFor="auto-refresh" className="text-xs text-slate-600">
            Auto Refresh
          </Label>
        </div>

        {/* Refresh */}
        <Button variant="outline" size="icon" className="h-9 w-9 shrink-0" onClick={onRefresh} title="Refresh">
          <RefreshCw className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>

    {/* Result count */}
    {(search || ipSearch) && (
      <p className="text-xs text-slate-400">
        {totalFiltered} result{totalFiltered !== 1 ? 's' : ''} found
      </p>
    )}
  </div>
);

export default AuditFilterToolbar;