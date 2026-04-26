import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { type ReactElement, useState, useMemo } from "react";
import type { Appointment } from "../types/appointment";
import { StatusBadge } from "./StatusBadge";

interface AppointmentCalendarViewProps {
  appointments: Appointment[];
  onViewAppointment: (appointment: Appointment) => void;
}

export const AppointmentCalendarView = ({
  appointments,
  onViewAppointment,
}: AppointmentCalendarViewProps): ReactElement => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get appointments for the current month
  const monthAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.appointment_date.split(' ')[0]);
      return appointmentDate.getMonth() === currentMonth && appointmentDate.getFullYear() === currentYear;
    });
  }, [appointments, currentMonth, currentYear]);

  // Group appointments by date
  const appointmentsByDate = useMemo(() => {
    const grouped: Record<string, Appointment[]> = {};
    monthAppointments.forEach((appointment) => {
      const dateKey = appointment.appointment_date.split(' ')[0];
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(appointment);
    });
    return grouped;
  }, [monthAppointments]);

  // Generate calendar days
  const generateCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday

    const days = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) { // 6 weeks * 7 days
      const dateKey = current.toISOString().split('T')[0];
      const dayAppointments = appointmentsByDate[dateKey] || [];
      const isCurrentMonth = current.getMonth() === currentMonth;

      days.push({
        date: new Date(current),
        dateKey,
        appointments: dayAppointments,
        isCurrentMonth,
        isToday: current.toDateString() === new Date().toDateString(),
      });

      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-slate-900">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button variant="outline" onClick={goToToday}>
          <CalendarIcon className="h-4 w-4 mr-2" />
          Today
        </Button>
      </div>

      {/* Calendar Grid */}
      <Card className="rounded-xl border-slate-200 shadow-sm">
        <CardHeader className="pb-4">
          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-slate-600">
                {day}
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`min-h-30 p-2 border border-slate-100 rounded-lg ${
                  day.isCurrentMonth ? 'bg-white' : 'bg-slate-50'
                } ${day.isToday ? 'ring-2 ring-blue-500 ring-inset' : ''}`}
              >
                <div className={`text-sm font-medium mb-2 ${
                  day.isCurrentMonth ? 'text-slate-900' : 'text-slate-400'
                } ${day.isToday ? 'text-blue-600' : ''}`}>
                  {day.date.getDate()}
                </div>
                <div className="space-y-1">
                  {day.appointments.slice(0, 3).map((appointment) => (
                    <div
                      key={appointment.appointment_id}
                      className="text-xs p-1 rounded cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => onViewAppointment(appointment)}
                    >
                      <div className="font-medium truncate text-slate-900">
                        {appointment.patient_name.split(' ')[0]}
                      </div>
                      <div className="text-slate-500">
                        {appointment.appointment_date.split(' ')[1]}
                      </div>
                      <StatusBadge status={appointment.status} />
                    </div>
                  ))}
                  {day.appointments.length > 3 && (
                    <div className="text-xs text-slate-500">
                      +{day.appointments.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-amber-100 border border-amber-200 rounded"></div>
          <span>PENDING</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
          <span>CONFIRMED</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
          <span>COMPLETED</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
          <span>CANCELLED</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded"></div>
          <span>NO SHOW</span>
        </div>
      </div>
    </div>
  );
};