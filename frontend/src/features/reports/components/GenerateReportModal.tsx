import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { type ReactElement, useEffect } from 'react';
import type { GenerateReportForm } from '../types/report';

const generateReportSchema = z.object({
  report_type: z.string().min(1, 'Report type is required'),
  patient_id: z.number().optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  include_notes: z.boolean(),
  include_history: z.boolean(),
  output_format: z.enum(['PDF', 'CSV', 'Print Preview']),
});

type GenerateReportValues = z.infer<typeof generateReportSchema>;

interface GenerateReportModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: GenerateReportForm) => void;
  patients: Array<{ id: number; full_name: string }>;
}

export const GenerateReportModal = ({ open, onClose, onSubmit, patients }: GenerateReportModalProps): ReactElement => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GenerateReportValues>({
    resolver: zodResolver(generateReportSchema),
    defaultValues: {
      report_type: '',
      patient_id: undefined,
      date_from: '',
      date_to: '',
      include_notes: true,
      include_history: true,
      output_format: 'PDF',
    },
  });

  const selectedPatientId = watch('patient_id');

  const onFormSubmit = (values: GenerateReportValues) => {
    onSubmit({
      report_type: values.report_type,
      patient_id: values.patient_id,
      date_from: values.date_from,
      date_to: values.date_to,
      include_notes: values.include_notes,
      include_history: values.include_history,
      output_format: values.output_format,
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
                  <SelectItem value="Patient Summary">Patient Summary</SelectItem>
                  <SelectItem value="Medical Summary">Medical Summary</SelectItem>
                  <SelectItem value="Appointment Summary">Appointment Summary</SelectItem>
                  <SelectItem value="Admission Report">Admission Report</SelectItem>
                  <SelectItem value="Operational Report">Operational Report</SelectItem>
                </SelectContent>
              </Select>
              {errors.report_type && <p className="text-sm text-red-600 mt-1">{errors.report_type.message}</p>}
            </div>

            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2 block">Select Patient</Label>
              <Select
                value={selectedPatientId ? selectedPatientId.toString() : 'none'}
                onValueChange={(value) => setValue('patient_id', value === 'none' ? undefined : Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Optional patient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id.toString()}>
                      {patient.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-2">
              <Checkbox id="include_notes" {...register('include_notes')} />
              <Label htmlFor="include_notes" className="text-sm font-medium text-slate-700">
                Include Notes
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="include_history" {...register('include_history')} />
              <Label htmlFor="include_history" className="text-sm font-medium text-slate-700">
                Include History
              </Label>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700 mb-2 block">Output Format *</Label>
            <Select value={watch('output_format')} onValueChange={(value) => setValue('output_format', value as 'PDF' | 'CSV' | 'Print Preview')}>
              <SelectTrigger>
                <SelectValue placeholder="Choose output format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PDF">PDF</SelectItem>
                <SelectItem value="CSV">CSV</SelectItem>
                <SelectItem value="Print Preview">Print Preview</SelectItem>
              </SelectContent>
            </Select>
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