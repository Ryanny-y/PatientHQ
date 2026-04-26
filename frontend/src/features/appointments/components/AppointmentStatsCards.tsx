import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { type ReactElement } from "react";
import type { AppointmentStats } from "../types/appointment";

interface AppointmentStatsCardsProps {
  stats: AppointmentStats;
}

export const AppointmentStatsCards = ({ stats }: AppointmentStatsCardsProps): ReactElement => {
  const cards = [
    {
      title: "Total Appointments",
      value: stats.totalAppointments.toLocaleString(),
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Today's Appointments",
      value: stats.todayAppointments.toString(),
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Pending Confirmations",
      value: stats.pendingConfirmations.toString(),
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Completed This Week",
      value: stats.completedThisWeek.toString(),
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="rounded-xl border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
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
