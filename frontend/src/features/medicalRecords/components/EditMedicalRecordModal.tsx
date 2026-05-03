import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { type ReactElement, useEffect } from "react";
import type { MedicalRecord } from "../types/medicalRecord";

const editMedicalRecordSchema = z.object({
  diagnosis: z.string().min(1, "Diagnosis is required"),
  treatment: z.string().min(1, "Treatment is required"),
  prescription: z.string().optional(),
  notes: z.string().optional(),
});

type EditMedicalRecordFormValues = z.infer<typeof editMedicalRecordSchema>;

interface EditMedicalRecordModalProps {
  record: MedicalRecord | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (recordId: string, data: Partial<MedicalRecord>) => void;
}

export const EditMedicalRecordModal = ({
  record,
  open,
  onClose,
  onSubmit,
}: EditMedicalRecordModalProps): ReactElement => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditMedicalRecordFormValues>({
    resolver: zodResolver(editMedicalRecordSchema),
    defaultValues: {
      diagnosis: record?.diagnosis || "",
      treatment: record?.treatment || "",
      prescription: record?.prescription || "",
      notes: record?.notes || "",
    },
  });

  // Reset form when record changes
  useEffect(() => {
    if (record) {
      reset({
        diagnosis: record.diagnosis,
        treatment: record.treatment,
        prescription: record.prescription,
        notes: record.notes,
      });
    }
  }, [record, reset]);

  const onFormSubmit = (data: EditMedicalRecordFormValues) => {
    if (record) {
      onSubmit(record.recordId, data);
      onClose();
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!record) return <></>;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-900">
            Edit Medical Record #{record.recordId}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Read-only Information */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-slate-900 mb-4">Record Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-600">Record ID:</span>
                <div className="font-medium text-slate-900">#{record.recordId}</div>
              </div>
              <div>
                <span className="text-slate-600">Patient:</span>
                <div className="font-medium text-slate-900">{record.patientName}</div>
              </div>
              <div>
                <span className="text-slate-600">Doctor:</span>
                <div className="font-medium text-slate-900">{record.doctorName}</div>
              </div>
              <div>
                <span className="text-slate-600">Created:</span>
                <div className="font-medium text-slate-900">
                  {new Date(record.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Editable Fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-900">Clinical Information</h3>

            <div>
              <Label htmlFor="diagnosis">Diagnosis *</Label>
              <Textarea
                id="diagnosis"
                placeholder="Enter the patient's diagnosis..."
                className="min-h-20"
                {...register("diagnosis")}
              />
              {errors.diagnosis && (
                <p className="text-sm text-red-600 mt-1">{errors.diagnosis.message}</p>
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
                <p className="text-sm text-red-600 mt-1">{errors.treatment.message}</p>
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};