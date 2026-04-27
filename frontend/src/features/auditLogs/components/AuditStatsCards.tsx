import { type ReactElement } from 'react';
import { FileText, ShieldX, AlertTriangle, Users } from 'lucide-react';

interface AuditStatsCardsProps {
  totalLogsToday: number;
  failedLoginAttempts: number;
  criticalActions: number;
  activeUsersToday: number;
}

interface StatItem {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  iconBg: string;
  valueCls: string;
}

const AuditStatsCards = ({
  totalLogsToday,
  failedLoginAttempts,
  criticalActions,
  activeUsersToday,
}: AuditStatsCardsProps): ReactElement => {
  const stats: StatItem[] = [
    {
      label: 'Total Logs Today',
      value: totalLogsToday,
      icon: FileText,
      color: 'border-slate-100',
      iconBg: 'bg-blue-600',
      valueCls: 'text-slate-900'
    },
    {
      label: 'Failed Login Attempts',
      value: failedLoginAttempts,
      icon: ShieldX,
      color: 'border-amber-100',
      iconBg: 'bg-amber-600',
      valueCls: 'text-amber-700'
    },
    {
      label: 'Critical Actions',
      value: criticalActions,
      icon: AlertTriangle,
      color: 'border-red-100',
      iconBg: 'bg-red-600',
      valueCls: 'text-red-700'
    },
    {
      label: 'Active Users Today',
      value: activeUsersToday,
      icon: Users,
      color: 'border-slate-100',
      iconBg: 'bg-emerald-600',
      valueCls: 'text-emerald-700'
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ label, value, icon: Icon, color, iconBg, valueCls }) => (
        <div key={label} className={`bg-white rounded-xl border ${color} p-4 shadow-sm`}>
          <div className="flex items-center justify-between mb-3">
            <div className={`h-9 w-9 rounded-lg ${iconBg} flex items-center justify-center`}>
              <Icon className="h-4 w-4 text-white" />
            </div>
          </div>
          <p className={`text-2xl font-bold ${valueCls} mb-0.5`}>{value}</p>
          <p className="text-xs text-slate-500">{label}</p>
        </div>
      ))}
    </div>
  );
};

export default AuditStatsCards;