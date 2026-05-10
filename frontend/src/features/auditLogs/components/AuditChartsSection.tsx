import { type ReactElement } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, PieChart, TrendingUp } from 'lucide-react';
import type { AuditLog } from '@/features/auditLogs/types/auditLog';

interface AuditChartsSectionProps {
  logs: AuditLog[];
}

const countBy = (logs: AuditLog[], getKey: (log: AuditLog) => string): Array<{ label: string; count: number }> => {
  const counts = new Map<string, number>();
  logs.forEach((log) => counts.set(getKey(log), (counts.get(getKey(log)) ?? 0) + 1));
  return Array.from(counts.entries()).map(([label, count]) => ({ label, count }));
};

const getDayLabel = (date: string): string =>
  new Date(date).toLocaleDateString('en-US', { weekday: 'short' });

const AuditChartsSection = ({ logs }: AuditChartsSectionProps): ReactElement => {
  const roleData = countBy(logs, (log) => log.role)
    .map((item, index) => ({
      role: item.label,
      count: item.count,
      color: ['bg-blue-500', 'bg-green-500', 'bg-purple-500'][index % 3],
    }));

  const severityData = countBy(logs, (log) => log.severity)
    .map((item) => ({
      severity: item.label,
      count: item.count,
      color: item.label === 'Critical' ? 'bg-red-500' : item.label === 'Warning' ? 'bg-amber-500' : 'bg-blue-500',
    }));

  const dailyData = countBy(logs, (log) => getDayLabel(log.created_at))
    .map((item) => ({ day: item.label, count: item.count }));

  const actionsData = countBy(logs, (log) => log.action.replace(/_/g, ' '))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map((item) => ({ action: item.label, count: item.count }));

  const maxRole = Math.max(1, ...roleData.map(d => d.count));
  const maxSeverity = Math.max(1, ...severityData.map(d => d.count));
  const maxDaily = Math.max(1, ...dailyData.map(d => d.count));
  const maxActions = Math.max(1, ...actionsData.map(d => d.count));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Logs by Role */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-blue-600" />
            Logs by Role
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {roleData.map((item) => (
              <div key={item.role} className="flex items-center gap-3">
                <span className="text-sm text-slate-600 w-12">{item.role}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${item.color}`}
                    style={{ width: `${(item.count / maxRole) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-slate-900 w-8">{item.count}</span>
              </div>
            ))}
            {roleData.length === 0 && <p className="text-sm text-slate-500">No role activity in the current results.</p>}
          </div>
        </CardContent>
      </Card>

      {/* Daily Activity Trend */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            Daily Activity Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-32">
            {dailyData.map((item) => (
              <div key={item.day} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-blue-500 rounded-t"
                  style={{ height: `${(item.count / maxDaily) * 100}%` }}
                />
                <span className="text-xs text-slate-500">{item.day}</span>
              </div>
            ))}
            {dailyData.length === 0 && <p className="text-sm text-slate-500">No activity in the current results.</p>}
          </div>
        </CardContent>
      </Card>

      {/* Security Severity Breakdown */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <PieChart className="h-4 w-4 text-red-600" />
            Security Severity Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {severityData.map((item) => (
              <div key={item.severity} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                <span className="text-sm text-slate-600 flex-1">{item.severity}</span>
                <span className="text-sm font-medium text-slate-900">{item.count}</span>
                <div className="w-16 bg-slate-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${item.color}`}
                    style={{ width: `${(item.count / maxSeverity) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {severityData.length === 0 && <p className="text-sm text-slate-500">No severity data in the current results.</p>}
          </div>
        </CardContent>
      </Card>

      {/* Top Performed Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-purple-600" />
            Top Performed Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {actionsData.map((item) => (
              <div key={item.action} className="flex items-center gap-3">
                <span className="text-sm text-slate-600 flex-1 truncate">{item.action}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-purple-500"
                    style={{ width: `${(item.count / maxActions) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-slate-900 w-8">{item.count}</span>
              </div>
            ))}
            {actionsData.length === 0 && <p className="text-sm text-slate-500">No actions in the current results.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditChartsSection;
