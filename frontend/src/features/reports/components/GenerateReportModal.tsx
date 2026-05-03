import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { type ReactElement, useEffect } from 'react';
import type { GenerateReportForm } from '../types/report';

const generateReportSchema = z.object({
  report_type: z.string().min(1, 'Report type is required'),
  patient_id: z.string().min(1, 'Patient is required'),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  notes: z.string().optional(),
});

type GenerateReportValues = z.infer<typeof generateReportSchema>;

interface GenerateReportModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: GenerateReportForm) => Promise<void> | void;
  patients: Array<{ id: string; full_name: string }>;
  isSubmitting?: boolean;
}

export const GenerateReportModal = ({ open, onClose, onSubmit, patients, isSubmitting = false }: GenerateReportModalProps): ReactElement => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<GenerateReportValues>({
    resolver: zodResolver(generateReportSchema),
    defaultValues: {
      report_type: '',
      patient_id: '',
      date_from: '',
      date_to: '',
      notes: '',
    },
  });

  const selectedPatientId = watch('patient_id');

  const onFormSubmit = async (values: GenerateReportValues): Promise<void> => {
    await onSubmit({
      report_type: values.report_type,
      patient_id: values.patient_id,
      date_from: values.date_from,
      date_to: values.date_to,
      notes: values.notes,
    });
    reset();
    onClose();
  };

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-900">Generate New Report</DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            Choose the report type, optional patient, and output format for secure clinical reporting.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2 block">Report Type *</Label>
              <Select value={watch('report_type')} onValueChange={(value) => setValue('report_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PATIENT_SUMMARY">Patient Summary</SelectItem>
                  <SelectItem value="MEDICAL_SUMMARY">Medical Summary</SelectItem>
                  <SelectItem value="APPOINTMENT_SUMMARY">Appointment Summary</SelectItem>
                </SelectContent>
              </Select>
              {errors.report_type && <p className="text-sm text-red-600 mt-1">{errors.report_type.message}</p>}
            </div>

            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2 block">Select Patient *</Label>
              <Select
                value={selectedPatientId}
                onValueChange={(value) => setValue('patient_id', value, { shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.patient_id && <p className="text-sm text-red-600 mt-1">{errors.patient_id.message}</p>}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2 block">Start Date</Label>
              <Input type="date" {...register('date_from')} />
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2 block">End Date</Label>
              <Input type="date" {...register('date_to')} />
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700 mb-2 block">Notes</Label>
            <Input placeholder="Optional report notes" {...register('notes')} />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Generating...' : 'Generate Report'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
