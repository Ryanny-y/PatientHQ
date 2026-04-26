import { type ReactElement } from 'react';
import { Users, UserCheck, UserMinus, UserPlus } from 'lucide-react';
import type { Patient } from '@/features/patients/types/Patient';

interface PatientStatsCardsProps {
  patients: Patient[];
}

const PatientStatsCards = ({ patients }: PatientStatsCardsProps): ReactElement => {
  const total = patients.length;
  const active = patients.filter((p) => p.status === "ACTIVE" || p.status === "ADMITTED").length;
  const inactive = patients.filter((p) => p.status === "INACTIVE" || p.status === "DISCHARGED").length;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const newThisMonth = patients.filter((p) => {
    const createdDate = new Date(p.created_at);
    return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
  }).length;

  const stats = [
    { label: 'Total Patients', value: total, icon: Users, iconBg: 'bg-blue-600', valueCls: 'text-slate-900' },
    { label: 'Active Patients', value: active, icon: UserCheck, iconBg: 'bg-emerald-600', valueCls: 'text-emerald-700' },
    { label: 'Inactive / Discharged', value: inactive, icon: UserMinus, iconBg: 'bg-slate-400', valueCls: 'text-slate-600' },
    { label: 'New This Month', value: newThisMonth, icon: UserPlus, iconBg: 'bg-violet-600', valueCls: 'text-violet-700' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ label, value, icon: Icon, iconBg, valueCls }) => (
        <div key={label} className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-shadow">
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

export default PatientStatsCards;
