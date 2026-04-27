import { type ReactElement } from 'react';
import { Badge } from '@/components/ui/badge';

interface SeverityBadgeProps {
  severity: 'Info' | 'Warning' | 'Critical';
}

const SeverityBadge = ({ severity }: SeverityBadgeProps): ReactElement => {
  const variants = {
    Info: 'bg-blue-100 text-blue-700 border border-blue-200',
    Warning: 'bg-amber-100 text-amber-700 border border-amber-200',
    Critical: 'bg-red-100 text-red-700 border border-red-200',
  };

  return (
    <Badge className={`${variants[severity]} text-xs font-medium`}>
      {severity}
    </Badge>
  );
};

export default SeverityBadge;