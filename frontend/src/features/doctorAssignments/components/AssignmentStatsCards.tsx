import { type ReactElement } from 'react';
import { ShieldCheck, Users, Activity, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/shared/utils/cn';

interface AssignmentStatsCardsProps {
  activeAssignments: number;
  unassignedPatients: number;
  availableDoctors: number;
  highWorkloadDoctors: number;
}

const stats: Array<{
  label: string;
  icon: React.ElementType;
  variant: string;
  key: 'active' | 'unassigned' | 'available' | 'workload';
}> = [
  { label: 'Active Assignments', icon: ShieldCheck, variant: 'blue', key: 'active' },
  { label: 'Unassigned Patients', icon: Users, variant: 'slate', key: 'unassigned' },
  { label: 'Available Doctors', icon: Activity, variant: 'emerald', key: 'available' },
  { label: 'High Workload Doctors', icon: TrendingUp, variant: 'amber', key: 'workload' },
];

const AssignmentStatsCards = ({ activeAssignments, unassignedPatients, availableDoctors, highWorkloadDoctors }: AssignmentStatsCardsProps): ReactElement => {
  const values = {
    active: activeAssignments,
    unassigned: unassignedPatients,
    available: availableDoctors,
    workload: highWorkloadDoctors,
  };

  return (
    <div className="grid gap-4 xl:grid-cols-4 lg:grid-cols-2">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <article key={item.key} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{values[item.key]}</p>
              </div>
              <div className={cn('inline-flex h-11 w-11 items-center justify-center rounded-2xl', item.variant === 'blue' ? 'bg-blue-50 text-blue-700' : item.variant === 'emerald' ? 'bg-emerald-50 text-emerald-700' : item.variant === 'amber' ? 'bg-amber-50 text-amber-700' : 'bg-slate-50 text-slate-700')}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <Badge variant={item.variant === 'blue' ? 'default' : item.variant === 'emerald' ? 'success' : item.variant === 'amber' ? 'warning' : 'secondary'} className="mt-4">
              Updated daily
            </Badge>
          </article>
        );
      })}
    </div>
  );
};

export default AssignmentStatsCards;
