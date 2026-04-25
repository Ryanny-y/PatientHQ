import { type ReactElement } from 'react';
import { TrendingUp, TrendingDown, Minus, Users, Stethoscope, HeartPulse, CalendarClock } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import type { StatCardData } from '@/features/dashboard/types/dashboard';

const iconMap = { Users, Stethoscope, HeartPulse, CalendarClock };

const colorMap = {
  blue: { icon: 'bg-blue-600' },
  emerald: { icon: 'bg-emerald-600' },
  violet: { icon: 'bg-violet-600' },
  amber: { icon: 'bg-amber-500' },
};

interface StatCardProps {
  data: StatCardData;
}

const StatCard = ({ data }: StatCardProps): ReactElement => {
  const Icon = iconMap[data.icon as keyof typeof iconMap];
  const colors = colorMap[data.color];

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center', colors.icon)}>
          {Icon && <Icon className="h-5 w-5 text-white" />}
        </div>
        <span className={cn('flex items-center gap-1 text-xs font-medium', {
          'text-emerald-600': data.trend === 'up',
          'text-red-500': data.trend === 'down',
          'text-slate-400': data.trend === 'neutral',
        })}>
          {data.trend === 'up' && <TrendingUp className="h-3.5 w-3.5" />}
          {data.trend === 'down' && <TrendingDown className="h-3.5 w-3.5" />}
          {data.trend === 'neutral' && <Minus className="h-3.5 w-3.5" />}
          {data.change}
        </span>
      </div>
      <p className="text-2xl font-bold text-slate-900 mb-0.5">{data.value}</p>
      <p className="text-sm text-slate-500">{data.title}</p>
    </div>
  );
};

export default StatCard;
