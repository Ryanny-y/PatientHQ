import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, ShieldAlert, Clock, Users, HelpCircle } from 'lucide-react';
import { type ReactElement } from 'react';

interface DataIntegrityStatsCardsProps {
  total: number;
  valid: number;
  pending: number;
  tampered: number;
  unverified: number;
}

export const DataIntegrityStatsCards = ({
  total,
  valid,
  pending,
  tampered,
  unverified,
}: DataIntegrityStatsCardsProps): ReactElement => {
  const cards = [
    { title: 'Total Patients', value: total, icon: Users, accent: 'bg-slate-50 text-slate-700' },
    { title: 'Valid', value: valid, icon: ShieldCheck, accent: 'bg-green-50 text-green-700' },
    { title: 'Pending', value: pending, icon: Clock, accent: 'bg-amber-50 text-amber-700' },
    { title: 'Tampered', value: tampered, icon: ShieldAlert, accent: 'bg-red-50 text-red-700' },
    { title: 'Not Yet Verified', value: unverified, icon: HelpCircle, accent: 'bg-slate-50 text-slate-500' },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="rounded-xl border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">{card.title}</CardTitle>
              <div className={`p-2 rounded-lg ${card.accent}`}>
                <Icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{card.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
