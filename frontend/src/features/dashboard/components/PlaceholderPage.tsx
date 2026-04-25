import { type ReactElement } from 'react';
import { Construction } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
}

const PlaceholderPage = ({ title }: PlaceholderPageProps): ReactElement => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
    <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
      <Construction className="h-8 w-8 text-slate-400" />
    </div>
    <h2 className="text-lg font-semibold text-slate-700 mb-1">{title}</h2>
    <p className="text-sm text-slate-400">This module is under development.</p>
  </div>
);

export default PlaceholderPage;
