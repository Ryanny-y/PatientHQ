import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState, type ReactElement } from "react";
import type { Appointment } from "../types/appointment";

interface CancelAppointmentDialogProps {
  appointment: Appointment | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (appointmentId: string, reason: string) => void;
}

export const CancelAppointmentDialog = ({
  appointment,
  open,
  onClose,
  onConfirm,
}: CancelAppointmentDialogProps): ReactElement => {
  const [cancellationReason, setCancellationReason] = useState("");

  const handleConfirm = () => {
    if (appointment) {
      onConfirm(appointment.appointmentId, cancellationReason);
      setCancellationReason("");
      onClose();
    }
  };

  if (!appointment) return <></>;

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold text-slate-900">
            Cancel Appointment?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-600">
            Are you sure you want to cancel this appointment? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-3 my-4">
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="text-sm">
              <span className="font-medium text-slate-700">Patient:</span>
              <div className="text-slate-900">{appointment.patientName}</div>
            </div>
            <div className="text-sm mt-2">
              <span className="font-medium text-slate-700">Date & Time:</span>
              <div className="text-slate-900">
                {new Date(appointment.appointmentDate).toLocaleString()}
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="cancellation_reason" className="text-sm font-medium text-slate-700">
              Cancellation Reason (Optional)
            </Label>
            <Textarea
              id="cancellation_reason"
              placeholder="Why is this appointment being cancelled?"
              className="mt-1 min-h-20"
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <AlertDialogCancel className="mr-0">Keep Appointment</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Cancel Appointment
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
