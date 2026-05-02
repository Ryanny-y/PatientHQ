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
import type { CreateAppointmentFormValues } from "../types/appointment";

const appointmentSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  doctorId: z.string().min(1, "Doctor is required"),
  appointmentDate: z
    .string()
    .min(1, "Date is required")
    .refine((date) => new Date(date) > new Date(), "Appointment must be in the future"),
  reason: z.string().optional(),
  notes: z.string().optional(),
});

interface AppointmentFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CreateAppointmentFormValues) => Promise<void>;
  patients: Array<{ patientId: string; fullName: string; contactNumber?: string }>;
  doctors: Array<{ doctorId: string; fullName: string; specialization: string }>;
  currentUserId?: string;
}

export const AppointmentFormModal = ({
  open,
  onClose,
  onSubmit,
  patients,
  doctors,
  currentUserId,
}: AppointmentFormModalProps): ReactElement => {
  const isDoctor = !!currentUserId;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateAppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientId: "",
      doctorId: isDoctor ? currentUserId : "",
      appointmentDate: "",
      reason: "",
      notes: "",
    },
  });

  const selectedPatientId = watch("patientId");
  const selectedPatient = patients.find((p) => p.patientId === selectedPatientId);
  const selectedDoctorId = watch("doctorId");
  const selectedDoctor = doctors.find((d) => d.doctorId === selectedDoctorId);

  const onFormSubmit = async (data: CreateAppointmentFormValues) => {
    await onSubmit(data);
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
                <Label htmlFor="patientId">Select Patient *</Label>
                <Select
                  value={selectedPatientId}
                  onValueChange={(value) => setValue("patientId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.patientId} value={patient.patientId}>
                        {patient.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.patientId && (
                  <p className="text-sm text-red-600 mt-1">{errors.patientId.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="doctorId">Select Doctor *</Label>
                <Select
                  value={selectedDoctorId}
                  onValueChange={(value) => setValue("doctorId", value)}
                  disabled={isDoctor}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.doctorId} value={doctor.doctorId}>
                        {doctor.fullName} - {doctor.specialization}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.doctorId && (
                  <p className="text-sm text-red-600 mt-1">{errors.doctorId.message}</p>
                )}
              </div>
            </div>

            {selectedPatient && (
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="text-sm text-slate-600">Patient: {selectedPatient.fullName}</div>
                {selectedPatient.contactNumber && (
                  <div className="text-sm text-slate-600">Contact: {selectedPatient.contactNumber}</div>
                )}
              </div>
            )}

            {selectedDoctor && (
              <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-200">
                <div className="text-sm text-slate-700">
                  <span className="font-medium">Physician:</span> {selectedDoctor.fullName}
                </div>
                <div className="text-sm text-slate-700">
                  <span className="font-medium">Specialization:</span> {selectedDoctor.specialization}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="appointmentDate">Date & Time *</Label>
                <Input
                  id="appointmentDate"
                  type="datetime-local"
                  {...register("appointmentDate")}
                />
                {errors.appointmentDate && (
                  <p className="text-sm text-red-600 mt-1">{errors.appointmentDate.message}</p>
                )}
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
