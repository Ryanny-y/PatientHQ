import { type ReactElement } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, PieChart, TrendingUp } from 'lucide-react';

const AuditChartsSection = (): ReactElement => {
  // Mock data for charts
  const roleData = [
    { role: 'Admin', count: 45, color: 'bg-blue-500' },
    { role: 'Doctor', count: 120, color: 'bg-green-500' },
    { role: 'Nurse', count: 85, color: 'bg-purple-500' },
  ];

  const severityData = [
    { severity: 'Info', count: 180, color: 'bg-blue-500' },
    { severity: 'Warning', count: 45, color: 'bg-amber-500' },
    { severity: 'Critical', count: 15, color: 'bg-red-500' },
  ];

  const dailyData = [
    { day: 'Mon', count: 25 },
    { day: 'Tue', count: 32 },
    { day: 'Wed', count: 28 },
    { day: 'Thu', count: 35 },
    { day: 'Fri', count: 42 },
    { day: 'Sat', count: 18 },
    { day: 'Sun', count: 20 },
  ];

  const actionsData = [
    { action: 'Login Success', count: 85 },
    { action: 'View Records', count: 65 },
    { action: 'Update Records', count: 45 },
    { action: 'Create Records', count: 25 },
    { action: 'Delete Records', count: 10 },
  ];

  const maxRole = Math.max(...roleData.map(d => d.count));
  const maxSeverity = Math.max(...severityData.map(d => d.count));
  const maxDaily = Math.max(...dailyData.map(d => d.count));
  const maxActions = Math.max(...actionsData.map(d => d.count));

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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditChartsSection;