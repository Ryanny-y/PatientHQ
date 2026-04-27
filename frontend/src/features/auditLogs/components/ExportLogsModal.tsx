import { type ReactElement } from 'react';
import { Download, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import type { DateRange, roleFilter, entityTypeFilter, severityFilter } from '@/features/auditLogs/types/auditLog';

interface ExportLogsModalProps {
  open: boolean;
  onClose: () => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  roleFilter: roleFilter;
  onRoleChange: (role: roleFilter) => void;
  entityTypeFilter: entityTypeFilter;
  onEntityTypeChange: (entity: entityTypeFilter) => void;
  severityFilter: severityFilter;
  onSeverityChange: (severity: severityFilter) => void;
  onExport: () => void;
}

const ExportLogsModal = ({
  open,
  onClose,
  dateRange,
  onDateRangeChange,
  roleFilter,
  onRoleChange,
  entityTypeFilter,
  onEntityTypeChange,
  severityFilter,
  onSeverityChange,
  onExport,
}: ExportLogsModalProps): ReactElement => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Download className="h-5 w-5 text-blue-600" />
          Export Audit Logs
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        {/* Date Range */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Date Range</Label>
          <div className="grid grid-cols-2 gap-3">
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
                className="pl-9 h-9 bg-slate-50 border-slate-200 text-sm"
              />
            </div>
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
                className="pl-9 h-9 bg-slate-50 border-slate-200 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Role Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Role Filter</Label>
          <Select value={roleFilter} onValueChange={(v) => onRoleChange(v as roleFilter)}>
            <SelectTrigger>
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

        {/* Entity Type Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Entity Type</Label>
          <Select value={entityTypeFilter} onValueChange={(v) => onEntityTypeChange(v as entityTypeFilter)}>
            <SelectTrigger>
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
        </div>

        {/* Severity Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Severity</Label>
          <Select value={severityFilter} onValueChange={(v) => onSeverityChange(v as severityFilter)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Severities</SelectItem>
              <SelectItem value="Info">Info</SelectItem>
              <SelectItem value="Warning">Warning</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Format */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Export Format</Label>
          <Select defaultValue="csv">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="excel">Excel</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DialogFooter className="gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onExport} className="gap-2">
          <Download className="h-4 w-4" />
          Export Logs
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default ExportLogsModal;