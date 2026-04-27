import { type ReactElement } from 'react';
import { MoreHorizontal, Eye, Flag, Download } from 'lucide-react';
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import SeverityBadge from '@/features/auditLogs/components/SeverityBadge';
import type { AuditLog } from '@/features/auditLogs/types/auditLog';

interface AuditLogCardListMobileProps {
  logs: AuditLog[];
  onViewDetails: (log: AuditLog) => void;
  onFlagEvent: (log: AuditLog) => void;
  onExportEntry: (log: AuditLog) => void;
}

const formatDateTime = (dateStr: string): string =>
  new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const AuditLogCardListMobile = ({
  logs,
  onViewDetails,
  onFlagEvent,
  onExportEntry,
}: AuditLogCardListMobileProps): ReactElement => (
  <div className="space-y-3">
    {logs.length === 0 && (
      <div className="bg-white rounded-xl border border-slate-100 p-8 text-center text-sm text-slate-400">
        No audit logs found.
      </div>
    )}
    {logs.map((log) => (
      <div key={log.log_id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <span className="text-blue-700 text-sm font-bold">
                {log.username.split('').slice(0, 2).join('').toUpperCase()}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <p className="text-sm font-semibold text-slate-800">{log.username}</p>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                  {log.role}
                </span>
              </div>
              <p className="text-xs text-slate-500">{log.action.replace(/_/g, ' ')}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => onViewDetails(log)}>
                <Eye className="h-3.5 w-3.5" /> View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFlagEvent(log)}>
                <Flag className="h-3.5 w-3.5" /> Flag Event
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onExportEntry(log)}>
                <Download className="h-3.5 w-3.5" /> Export Entry
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-50 grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-slate-400 mb-0.5">Time</p>
            <p className="text-slate-600">{formatDateTime(log.created_at)}</p>
          </div>
          <div>
            <p className="text-slate-400 mb-0.5">Severity</p>
            <SeverityBadge severity={log.severity} />
          </div>
          <div>
            <p className="text-slate-400 mb-0.5">Entity</p>
            <p className="text-slate-600">{log.entity_type.replace(/_/g, ' ')}</p>
          </div>
          <div>
            <p className="text-slate-400 mb-0.5">IP</p>
            <p className="text-slate-600 font-mono">{log.ip_address}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default AuditLogCardListMobile;