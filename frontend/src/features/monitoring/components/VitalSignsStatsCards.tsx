import { type ReactElement } from 'react';
import { Activity, ClipboardList, AlertTriangle, Users } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import type { VitalSignsMetadata } from '../types/vitalSigns';

interface VitalSignsStatsCardsProps {
  meta: VitalSignsMetadata | undefined;
}

const cards = [
  { key: 'totalRecords' as const, label: 'Total Records', icon: ClipboardList, color: 'blue' },
  { key: 'recordedToday' as const, label: 'Recorded Today', icon: Activity, color: 'emerald' },
  { key: 'criticalCount' as const, label: 'Critical Readings', icon: AlertTriangle, color: 'red' },
  { key: 'patientsMonitored' as const, label: 'Patients Monitored', icon: Users, color: 'slate' },
];

const colorMap: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-700',
  emerald: 'bg-emerald-50 text-emerald-700',
  red: 'bg-red-50 text-red-700',
  slate: 'bg-slate-50 text-slate-700',
};

const VitalSignsStatsCards = ({ meta }: VitalSignsStatsCardsProps): ReactElement => (
  <div className="grid gap-4 xl:grid-cols-4 lg:grid-cols-2">
    {cards.map(({ key, label, icon: Icon, color }) => (
      <article key={key} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">{label}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">
              {meta?.[key] ?? '—'}
            </p>
          </div>
          <div className={cn('inline-flex h-11 w-11 items-center justify-center rounded-2xl', colorMap[color])}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </article>
    ))}
  </div>
);

export default VitalSignsStatsCards;
