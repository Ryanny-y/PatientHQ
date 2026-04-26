import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { type ReactElement } from "react";
import type { MedicalRecordFormData } from "../types/medicalRecord";

const medicalRecordSchema = z.object({
  patient_id: z.number().min(1, "Patient is required"),
  doctor_id: z.number().min(1, "Doctor is required"),
  diagnosis: z.string().min(1, "Diagnosis is required"),
  treatment: z.string().min(1, "Treatment is required"),
  prescription: z.string().optional(),
  notes: z.string().optional(),
});

type MedicalRecordFormValues = z.infer<typeof medicalRecordSchema>;

interface MedicalRecordFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: MedicalRecordFormData) => void;
  patients: Array<{
    id: number;
    name: string;
    age: number;
    gender: string;
    status: string;
  }>;
  doctors: Array<{ id: number; name: string; specialty: string }>;
  userRole: "admin" | "doctor" | "nurse";
  currentUserId?: number;
}

export const MedicalRecordFormModal = ({
  open,
  onClose,
  onSubmit,
  patients,
  doctors,
  userRole,
  currentUserId,
}: MedicalRecordFormModalProps): ReactElement => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MedicalRecordFormValues>({
    resolver: zodResolver(medicalRecordSchema),
    defaultValues: {
      patient_id: 0,
      doctor_id: userRole === "doctor" && currentUserId ? currentUserId : 0,
      diagnosis: "",
      treatment: "",
      prescription: "",
      notes: "",
    },
  });

  const selectedPatientId = watch("patient_id");
  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  const onFormSubmit = (data: MedicalRecordFormValues) => {
    const formData: MedicalRecordFormData = {
      patient_id: data.patient_id,
      doctor_id: data.doctor_id,
      diagnosis: data.diagnosis,
      treatment: data.treatment,
      prescription: data.prescription || "",
      notes: data.notes || "",
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
            Add Medical Record
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Patient Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-900">
              Patient Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patient_id">Select Patient *</Label>
                <Select
                  value={selectedPatientId?.toString() || ""}
                  onValueChange={(value) =>
                    setValue("patient_id", parseInt(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem
                        key={patient.id}
                        value={patient.id.toString()}
                      >
                        {patient.name} (ID: {patient.id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.patient_id && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.patient_id.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="doctor_id">Attending Doctor *</Label>
                <Select
                  value={watch("doctor_id")?.toString() || ""}
                  onValueChange={(value) =>
                    setValue("doctor_id", parseInt(value))
                  }
                  disabled={userRole === "doctor"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id.toString()}>
                        {doctor.name} - {doctor.specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.doctor_id && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.doctor_id.message}
                  </p>
                )}
              </div>
            </div>

            {selectedPatient && (
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-2">
                  Patient Details
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Name:</span>
                    <div className="font-medium text-slate-900">
                      {selectedPatient.name}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-600">Age:</span>
                    <div className="font-medium text-slate-900">
                      {selectedPatient.age}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-600">Gender:</span>
                    <div className="font-medium text-slate-900">
                      {selectedPatient.gender}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-600">Status:</span>
                    <div className="font-medium text-slate-900">
                      {selectedPatient.status}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Clinical Data */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-900">
              Clinical Information
            </h3>

            <div>
              <Label htmlFor="diagnosis">Diagnosis *</Label>
              <Textarea
                id="diagnosis"
                placeholder="Enter the patient's diagnosis..."
                className="min-h-20"
                {...register("diagnosis")}
              />
              {errors.diagnosis && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.diagnosis.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="treatment">Treatment Plan *</Label>
              <Textarea
                id="treatment"
                placeholder="Describe the treatment plan..."
                className="min-h-20"
                {...register("treatment")}
              />
              {errors.treatment && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.treatment.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="prescription">Prescription</Label>
              <Textarea
                id="prescription"
                placeholder="Enter prescription details if applicable..."
                className="min-h-15"
                {...register("prescription")}
              />
            </div>

            <div>
              <Label htmlFor="notes">Clinical Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional clinical notes and observations..."
                className="min-h-20"
                {...register("notes")}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="button" variant="outline">
              Save Draft
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Record"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
