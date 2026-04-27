import { type ReactElement } from 'react';
import { Clock, User, FileText, Globe } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import SeverityBadge from '@/features/auditLogs/components/SeverityBadge';
import type { AuditLog } from '@/features/auditLogs/types/auditLog';

interface AuditDetailDrawerProps {
  log: AuditLog | null;
  open: boolean;
  onClose: () => void;
}

const formatDateTime = (dateStr: string): string =>
  new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

const AuditDetailDrawer = ({ log, open, onClose }: AuditDetailDrawerProps): ReactElement => {
  if (!log) return <></>;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Event Details
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Event Summary */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Event Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Log ID</span>
                <span className="font-mono text-sm text-slate-900">
                  {String(log.log_id).padStart(5, '0')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Timestamp</span>
                <span className="text-sm text-slate-900">{formatDateTime(log.created_at)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Severity</span>
                <SeverityBadge severity={log.severity} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Action</span>
                <Badge className="text-xs bg-slate-100 text-slate-700">
                  {log.action.replace(/_/g, ' ')}
                </Badge>
              </div>
              <div>
                <span className="text-sm text-slate-500">Description</span>
                <p className="text-sm text-slate-900 mt-1">{log.description}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* User Information */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              User Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Username</span>
                <span className="text-sm text-slate-900">{log.username}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Role</span>
                <Badge variant="secondary" className="text-xs">{log.role}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">User ID</span>
                <span className="font-mono text-sm text-slate-900">{log.user_id}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Resource Information */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Resource Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Entity Type</span>
                <Badge className="text-xs bg-slate-100 text-slate-700">
                  {log.entity_type.replace(/_/g, ' ')}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Entity ID</span>
                <span className="font-mono text-sm text-slate-900">
                  {log.entity_id || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Access Metadata */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Access Metadata
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">IP Address</span>
                <span className="font-mono text-sm text-slate-900">{log.ip_address}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Browser</span>
                <span className="text-sm text-slate-900">Chrome 120.0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Device</span>
                <span className="text-sm text-slate-900">Desktop</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Location</span>
                <span className="text-sm text-slate-900">Manila, PH</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Timeline */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Timeline
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-500 mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Login</p>
                  <p className="text-xs text-slate-500">{formatDateTime(log.created_at)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500 mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Action Performed</p>
                  <p className="text-xs text-slate-500">{log.action.replace(/_/g, ' ')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-slate-400 mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Session Ended</p>
                  <p className="text-xs text-slate-500">Auto-logout after 30 minutes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AuditDetailDrawer;