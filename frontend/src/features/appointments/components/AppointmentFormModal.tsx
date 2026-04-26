import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { type ReactElement } from "react";
import type { AppointmentFormData } from "../types/appointment";

const appointmentSchema = z.object({
  patient_id: z.number().min(1, "Patient is required"),
  doctor_id: z.number().min(1, "Doctor is required"),
  appointment_date: z.string()
    .min(1, "Date is required")
    .refine((date) => new Date(date) > new Date(), "Appointment must be in the future"),
  reason: z.string().min(1, "Reason is required"),
  notes: z.string().optional(),
  duration_minutes: z.number().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

interface AppointmentFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AppointmentFormData) => void;
  patients: Array<{ id: number; name: string; contact: string }>;
  doctors: Array<{ id: number; name: string; specialization: string }>;
  userRole: 'admin' | 'doctor' | 'nurse';
  currentUserId?: number;
}

export const AppointmentFormModal = ({
  open,
  onClose,
  onSubmit,
  patients,
  doctors,
  userRole,
  currentUserId,
}: AppointmentFormModalProps): ReactElement => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patient_id: 0,
      doctor_id: userRole === 'doctor' && currentUserId ? currentUserId : 0,
      appointment_date: "",
      reason: "",
      notes: "",
      duration_minutes: 30,
    },
  });

  const selectedPatientId = watch("patient_id");
  const selectedPatient = patients.find((p) => p.id === selectedPatientId);
  const selectedDoctorId = watch("doctor_id");
  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId);

  const onFormSubmit = (data: AppointmentFormValues) => {
    const formData: AppointmentFormData = {
      patient_id: data.patient_id,
      doctor_id: data.doctor_id,
      appointment_date: data.appointment_date,
      reason: data.reason,
      notes: data.notes || "",
      duration_minutes: data.duration_minutes || 30,
    };
    onSubmit(formData);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-900">
            Schedule New Appointment
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Scheduling Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-900">Appointment Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patient_id">Select Patient *</Label>
                <Select
                  value={selectedPatientId?.toString() || ""}
                  onValueChange={(value) => setValue("patient_id", parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id.toString()}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.patient_id && (
                  <p className="text-sm text-red-600 mt-1">{errors.patient_id.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="doctor_id">Select Doctor *</Label>
                <Select
                  value={selectedDoctorId?.toString() || ""}
                  onValueChange={(value) => setValue("doctor_id", parseInt(value))}
                  disabled={userRole === 'doctor'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id.toString()}>
                        {doctor.name} - {doctor.specialization}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.doctor_id && (
                  <p className="text-sm text-red-600 mt-1">{errors.doctor_id.message}</p>
                )}
              </div>
            </div>

            {selectedPatient && (
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="text-sm text-slate-600">Patient: {selectedPatient.name}</div>
                <div className="text-sm text-slate-600">Contact: {selectedPatient.contact}</div>
              </div>
            )}

            {selectedDoctor && (
              <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-200">
                <div className="text-sm text-slate-700">
                  <span className="font-medium">Physician:</span> {selectedDoctor.name}
                </div>
                <div className="text-sm text-slate-700">
                  <span className="font-medium">Specialization:</span> {selectedDoctor.specialization}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="appointment_date">Date & Time *</Label>
                <Input
                  id="appointment_date"
                  type="datetime-local"
                  {...register("appointment_date")}
                />
                {errors.appointment_date && (
                  <p className="text-sm text-red-600 mt-1">{errors.appointment_date.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="duration_minutes">Duration (minutes)</Label>
                <Input
                  id="duration_minutes"
                  type="number"
                  defaultValue="30"
                  {...register("duration_minutes", { valueAsNumber: true })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="reason">Reason for Appointment *</Label>
              <Textarea
                id="reason"
                placeholder="Enter the reason for consultation..."
                className="min-h-20"
                {...register("reason")}
              />
              {errors.reason && (
                <p className="text-sm text-red-600 mt-1">{errors.reason.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any special instructions or notes..."
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
              {isSubmitting ? "Scheduling..." : "Schedule Appointment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
