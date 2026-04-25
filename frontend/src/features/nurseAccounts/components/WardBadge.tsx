import { type ReactElement } from 'react';
import { Building2 } from 'lucide-react';

const colorPalette = [
  'bg-violet-50 text-violet-700 border-violet-200',
  'bg-blue-50 text-blue-700 border-blue-200',
  'bg-rose-50 text-rose-700 border-rose-200',
  'bg-amber-50 text-amber-700 border-amber-200',
  'bg-teal-50 text-teal-700 border-teal-200',
  'bg-indigo-50 text-indigo-700 border-indigo-200',
  'bg-cyan-50 text-cyan-700 border-cyan-200',
  'bg-orange-50 text-orange-700 border-orange-200',
  'bg-pink-50 text-pink-700 border-pink-200',
  'bg-emerald-50 text-emerald-700 border-emerald-200',
];

const getColor = (ward: string): string => {
  let hash = 0;
  for (let i = 0; i < ward.length; i++) hash = ward.charCodeAt(i) + ((hash << 5) - hash);
  return colorPalette[Math.abs(hash) % colorPalette.length];
};

interface WardBadgeProps {
  ward: string;
  showIcon?: boolean;
}

const WardBadge = ({ ward, showIcon = false }: WardBadgeProps): ReactElement => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${getColor(ward)}`}>
    {showIcon && <Building2 className="h-3 w-3 shrink-0" />}
    {ward}
  </span>
);

export default WardBadge;
