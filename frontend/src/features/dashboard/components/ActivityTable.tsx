import { type ReactElement } from 'react';
import { cn } from '@/shared/utils/cn';
import { Badge } from '@/components/ui/badge';
import type { ActivityItem } from '@/features/dashboard/types/dashboard';

interface ActivityTableProps {
  activities: ActivityItem[];
}

const roleBadgeVariant: Record<ActivityItem['role'], 'default' | 'success' | 'secondary'> = {
  Admin: 'default',
  Doctor: 'success',
  Nurse: 'secondary',
};

const statusDot: Record<ActivityItem['status'], string> = {
  success: 'bg-emerald-400',
  warning: 'bg-amber-400',
  info: 'bg-blue-400',
};

const ActivityTable = ({ activities }: ActivityTableProps): ReactElement => (
  <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
      <h3 className="font-semibold text-slate-800">Recent Activities</h3>
      <span className="text-xs text-slate-400">Last 24 hours</span>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-50">
            <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">User</th>
            <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Action</th>
            <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Resource</th>
            <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {activities.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', statusDot[item.status])}></span>
                  <div>
                    <p className="font-medium text-slate-800 leading-none mb-1">{item.user}</p>
                    <Badge variant={roleBadgeVariant[item.role]}>{item.role}</Badge>
                  </div>
                </div>
              </td>
              <td className="px-5 py-3.5 text-slate-600">{item.action}</td>
              <td className="px-5 py-3.5 text-slate-500 hidden md:table-cell font-mono text-xs">{item.resource}</td>
              <td className="px-5 py-3.5 text-slate-400 whitespace-nowrap">{item.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default ActivityTable;
