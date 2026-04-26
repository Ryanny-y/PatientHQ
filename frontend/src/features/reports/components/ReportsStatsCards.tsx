import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, CalendarDays, FolderSearch, BarChart3 } from 'lucide-react';
import { type ReactElement } from 'react';

interface ReportsStatsCardsProps {
  totalReports: number;
  todayReports: number;
  monthlyReports: number;
  mostRequestedType: string;
}

export const ReportsStatsCards = ({
  totalReports,
  todayReports,
  monthlyReports,
  mostRequestedType,
}: ReportsStatsCardsProps): ReactElement => {
  const cards = [
    {
      title: 'Total Reports Generated',
      value: totalReports.toLocaleString(),
      icon: Trophy,
      accent: 'bg-sky-50 text-sky-700',
    },
    {
      title: 'Today’s Reports',
      value: todayReports.toString(),
      icon: CalendarDays,
      accent: 'bg-emerald-50 text-emerald-700',
    },
    {
      title: 'Monthly Reports',
      value: monthlyReports.toString(),
      icon: FolderSearch,
      accent: 'bg-violet-50 text-violet-700',
    },
    {
      title: 'Most Requested Type',
      value: mostRequestedType,
      icon: BarChart3,
      accent: 'bg-slate-50 text-slate-700',
    },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="rounded-3xl border-slate-200 shadow-sm">
            <CardHeader className="flex items-start justify-between gap-4 pb-3">
              <div>
                <CardTitle className="text-sm font-medium text-slate-600">{card.title}</CardTitle>
                <div className="mt-3 text-3xl font-semibold text-slate-900">{card.value}</div>
              </div>
              <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${card.accent}`}>
                <Icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent className="pt-0 text-sm text-slate-500">Confidential operational summary for executive review.</CardContent>
          </Card>
        );
      })}
    </div>
  );
};