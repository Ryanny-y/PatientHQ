import { type ReactElement } from 'react';
import { Users, UserCheck, UserMinus, UserPlus } from 'lucide-react';
import type { PatientMetaData } from '../types/patient';

const PatientStatsCards = ({ metaData }: { metaData: PatientMetaData | undefined }): ReactElement => {

  const stats = [
    { label: 'Total Patients', value: metaData?.activePatients ?? 0, icon: Users, iconBg: 'bg-blue-600', valueCls: 'text-slate-900' },
    { label: 'Active Patients', value: metaData?.activePatients ?? 0, icon: UserCheck, iconBg: 'bg-emerald-600', valueCls: 'text-emerald-700' },
    { label: 'Inactive / Discharged', value: metaData?.inactivePatients ?? 0, icon: UserMinus, iconBg: 'bg-slate-400', valueCls: 'text-slate-600' },
    { label: 'New This Month', value: metaData?.newThisMonth ?? 0, icon: UserPlus, iconBg: 'bg-violet-600', valueCls: 'text-violet-700' },
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
