import { type ReactElement } from 'react';
import { UserPlus } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import type { RecentPatient } from '@/features/dashboard/types/dashboard';

interface PatientListCardProps {
  patients: RecentPatient[];
}

const statusStyles: Record<RecentPatient['status'], string> = {
  Admitted: 'bg-blue-50 text-blue-700',
  Outpatient: 'bg-slate-100 text-slate-600',
  Discharged: 'bg-emerald-50 text-emerald-700',
  Critical: 'bg-red-50 text-red-700',
};

const PatientListCard = ({ patients }: PatientListCardProps): ReactElement => (
  <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <UserPlus className="h-4 w-4 text-blue-600" />
        <h3 className="font-semibold text-slate-800">Recently Registered Patients</h3>
      </div>
      <button className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors">
        View All
      </button>
    </div>
    <div className="divide-y divide-slate-50">
      {patients.map((patient) => (
        <div key={patient.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-slate-50/50 transition-colors">
          <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <span className="text-blue-700 text-xs font-bold">
              {patient.name.split(' ').map((n) => n[0]).join('')}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-sm font-medium text-slate-800 truncate">{patient.name}</p>
              <span className="text-xs text-slate-400 shrink-0">· {patient.age}y</span>
            </div>
            <p className="text-xs text-slate-500 truncate">{patient.condition} · {patient.assignedDoctor}</p>
          </div>
          <div className="text-right shrink-0">
            <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', statusStyles[patient.status])}>
              {patient.status}
            </span>
            <p className="text-xs text-slate-400 mt-1">{patient.registeredAt}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default PatientListCard;
