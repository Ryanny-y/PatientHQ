import { type ReactElement } from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import type { SecurityStatusItem } from '@/features/dashboard/types/dashboard';

interface SecurityStatusCardProps {
  items: SecurityStatusItem[];
}

const SecurityStatusCard = ({ items }: SecurityStatusCardProps): ReactElement => (
  <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
    <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
      <ShieldCheck className="h-4 w-4 text-blue-600" />
      <h3 className="font-semibold text-slate-800">System Security Status</h3>
    </div>
    <div className="p-5 space-y-4">
      {items.map((item) => (
        <div key={item.label} className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <p className="text-sm font-medium text-slate-800">{item.label}</p>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full capitalize shrink-0">
                {item.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default SecurityStatusCard;
