import { type ReactElement } from 'react';
import { AlertTriangle, ShieldX, UserX, Settings, FileX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { AuditLog } from '@/features/auditLogs/types/auditLog';

interface SecurityAlert {
  id: string;
  type: 'multiple_failed_logins' | 'password_reset' | 'deleted_records' | 'settings_modified' | 'unusual_access';
  title: string;
  description: string;
  timestamp: string;
  severity: 'high' | 'medium' | 'low';
  user?: string;
  count?: number;
}

interface SecurityAlertsPanelProps {
  logs: AuditLog[];
}

const toAlert = (log: AuditLog): SecurityAlert => {
  const action = log.action.toLowerCase();
  const isFailedLogin = action.includes('login') && action.includes('failed');
  const isDelete = action.includes('delete');
  const isReset = action.includes('reset');
  const isSettings = log.entity_type === 'SYSTEM_SETTING';

  return {
    id: log.log_id,
    type: isFailedLogin
      ? 'multiple_failed_logins'
      : isSettings
        ? 'settings_modified'
        : isDelete
          ? 'deleted_records'
          : isReset
            ? 'password_reset'
            : 'unusual_access',
    title: log.action.replace(/_/g, ' '),
    description: log.description,
    timestamp: log.created_at,
    severity: log.severity === 'Critical' ? 'high' : log.severity === 'Warning' ? 'medium' : 'low',
    user: log.username,
  };
};

const getAlertIcon = (type: SecurityAlert['type']) => {
  switch (type) {
    case 'multiple_failed_logins':
      return <ShieldX className="h-4 w-4 text-red-500" />;
    case 'password_reset':
      return <UserX className="h-4 w-4 text-amber-500" />;
    case 'deleted_records':
      return <FileX className="h-4 w-4 text-red-500" />;
    case 'settings_modified':
      return <Settings className="h-4 w-4 text-red-500" />;
    case 'unusual_access':
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    default:
      return <AlertTriangle className="h-4 w-4 text-slate-500" />;
  }
};

const getSeverityColor = (severity: SecurityAlert['severity']) => {
  switch (severity) {
    case 'high':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'medium':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'low':
      return 'bg-blue-100 text-blue-700 border-blue-200';
  }
};

const formatTime = (timestamp: string): string =>
  new Date(timestamp).toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

const SecurityAlertsPanel = ({ logs }: SecurityAlertsPanelProps): ReactElement => {
  const alerts = logs
    .filter((log) => log.severity !== 'Info')
    .slice(0, 5)
    .map(toAlert);

  return (
    <Card className="border-amber-100 bg-amber-50/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          Security Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.length === 0 && (
          <div className="p-3 bg-white rounded-lg border border-slate-100 text-xs text-slate-500">
            No warning or critical events in the current results.
          </div>
        )}
        {alerts.map((alert) => (
        <div key={alert.id} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-100">
          {getAlertIcon(alert.type)}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-slate-900 truncate">{alert.title}</p>
              <Badge className={`text-xs ${getSeverityColor(alert.severity)}`}>
                {alert.severity}
              </Badge>
            </div>
            <p className="text-xs text-slate-600 mb-2">{alert.description}</p>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{alert.user && `@${alert.user}`}</span>
              <span>{formatTime(alert.timestamp)}</span>
            </div>
          </div>
        </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SecurityAlertsPanel;
