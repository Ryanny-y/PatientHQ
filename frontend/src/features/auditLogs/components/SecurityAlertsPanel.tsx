import { type ReactElement } from 'react';
import { AlertTriangle, ShieldX, UserX, Settings, FileX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SecurityAlert {
  id: number;
  type: 'multiple_failed_logins' | 'password_reset' | 'deleted_records' | 'settings_modified' | 'unusual_access';
  title: string;
  description: string;
  timestamp: string;
  severity: 'high' | 'medium' | 'low';
  user?: string;
  count?: number;
}

const mockAlerts: SecurityAlert[] = [
  {
    id: 1,
    type: 'multiple_failed_logins',
    title: 'Multiple Failed Login Attempts',
    description: '5 failed login attempts from IP 192.168.1.67',
    timestamp: '2026-04-26 14:20:00',
    severity: 'high',
    user: 'nurse.jones',
    count: 5,
  },
  {
    id: 2,
    type: 'settings_modified',
    title: 'System Settings Modified',
    description: 'Password policy requirements changed',
    timestamp: '2026-04-26 14:15:00',
    severity: 'high',
    user: 'superadmin',
  },
  {
    id: 3,
    type: 'deleted_records',
    title: 'User Account Deleted',
    description: 'Nurse account permanently removed',
    timestamp: '2026-04-26 14:15:00',
    severity: 'medium',
    user: 'superadmin',
  },
  {
    id: 4,
    type: 'password_reset',
    title: 'Password Reset Requested',
    description: 'Password reset initiated for nurse account',
    timestamp: '2026-04-26 14:20:00',
    severity: 'medium',
    user: 'nurse.jones',
  },
  {
    id: 5,
    type: 'unusual_access',
    title: 'Unusual Access Time',
    description: 'Login detected at 2:30 AM',
    timestamp: '2026-04-26 02:30:00',
    severity: 'low',
    user: 'dr.smith',
  },
];

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

const SecurityAlertsPanel = (): ReactElement => (
  <Card className="border-amber-100 bg-amber-50/30">
    <CardHeader className="pb-3">
      <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        Security Alerts
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      {mockAlerts.map((alert) => (
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

export default SecurityAlertsPanel;