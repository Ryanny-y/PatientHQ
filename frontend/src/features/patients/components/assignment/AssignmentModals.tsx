import { useEffect, useMemo, useState, type ReactElement } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import type {
  AssignmentRecord,
  DoctorProfile,
  PatientSummary,
  PriorityLevel,
} from '@/features/patients/types/assignment';

interface SearchableSelectOption {
  id: number;
  title: string;
  subtitle: string;
  meta?: string;
}

interface SearchableSelectProps {
  label: string;
  placeholder: string;
  options: SearchableSelectOption[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  helper?: string;
  error?: string;
}

const SearchableSelect = ({
  label,
  placeholder,
  options,
  selectedId,
  onSelect,
  helper,
  error,
}: SearchableSelectProps): ReactElement => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const selectedItem = options.find((option) => option.id === selectedId);
  const filtered = query
    ? options.filter((option) =>
        [option.title, option.subtitle, option.meta]
          .filter((value): value is string => typeof value === 'string')
          .some((value) => value.toLowerCase().includes(query.toLowerCase()))
      )
    : options;

  useEffect(() => {
    if (selectedItem) {
      setQuery(selectedItem.title);
    }
  }, [selectedItem]);

  return (
    <div className="relative">
      <Label>{label}</Label>
      <Input
        value={selectedItem ? selectedItem.title : query}
        placeholder={placeholder}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        className="pr-10"
      />
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
        <Search className="h-4 w-4" />
      </div>
      {helper && <p className="mt-2 text-xs text-slate-400">{helper}</p>}
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
      {open && filtered.length > 0 && (
        <div className="absolute inset-x-0 top-full z-20 mt-2 max-h-56 overflow-auto rounded-3xl border border-slate-200 bg-white shadow-lg">
          {filtered.map((option) => (
            <button
              key={option.id}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                onSelect(option.id);
                setOpen(false);
                setQuery(option.title);
              }}
              className="w-full px-4 py-3 text-left transition hover:bg-slate-50"
            >
              <div className="text-sm font-semibold text-slate-900">{option.title}</div>
              <div className="mt-1 text-xs text-slate-500">{option.subtitle}</div>
              {option.meta && <div className="mt-1 text-[11px] uppercase tracking-[0.24em] text-slate-400">{option.meta}</div>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export interface NewAssignmentPayload {
  patient_id: number;
  doctor_id: number;
  priority: PriorityLevel;
  notes: string;
  is_active: boolean;
}

export interface ReassignPayload {
  assignment_id: number;
  new_doctor_id: number;
  reason: string;
  effective_date: string;
}

const assignSchema = z.object({
  patient_id: z.number().int().positive({ message: 'Choose a patient' }),
  doctor_id: z.number().int().positive({ message: 'Choose a doctor' }),
  priority: z.enum(['Normal', 'Urgent', 'Critical']),
  notes: z.string().max(250).optional(),
  is_active: z.boolean(),
});

const reassignSchema = z.object({
  new_doctor_id: z.number().int().positive({ message: 'Select a new doctor' }),
  reason: z.string().min(10, 'Provide a reassignment reason'),
  effective_date: z.string().optional(),
});

interface AssignDoctorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patients: PatientSummary[];
  doctors: DoctorProfile[];
  assignments: AssignmentRecord[];
  onAssign: (payload: NewAssignmentPayload) => void;
}

export const AssignDoctorModal = ({ open, onOpenChange, patients, doctors, assignments, onAssign }: AssignDoctorModalProps): ReactElement => {
  const {
    control,
    handleSubmit,
    register,
    reset,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof assignSchema>>({
    resolver: zodResolver(assignSchema),
    defaultValues: {
      patient_id: 0,
      doctor_id: 0,
      priority: 'Normal',
      notes: '',
      is_active: true,
    },
    mode: 'onTouched',
  });

  const selectedPatientId = watch('patient_id');
  const selectedDoctorId = watch('doctor_id');
  const selectedDoctor = doctors.find((doctor) => doctor.doctor_id === selectedDoctorId) ?? null;
  const duplicateAssignment = selectedPatientId > 0 && assignments.some((assignment) => assignment.patient_id === selectedPatientId && assignment.is_active);

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = async (values: z.infer<typeof assignSchema>): Promise<void> => {
    if (duplicateAssignment) {
      setError('patient_id', { message: 'This patient already has an active assignment.' });
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    onAssign({
      ...values,
      notes: values.notes ?? '',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>New Care Assignment</DialogTitle>
          <DialogDescription>
            Assign a physician to a patient while preserving workload balance and assignment security.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-6 pb-6 pt-2">
          <div className="grid gap-4 lg:grid-cols-2">
            <Controller
              control={control}
              name="patient_id"
              render={({ field }) => (
                <SearchableSelect
                  label="Select Patient"
                  placeholder="Type patient name or ID"
                  options={patients.map((patient) => ({
                    id: patient.patient_id,
                    title: `${patient.full_name} · ${patient.patient_id}`,
                    subtitle: patient.room,
                    meta: patient.status,
                  }))}
                  selectedId={field.value}
                  onSelect={field.onChange}
                  error={errors.patient_id?.message}
                  helper="Search by patient name, ID, or current ward."
                />
              )}
            />
            <Controller
              control={control}
              name="doctor_id"
              render={({ field }) => (
                <SearchableSelect
                  label="Select Doctor"
                  placeholder="Type doctor or specialization"
                  options={doctors.map((doctor) => ({
                    id: doctor.doctor_id,
                    title: `${doctor.doctor_name} · ${doctor.specialization}`,
                    subtitle: `${doctor.current_load} active patients`,
                    meta: doctor.is_active ? 'Available' : 'Inactive',
                  }))}
                  selectedId={field.value}
                  onSelect={field.onChange}
                  error={errors.doctor_id?.message}
                  helper="Choose an available physician with the most balanced load."
                />
              )}
            />
          </div>

          {selectedDoctor && selectedDoctor.current_load > 16 && (
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
              <span className="font-semibold">High workload warning:</span> {selectedDoctor.doctor_name} is currently handling {selectedDoctor.current_load} active patients.
            </div>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              <Label>Priority Level</Label>
              <select
                className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register('priority')}
              >
                <option value="Normal">Normal</option>
                <option value="Urgent">Urgent</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="is_active">Active Assignment</Label>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <input id="is_active" type="checkbox" className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" {...register('is_active')} defaultChecked />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Enable active assignment</p>
                  <p className="text-xs text-slate-500">Patient will be routed to the assigned physician immediately.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Assignment Notes</Label>
            <Textarea id="notes" rows={4} {...register('notes')} placeholder="Add clinical direction or case context" />
            {errors.notes && <p className="text-xs text-red-500">{errors.notes.message}</p>}
          </div>

          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:justify-end">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <CheckCircle2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Assign Doctor
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface ReassignDoctorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignment: AssignmentRecord | null;
  doctors: DoctorProfile[];
  onConfirm: (payload: ReassignPayload) => void;
}

export const ReassignDoctorModal = ({ open, onOpenChange, assignment, doctors, onConfirm }: ReassignDoctorModalProps): ReactElement => {
  const {
    control,
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof reassignSchema>>({
    resolver: zodResolver(reassignSchema),
    defaultValues: {
      new_doctor_id: 0,
      reason: '',
      effective_date: '',
    },
    mode: 'onTouched',
  });

  const newDoctorId = watch('new_doctor_id');
  const selectedDoctor = doctors.find((doctor) => doctor.doctor_id === newDoctorId) ?? null;

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = async (values: z.infer<typeof reassignSchema>): Promise<void> => {
    if (!assignment) return;
    await new Promise((resolve) => setTimeout(resolve, 400));
    onConfirm({
      assignment_id: assignment.assignment_id,
      new_doctor_id: values.new_doctor_id,
      reason: values.reason,
      effective_date: values.effective_date ?? '',
    });
    onOpenChange(false);
  };

  if (!assignment) {
    return <></>;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Reassign Doctor</DialogTitle>
          <DialogDescription>
            Route the care assignment to a new physician and capture the reason for audit records.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-6 pb-6 pt-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Current physician</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{assignment.doctor_name}</p>
            <p className="text-sm text-slate-500">{assignment.specialization}</p>
          </div>

          <Controller
            control={control}
            name="new_doctor_id"
            render={({ field }) => (
              <SearchableSelect
                label="New Doctor"
                placeholder="Search doctor"
                options={doctors
                  .filter((doctor) => doctor.doctor_id !== assignment.doctor_id)
                  .map((doctor) => ({
                    id: doctor.doctor_id,
                    title: `${doctor.doctor_name} · ${doctor.specialization}`,
                    subtitle: `${doctor.current_load} active patients`,
                    meta: doctor.is_active ? 'Available' : 'Inactive',
                  }))}
                selectedId={field.value}
                onSelect={field.onChange}
                error={errors.new_doctor_id?.message}
              />
            )}
          />

          {selectedDoctor && selectedDoctor.current_load > 16 && (
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
              Recommended: physician is currently handling a heavy caseload, verify coverage before confirming.
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Reassignment</Label>
            <Textarea id="reason" rows={4} {...register('reason')} placeholder="Example: coverage handover or clinical escalation" />
            {errors.reason && <p className="text-xs text-red-500">{errors.reason.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="effective_date">Effective Date</Label>
            <Input id="effective_date" type="date" {...register('effective_date')} />
            {errors.effective_date && <p className="text-xs text-red-500">{errors.effective_date.message}</p>}
          </div>

          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:justify-end">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Confirm Reassignment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface RemoveAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignment: AssignmentRecord | null;
  onRemove: () => void;
}

export const RemoveAssignmentDialog = ({ open, onOpenChange, assignment, onRemove }: RemoveAssignmentDialogProps): ReactElement => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>Remove Assignment</DialogTitle>
        <DialogDescription>
          Remove this doctor assignment? The patient will be unassigned until a new care assignment is created.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 px-6 pb-6 pt-2">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
          <p className="font-semibold text-slate-900">Assignment</p>
          <p>{assignment ? `ASM-${assignment.assignment_id}` : 'No assignment selected.'}</p>
          <p className="mt-3">Patient: {assignment?.patient_name}</p>
          <p>Doctor: {assignment?.doctor_name}</p>
        </div>
        <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-semibold">Warning</p>
          <p>Removing this assignment will return the patient to the unassigned queue until a new physician is assigned.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onRemove}>
            Remove Assignment
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

export const ViewAssignmentDrawer = ({
  open,
  onOpenChange,
  assignment,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignment: AssignmentRecord | null;
}): ReactElement => (
  <Sheet open={open} onOpenChange={onOpenChange}>
    <SheetContent side="right" className="max-w-xl">
      <SheetHeader>
        <SheetTitle>Assignment Details</SheetTitle>
        <SheetDescription>Secure audit view for patient care delivery records.</SheetDescription>
      </SheetHeader>
      <div className="space-y-6 px-6 py-4">
        {assignment ? (
          <>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Assignment</p>
              <div className="mt-4 flex flex-col gap-2 text-sm text-slate-700">
                <p><span className="font-semibold text-slate-900">ID:</span> ASM-{assignment.assignment_id}</p>
                <p><span className="font-semibold text-slate-900">Date assigned:</span> {new Date(assignment.assigned_date).toLocaleDateString()}</p>
                <p><span className="font-semibold text-slate-900">Status:</span> <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${assignment.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>{assignment.is_active ? 'Active' : 'Inactive'}</span></p>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Patient Info</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{assignment.patient_name}</p>
                  </div>
                  <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs uppercase">{assignment.patient_status}</Badge>
                </div>
                <div className="mt-4 grid gap-3 text-sm text-slate-600">
                  <p><span className="font-semibold text-slate-900">Patient ID:</span> {assignment.patient_id}</p>
                  <p><span className="font-semibold text-slate-900">Room/Ward:</span> {assignment.patient_room}</p>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Doctor Info</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{assignment.doctor_name}</p>
                  </div>
                  <Badge variant={assignment.doctor_is_active ? 'success' : 'secondary'} className="rounded-full px-3 py-1 text-xs uppercase">
                    {assignment.doctor_is_active ? 'Available' : 'Inactive'}
                  </Badge>
                </div>
                <div className="mt-4 grid gap-3 text-sm text-slate-600">
                  <p><span className="font-semibold text-slate-900">Doctor ID:</span> {assignment.doctor_id}</p>
                  <p><span className="font-semibold text-slate-900">Specialization:</span> {assignment.specialization}</p>
                  <p><span className="font-semibold text-slate-900">Active patients:</span> {assignment.doctor_active_patients}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
            Select an assignment to view detailed care and audit history.
          </div>
        )}
      </div>
    </SheetContent>
  </Sheet>
);
