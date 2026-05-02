import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, CheckCircle, Clock, XCircle, Bell, Calendar } from "lucide-react";
import { type ReactElement } from "react";
import type { Appointment, UserRole } from "../types/appointment";
import { StatusBadge } from "./StatusBadge";

interface AppointmentCardListMobileProps {
  appointments: Appointment[];
  userRole: UserRole;
  onViewAppointment: (appointment: Appointment) => void;
  onEditAppointment: (appointment: Appointment) => void;
  onConfirmAppointment: (appointment: Appointment) => void;
  onCompleteAppointment: (appointment: Appointment) => void;
  onRescheduleAppointment: (appointment: Appointment) => void;
  onCancelAppointment: (appointment: Appointment) => void;
}

export const AppointmentCardListMobile = ({
  appointments,
  userRole,
  onViewAppointment,
  onEditAppointment,
  onConfirmAppointment,
  onCompleteAppointment,
  onRescheduleAppointment,
  onCancelAppointment,
}: AppointmentCardListMobileProps): ReactElement => {
  const canEdit = userRole === 'admin' || userRole === 'doctor';

  const truncateText = (text: string | null | undefined, maxLength: number = 60) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <Card key={appointment.appointmentId} className="rounded-xl border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold text-slate-900">Appointment #{appointment.appointmentId}</div>
                <div className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(appointment.appointmentDate).toLocaleDateString()} at {new Date(appointment.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={appointment.status} />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-45">
                    <DropdownMenuItem onClick={() => onViewAppointment(appointment)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    {canEdit && appointment.status !== 'COMPLETED' && appointment.status !== 'CANCELLED' && (
                      <DropdownMenuItem onClick={() => onEditAppointment(appointment)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                    )}
                    {appointment.status === 'PENDING' && (
                      <DropdownMenuItem onClick={() => onConfirmAppointment(appointment)}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Confirm
                      </DropdownMenuItem>
                    )}
                    {appointment.status === 'CONFIRMED' && (
                      <DropdownMenuItem onClick={() => onCompleteAppointment(appointment)}>
                        <Clock className="mr-2 h-4 w-4" />
                        Mark Completed
                      </DropdownMenuItem>
                    )}
                    {appointment.status !== 'COMPLETED' && appointment.status !== 'CANCELLED' && (
                      <DropdownMenuItem onClick={() => onRescheduleAppointment(appointment)}>
                        <Clock className="mr-2 h-4 w-4" />
                        Reschedule
                      </DropdownMenuItem>
                    )}
                    {appointment.status !== 'COMPLETED' && appointment.status !== 'CANCELLED' && (
                      <DropdownMenuItem
                        onClick={() => onCancelAppointment(appointment)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Cancel
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium text-slate-700 mb-1">Patient</div>
                <div className="text-sm text-slate-900">{appointment.patientName}</div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-700 mb-1">Doctor</div>
                  <div className="text-sm text-slate-900">{appointment.doctorName}</div>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-700 mb-1">Specialty</div>
                  <div className="text-sm text-slate-900">{appointment.specialization}</div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-slate-700 mb-1">Reason</div>
                <div className="text-sm text-slate-600 bg-slate-50 rounded-lg p-2">
                  {truncateText(appointment.reason)}
                </div>
              </div>

              {appointment.notes && (
                <div>
                  <div className="text-sm font-medium text-slate-700 mb-1">Notes</div>
                  <div className="text-sm text-slate-600 bg-blue-50 rounded-lg p-2 border-l-4 border-blue-200">
                    {truncateText(appointment.notes)}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
      {appointments.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No appointments found matching your criteria.
        </div>
      )}
    </div>
  );
};
