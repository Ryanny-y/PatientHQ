import { Badge } from '@/components/ui/badge';
import { type ReactElement } from 'react';
import type { IntegrityStatus } from '../types/dataIntegrity';

interface IntegrityStatusBadgeProps {
  status: IntegrityStatus;
}

const variants: Record<IntegrityStatus, string> = {
  VALID: 'bg-green-100 text-green-800 hover:bg-green-100',
  PENDING: 'bg-amber-100 text-amber-800 hover:bg-amber-100',
  TAMPERED: 'bg-red-100 text-red-800 hover:bg-red-100',
};

export const IntegrityStatusBadge = ({ status }: IntegrityStatusBadgeProps): ReactElement => (
  <Badge variant="secondary" className={variants[status]}>
    {status}
  </Badge>
);
