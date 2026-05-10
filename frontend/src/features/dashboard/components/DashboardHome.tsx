import { type ReactElement } from 'react';
import StatCard from '@/features/dashboard/components/StatCard';
import ActivityTable from '@/features/dashboard/components/ActivityTable';
import SecurityStatusCard from '@/features/dashboard/components/SecurityStatusCard';
import PatientListCard from '@/features/dashboard/components/PatientListCard';
import { useDashboardQuery } from '@/features/dashboard/hooks/useDashboardQuery';
import { AlertCircle, ShieldCheck } from 'lucide-react';

const DashboardHome = (): ReactElement => {
  const { data, isLoading, isError, error } = useDashboardQuery();
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const dashboard = data?.data;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{greeting}, Administrator</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span className="text-xs font-medium text-emerald-700">All Systems Operational</span>
        </div>
      </div>

      {isError && (
        <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error instanceof Error ? error.message : 'Unable to load dashboard data'}</span>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-36 rounded-xl border border-slate-100 bg-white shadow-sm animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="xl:col-span-2 h-80 rounded-xl border border-slate-100 bg-white shadow-sm animate-pulse" />
            <div className="h-80 rounded-xl border border-slate-100 bg-white shadow-sm animate-pulse" />
          </div>
          <div className="h-72 rounded-xl border border-slate-100 bg-white shadow-sm animate-pulse" />
        </div>
      ) : dashboard ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {dashboard.stats.map((stat) => (
              <StatCard key={stat.title} data={stat} />
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="xl:col-span-2">
              <ActivityTable activities={dashboard.activities} />
            </div>
            <div>
              <SecurityStatusCard items={dashboard.securityStatus} />
            </div>
          </div>

          <PatientListCard patients={dashboard.recentPatients} />
        </>
      ) : null}
    </div>
  );
};

export default DashboardHome;
