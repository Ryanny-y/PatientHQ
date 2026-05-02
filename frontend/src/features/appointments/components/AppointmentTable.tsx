import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, CheckCircle, Clock, XCircle } from "lucide-react";
import { type ReactElement } from "react";
import type { Appointment, UserRole } from "../types/appointment";
import { StatusBadge } from "./StatusBadge";

interface AppointmentTableProps {
  appointments: Appointment[];
  userRole: UserRole;
  onViewAppointment: (appointment: Appointment) => void;
  onEditAppointment: (appointment: Appointment) => void;
  onConfirmAppointment: (appointment: Appointment) => void;
  onCompleteAppointment: (appointment: Appointment) => void;
  onRescheduleAppointment: (appointment: Appointment) => void;
  onCancelAppointment: (appointment: Appointment) => void;
}

export const AppointmentTable = ({
  appointments,
  userRole,
  onViewAppointment,
  onEditAppointment,
  onConfirmAppointment,
  onCompleteAppointment,
  onRescheduleAppointment,
  onCancelAppointment,
}: AppointmentTableProps): ReactElement => {
  const canEdit = userRole === 'admin' || userRole === 'doctor';
  const canConfirm = userRole === 'admin' || userRole === 'doctor';

  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return {
      date: date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const truncateText = (text: string | null | undefined, maxLength: number = 40) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50">
            <TableHead className="font-semibold text-slate-700">Appointment ID</TableHead>
            <TableHead className="font-semibold text-slate-700">Date & Time</TableHead>
            <TableHead className="font-semibold text-slate-700">Patient</TableHead>
            <TableHead className="font-semibold text-slate-700">Doctor</TableHead>
            <TableHead className="font-semibold text-slate-700">Specialization</TableHead>
            <TableHead className="font-semibold text-slate-700">Reason</TableHead>
            <TableHead className="font-semibold text-slate-700">Status</TableHead>
            <TableHead className="font-semibold text-slate-700">Created</TableHead>
            <TableHead className="font-semibold text-slate-700 w-17.5">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => {
            const { date, time } = formatDateTime(appointment.appointmentDate);
            return (
              <TableRow key={appointment.appointmentId} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="font-medium text-slate-900">
                  #{appointment.appointmentId}
                </TableCell>
                <TableCell className="text-slate-700">
                  <div className="font-medium">{date}</div>
                  <div className="text-sm text-slate-500">{time}</div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-slate-900">{appointment.patientName}</div>
                  </div>
                </TableCell>
                <TableCell className="text-slate-700">{appointment.doctorName}</TableCell>
                <TableCell className="text-slate-700">{appointment.specialization}</TableCell>
                <TableCell>
                  <div title={appointment.reason || ''} className="max-w-50 text-slate-600">
                    {truncateText(appointment.reason)}
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={appointment.status} />
                </TableCell>
                <TableCell className="text-slate-600">
                  {new Date(appointment.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
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
                      {canConfirm && appointment.status === 'PENDING' && (
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
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {appointments.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No appointments found matching your criteria.
        </div>
      )}
    </div>
  );
};
