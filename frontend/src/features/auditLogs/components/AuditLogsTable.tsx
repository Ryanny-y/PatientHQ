import { type ReactElement } from 'react';
import { MoreHorizontal, Eye, Flag } from 'lucide-react';
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import SeverityBadge from '@/features/auditLogs/components/SeverityBadge';
import type { AuditLog } from '@/features/auditLogs/types/auditLog';

interface AuditLogsTableProps {
  logs: AuditLog[];
  onViewDetails: (log: AuditLog) => void;
  onFlagEvent: (log: AuditLog) => void;
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  totalFiltered: number;
  pageSize: number;
}

const formatDateTime = (dateStr: string): string =>
  new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const AuditLogsTable = ({
  logs,
  onViewDetails,
  onFlagEvent,
  page,
  totalPages,
  onPageChange,
  totalFiltered,
  pageSize,
}: AuditLogsTableProps): ReactElement => {
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalFiltered);

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Log ID</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Timestamp</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Role</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden xl:table-cell">Entity Type</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden xl:table-cell">Entity ID</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">IP Address</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Severity</th>
              <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider sticky right-0 bg-slate-50/60">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-5 py-12 text-center text-sm text-slate-400">
                  No audit logs found.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.log_id} className="hover:bg-slate-50/50 transition-colors group">
                  {/* Log ID */}
                  <td className="px-5 py-4">
                    <span className="font-mono text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      {String(log.log_id).padStart(5, '0')}
                    </span>
                  </td>
                  {/* Timestamp */}
                  <td className="px-5 py-4 text-slate-700 text-xs whitespace-nowrap">
                    {formatDateTime(log.created_at)}
                  </td>
                  {/* User */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <span className="text-blue-700 text-[10px] font-bold">
                          {log.username.split('').slice(0, 2).join('').toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium text-slate-800">{log.username}</span>
                    </div>
                  </td>
                  {/* Role */}
                  <td className="px-5 py-4 text-slate-500 hidden lg:table-cell">
                    <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {log.role}
                    </span>
                  </td>
                  {/* Action */}
                  <td className="px-5 py-4">
                    <span className="text-xs font-medium text-slate-800 bg-slate-50 px-2 py-1 rounded">
                      {log.action.replace(/_/g, ' ')}
                    </span>
                  </td>
                  {/* Entity Type */}
                  <td className="px-5 py-4 text-slate-500 hidden xl:table-cell text-xs">
                    {log.entity_type.replace(/_/g, ' ')}
                  </td>
                  {/* Entity ID */}
                  <td className="px-5 py-4 text-slate-500 hidden xl:table-cell font-mono text-xs">
                    {log.entity_id || '-'}
                  </td>
                  {/* IP Address */}
                  <td className="px-5 py-4 text-slate-500 hidden lg:table-cell font-mono text-xs">
                    {log.ip_address}
                  </td>
                  {/* Severity */}
                  <td className="px-5 py-4">
                    <SeverityBadge severity={log.severity} />
                  </td>
                  {/* Actions */}
                  <td className="px-5 py-4 text-right sticky right-0 bg-white group-hover:bg-slate-50/50 transition-colors">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
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
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/60">
          <p className="text-xs text-slate-500">
            Showing {from} to {to} of {totalFiltered} results
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-xs text-slate-500 px-2">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogsTable;
