import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { type ReactElement, useEffect } from "react";
import type { Appointment, UpdateAppointmentFormValues } from "../types/appointment";

const rescheduleSchema = z.object({
  appointmentDate: z
    .string()
    .min(1, "Date is required")
    .refine((date) => new Date(date) > new Date(), "Appointment must be in the future"),
  reason: z.string().optional(),
  notes: z.string().optional(),
});

type RescheduleFormValues = z.infer<typeof rescheduleSchema>;

interface RescheduleAppointmentModalProps {
  appointment: Appointment | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (appointmentId: string, data: Partial<UpdateAppointmentFormValues>) => void;
}

export const RescheduleAppointmentModal = ({
  appointment,
  open,
  onClose,
  onSubmit,
}: RescheduleAppointmentModalProps): ReactElement => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RescheduleFormValues>({
    resolver: zodResolver(rescheduleSchema),
    defaultValues: {
      appointmentDate: appointment?.appointmentDate || "",
      reason: appointment?.reason || "",
      notes: appointment?.notes || "",
    },
  });

  useEffect(() => {
    if (appointment) {
      reset({
        appointmentDate: appointment.appointmentDate,
        reason: appointment.reason || "",
        notes: appointment.notes || "",
      });
    }
  }, [appointment, reset]);

  const onFormSubmit = async (data: RescheduleFormValues) => {
    if (appointment) {
      await onSubmit(appointment.appointmentId, {
        appointmentDate: data.appointmentDate,
        reason: data.reason,
        notes: data.notes,
      });
      onClose();
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!appointment) return <></>;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-900">
            Reschedule Appointment #{appointment.appointmentId}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Read-only Information */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="font-medium text-slate-900 mb-3">Current Appointment</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-600">Patient:</span>
                <div className="font-medium text-slate-900">{appointment.patientName}</div>
              </div>
              <div>
                <span className="text-slate-600">Doctor:</span>
                <div className="font-medium text-slate-900">{appointment.doctorName}</div>
              </div>
              <div>
                <span className="text-slate-600">Current Date:</span>
                <div className="font-medium text-slate-900">
                  {new Date(appointment.appointmentDate).toLocaleString()}
                </div>
              </div>
              <div>
                <span className="text-slate-600">Specialization:</span>
                <div className="font-medium text-slate-900">{appointment.specialization}</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Reschedule Fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-900">New Schedule</h3>

            <div>
              <Label htmlFor="appointmentDate">New Date & Time *</Label>
              <Input
                id="appointmentDate"
                type="datetime-local"
                {...register("appointmentDate")}
              />
              {errors.appointmentDate && (
                <p className="text-sm text-red-600 mt-1">{errors.appointmentDate.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="reason">Reason for Appointment</Label>
              <Textarea
                id="reason"
                placeholder="Update the reason if needed..."
                className="min-h-15"
                {...register("reason")}
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes..."
                className="min-h-15"
                {...register("notes")}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Rescheduling..." : "Save New Schedule"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
