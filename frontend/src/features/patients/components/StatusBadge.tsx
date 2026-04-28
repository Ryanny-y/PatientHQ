import { type ReactElement } from 'react';
import { Badge } from '@/components/ui/badge';
import type { PatientStatus } from '../types/patient';

interface StatusBadgeProps {
  status: PatientStatus;
}

const StatusBadge = ({ status }: StatusBadgeProps): ReactElement => {
  const variants: Record<PatientStatus, { className: string; label: string }> = {
    ['ACTIVE']: { className: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100', label: 'Active' },
    ['ADMITTED']: { className: 'bg-blue-100 text-blue-700 hover:bg-blue-100', label: 'Admitted' },
    ['DISCHARGED']: { className: 'bg-slate-100 text-slate-700 hover:bg-slate-100', label: 'Discharged' },
    ['INACTIVE']: { className: 'bg-red-100 text-red-700 hover:bg-red-100', label: 'Inactive' },
  };

  const { className, label } = variants[status];

  return (
    <Badge variant="secondary" className={className}>
      {label}
    </Badge>
  );
};

export default StatusBadge;
