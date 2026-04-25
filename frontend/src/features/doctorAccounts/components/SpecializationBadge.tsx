import { type ReactElement } from 'react';

// Maps specialization to a consistent color pair
const colorPalette = [
  'bg-blue-50 text-blue-700',
  'bg-violet-50 text-violet-700',
  'bg-emerald-50 text-emerald-700',
  'bg-amber-50 text-amber-700',
  'bg-rose-50 text-rose-700',
  'bg-cyan-50 text-cyan-700',
  'bg-indigo-50 text-indigo-700',
  'bg-teal-50 text-teal-700',
  'bg-orange-50 text-orange-700',
  'bg-pink-50 text-pink-700',
];

const getColor = (spec: string): string => {
  let hash = 0;
  for (let i = 0; i < spec.length; i++) hash = spec.charCodeAt(i) + ((hash << 5) - hash);
  return colorPalette[Math.abs(hash) % colorPalette.length];
};

interface SpecializationBadgeProps {
  specialization: string;
}

const SpecializationBadge = ({ specialization }: SpecializationBadgeProps): ReactElement => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${getColor(specialization)}`}>
    {specialization}
  </span>
);

export default SpecializationBadge;
