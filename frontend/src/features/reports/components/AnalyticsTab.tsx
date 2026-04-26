import { type ReactElement } from 'react';
import { AnalyticsCharts } from './AnalyticsCharts';
import type { UserRole } from '../types/report';

interface AnalyticsTabProps {
  userRole: UserRole;
  analyticsData: {
    monthlyReports: Array<{ month: string; value: number }>;
    appointmentOutcomes: Array<{ label: string; value: number; color: string }>;
    commonDiagnoses: Array<{ label: string; count: number }>;
    dailyActivity: Array<{ day: string; value: number }>;
    staffActivity: Array<{ label: string; value: number }>;
  };
}

export const AnalyticsTab = ({ userRole, analyticsData }: AnalyticsTabProps): ReactElement => {
  const visibleAnalytics = userRole === 'nurse'
    ? {
      ...analyticsData,
      commonDiagnoses: analyticsData.commonDiagnoses.slice(0, 2),
      staffActivity: analyticsData.staffActivity.slice(0, 2),
    }
    : analyticsData;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Analytics Overview</h2>
        <p className="text-sm text-slate-500">Clinical and operational performance metrics for secure decision making.</p>
      </div>
      <AnalyticsCharts {...visibleAnalytics} />
    </div>
  );
};