import { type ReactElement } from 'react';
import { cn } from '@/shared/utils/cn';

interface StatusBadgeProps {
  isActive: boolean;
}

const StatusBadge = ({ isActive }: StatusBadgeProps): ReactElement => (
  <span
    className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
      isActive
        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
        : 'bg-slate-100 text-slate-500 border border-slate-200'
    )}
  >
    <span className={cn('h-1.5 w-1.5 rounded-full', isActive ? 'bg-emerald-500' : 'bg-slate-400')} />
    {isActive ? 'Active' : 'Inactive'}
  </span>
);

export default StatusBadge;
