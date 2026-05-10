import { useEffect, type ReactElement } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,
} from '@/components/ui/sheet';
import { addVitalSignsSchema, type addVitalSignsFormValues, type VitalSigns } from '../types/vitalSigns';
import type { Patient } from '@/features/patients/types/patient';

// ── View Drawer ────────────────────────────────────────────────────────────

const fmt = (val: number | null, unit: string): string =>
  val !== null && val !== undefined ? `${val} ${unit}` : '—';

interface ViewVitalSignsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vital: VitalSigns | null;
}

export const ViewVitalSignsDrawer = ({ open, onOpenChange, vital }: ViewVitalSignsDrawerProps): ReactElement => (
  <Sheet open={open} onOpenChange={onOpenChange}>
    <SheetContent side="right" className="max-w-xl">
      <SheetHeader>
        <SheetTitle>Vital Signs Details</SheetTitle>
        <SheetDescription>Full monitoring record for this patient entry.</SheetDescription>
      </SheetHeader>
      <div className="space-y-5 px-6 py-4">
        {vital ? (
          <>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Patient</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{vital.patientName}</p>
              <p className="text-sm text-slate-500">
                Recorded by {vital.recordedByName} · {new Date(vital.recordedAt).toLocaleString()}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Temperature', value: fmt(vital.temperature, '°C') },
                { label: 'Heart Rate', value: fmt(vital.heartRate, 'bpm') },
                { label: 'Respiratory Rate', value: fmt(vital.respiratoryRate, '/min') },
                { label: 'Oxygen Saturation', value: fmt(vital.oxygenSaturation, '%') },
                { label: 'Blood Pressure', value: vital.bloodPressure ?? '—' },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className="mt-1 text-base font-semibold text-slate-900">{value}</p>
                </div>
              ))}
            </div>

            {vital.notes && (
              <div className="rounded-3xl border border-slate-200 bg-white p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Notes</p>
                <p className="mt-2 text-sm text-slate-700">{vital.notes}</p>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
            No vital signs record selected.
          </div>
        )}
      </div>
    </SheetContent>
  </Sheet>
);

// ── Add / Edit Modal ───────────────────────────────────────────────────────

interface VitalSignsFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vital: VitalSigns | null;
  patients: Patient[];
  onSubmit: (values: addVitalSignsFormValues) => Promise<void>;
}

export const VitalSignsFormModal = ({
  open,
  onOpenChange,
  vital,
  patients,
  onSubmit,
}: VitalSignsFormModalProps): ReactElement => {
  const isEdit = vital !== null;

  const form = useForm<addVitalSignsFormValues>({
    resolver: zodResolver(addVitalSignsSchema),
    defaultValues: {
      patientId: '',
      temperature: 36.5,
      heartRate: 80,
      respiratoryRate: 12,
      oxygenSaturation: 95,
      bloodPressure: '120/80',
      notes: '',
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
      return;
    }
    if (vital) {
      form.reset({
        patientId: vital.patientId,
        temperature: vital.temperature ?? 36.5,
        heartRate: vital.heartRate ?? 36.5,
        respiratoryRate: vital.respiratoryRate ?? 36.5,
        oxygenSaturation: vital.oxygenSaturation ?? 36.5,
        bloodPressure: vital.bloodPressure ?? '',
        notes: vital.notes ?? '',
      });
    }
  }, [open, vital, form]);

  const handleSubmit: SubmitHandler<addVitalSignsFormValues> = async (values) => {
    await onSubmit(values);
    onOpenChange(false);
};

  const { register, formState: { errors, isSubmitting } } = form;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Vital Signs' : 'Record Vital Signs'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the vital signs entry.' : "Enter the patient's current vital measurements."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5 px-6 pb-6 pt-2">
          {!isEdit && (
            <div className="space-y-1.5">
              <Label htmlFor="patientId">Patient</Label>
              <select
                id="patientId"
                {...register('patientId')}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a patient</option>
                {patients.map((p) => (
                  <option key={p.patientId} value={p.patientId}>
                    {p.fullName}
                  </option>
                ))}
              </select>
              {errors.patientId && <p className="text-xs text-red-500">{errors.patientId.message}</p>}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="temperature">Temperature (°C)</Label>
              <Input id="temperature" type="number" step="0.1" placeholder="e.g. 36.6" {...register('temperature')} />
              {errors.temperature && <p className="text-xs text-red-500">{errors.temperature.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
              <Input id="heartRate" type="number" placeholder="e.g. 72" {...register('heartRate')} />
              {errors.heartRate && <p className="text-xs text-red-500">{errors.heartRate.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="respiratoryRate">Respiratory Rate (/min)</Label>
              <Input id="respiratoryRate" type="number" placeholder="e.g. 16" {...register('respiratoryRate')} />
              {errors.respiratoryRate && <p className="text-xs text-red-500">{errors.respiratoryRate.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="oxygenSaturation">Oxygen Saturation (%)</Label>
              <Input id="oxygenSaturation" type="number" placeholder="e.g. 98" {...register('oxygenSaturation')} />
              {errors.oxygenSaturation && <p className="text-xs text-red-500">{errors.oxygenSaturation.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bloodPressure">Blood Pressure</Label>
            <Input id="bloodPressure" placeholder="e.g. 120/80" {...register('bloodPressure')} />
            {errors.bloodPressure && <p className="text-xs text-red-500">{errors.bloodPressure.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Input id="notes" placeholder="Optional observations..." {...register('notes')} />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isEdit ? 'Save Changes' : 'Record Vitals'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// ── Delete Dialog ──────────────────────────────────────────────────────────

interface DeleteVitalSignsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vital: VitalSigns | null;
  onConfirm: () => void;
}

export const DeleteVitalSignsDialog = ({
  open,
  onOpenChange,
  vital,
  onConfirm,
}: DeleteVitalSignsDialogProps): ReactElement => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Delete Vital Signs Record</DialogTitle>
        <DialogDescription>
          This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 px-6 pb-6 pt-2">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
          <p className="font-semibold text-slate-900">Patient: {vital?.patientName}</p>
          <p className="mt-1">Recorded: {vital ? new Date(vital.recordedAt).toLocaleString() : '—'}</p>
        </div>
        <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-semibold">Warning</p>
          <p>Deleting this record will permanently remove it from the patient's monitoring history.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm}>Delete Record</Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);
