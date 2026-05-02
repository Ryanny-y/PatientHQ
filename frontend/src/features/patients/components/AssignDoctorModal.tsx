import { useEffect, type ReactElement } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Patient } from "../types/patient";
import type { DoctorAccount } from "@/features/doctorAccounts/types/doctorAccount";
import { SearchableSelect } from "@/features/doctorAssignments/components/AssignmentModals";

const assignSchema = z.object({
  doctorId: z.string().min(1, "Select a doctor"),
});

interface AssignDoctorModalProps {
  patient: Patient | null;
  doctors: DoctorAccount[];
  open: boolean;
  onClose: () => void;
  onAssign: (patientId: string, doctorId: string) => void;
}

export const AssignDoctorModal = ({
  patient,
  doctors,
  open,
  onClose,
  onAssign,
}: AssignDoctorModalProps): ReactElement => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof assignSchema>>({
    resolver: zodResolver(assignSchema),
    defaultValues: { doctorId: "" },
  });

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const onSubmit = (data: z.infer<typeof assignSchema>) => {
    if (!patient) return;
    onAssign(patient.patientId.toString(), data.doctorId);
    onClose();
  };

  const doctorOptions = doctors
    .filter((doctor) => doctor.isActive)
    .map((doctor) => ({
      id: doctor.doctorId,
      title: doctor.fullName,
      subtitle: doctor.specialization,
      meta: doctor.licenseNumber,
    }));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Doctor</DialogTitle>
          <DialogDescription>
            Assign a doctor to {patient?.fullName}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-5 pb-5">
          <Controller
            name="doctorId"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                label="Select Doctor"
                placeholder="Search doctors..."
                options={doctorOptions}
                selectedId={field.value}
                onSelect={field.onChange}
                error={errors.doctorId?.message}
                helper="Choose an available doctor for this patient"
              />
            )}
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Assigning..." : "Assign Doctor"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};