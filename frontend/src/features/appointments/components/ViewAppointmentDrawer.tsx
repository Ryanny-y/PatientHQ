import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Edit, Bell, Calendar, Phone, User, Stethoscope, Clock, CheckCircle } from "lucide-react";
import { type ReactElement } from "react";
import type { Appointment } from "../types/appointment";
import { StatusBadge } from "./StatusBadge";

interface ViewAppointmentDrawerProps {
  appointment: Appointment | null;
  open: boolean;
  onClose: () => void;
  onEdit: (appointment: Appointment) => void;
  onNotify: (appointment: Appointment) => void;
}

export const ViewAppointmentDrawer = ({
  appointment,
  open,
  onClose,
  onEdit,
  onNotify,
}: ViewAppointmentDrawerProps): ReactElement => {
  if (!appointment) return <></>;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl">
        <SheetHeader className="pb-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-semibold text-slate-900">
              Appointment #{appointment.appointment_id}
            </SheetTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(appointment)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => onNotify(appointment)}>
                <Bell className="h-4 w-4 mr-2" />
                Notify
              </Button>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] pr-6">
          <div className="space-y-6">
            {/* Appointment Info */}
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Appointment Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Appointment ID</label>
                  <div className="text-sm text-slate-900 mt-1">#{appointment.appointment_id}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Status</label>
                  <div className="mt-1">
                    <StatusBadge status={appointment.status} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Date</label>
                  <div className="text-sm text-slate-900 mt-1">
                    {new Date(appointment.appointment_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Time</label>
                  <div className="text-sm text-slate-900 mt-1">
                    {appointment.appointment_date.split(' ')[1]}
                    {appointment.duration_minutes && ` (${appointment.duration_minutes} min)`}
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-slate-600">Reason</label>
                  <div className="text-sm text-slate-900 mt-1 p-3 bg-white rounded-lg border border-slate-200">
                    {appointment.reason}
                  </div>
                </div>
              </div>
            </div>

            {/* Patient Information */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Patient Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-slate-600">Full Name</label>
                  <div className="text-sm text-slate-900 mt-1">{appointment.patient_name}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Patient ID</label>
                  <div className="text-sm text-slate-900 mt-1">#{appointment.patient_id}</div>
                </div>
                {appointment.patient_contact && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-600" />
                    <div>
                      <label className="text-sm font-medium text-slate-600">Contact</label>
                      <div className="text-sm text-slate-900">{appointment.patient_contact}</div>
                    </div>
                  </div>
                )}
                {appointment.patient_status && (
                  <div>
                    <label className="text-sm font-medium text-slate-600">Status</label>
                    <div className="text-sm text-slate-900 mt-1">{appointment.patient_status}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Doctor Information */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Physician Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-slate-600">Doctor Name</label>
                  <div className="text-sm text-slate-900 mt-1">{appointment.doctor_name}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Specialization</label>
                  <div className="text-sm text-slate-900 mt-1">{appointment.specialization}</div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {appointment.notes && (
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Notes</h3>
                <div className="text-sm text-slate-700 p-3 bg-slate-50 rounded-lg">
                  {appointment.notes}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">Appointment Created</div>
                    <div className="text-sm text-slate-500">
                      {new Date(appointment.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {appointment.status === 'CONFIRMED' && (
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">Appointment Confirmed</div>
                      <div className="text-sm text-slate-500">Patient confirmed attendance</div>
                    </div>
                  </div>
                )}

                {appointment.status === 'COMPLETED' && (
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">Appointment Completed</div>
                      <div className="text-sm text-slate-500">Consultation finished successfully</div>
                    </div>
                  </div>
                )}

                {appointment.status === 'CANCELLED' && (
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <Clock className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">Appointment Cancelled</div>
                      <div className="text-sm text-slate-500">Cancelled by user</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
