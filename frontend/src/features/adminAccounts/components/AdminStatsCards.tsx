import { type ReactElement } from 'react';
import { Users, UserCheck, UserX, UserPlus } from 'lucide-react';

interface AdminStatsCardsProps {
  total: number;
  active: number;
  inactive: number;
  recent: number;
}

interface StatItem {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  iconBg: string;
  valueCls: string;
}

const AdminStatsCards = ({ total, active, inactive, recent }: AdminStatsCardsProps): ReactElement => {
  const stats: StatItem[] = [
    { label: 'Total Admins', value: total, icon: Users, color: 'border-slate-100', iconBg: 'bg-blue-600', valueCls: 'text-slate-900' },
    { label: 'Active Accounts', value: active, icon: UserCheck, color: 'border-slate-100', iconBg: 'bg-emerald-600', valueCls: 'text-emerald-700' },
    { label: 'Inactive Accounts', value: inactive, icon: UserX, color: 'border-slate-100', iconBg: 'bg-slate-400', valueCls: 'text-slate-600' },
    { label: 'Recently Added', value: recent, icon: UserPlus, color: 'border-slate-100', iconBg: 'bg-violet-600', valueCls: 'text-violet-700' },
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

export default AdminStatsCards;
