import { useEffect, useState, type ReactElement } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  DoctorAssignment,
} from '@/features/doctorAssignments/types/assignment';
import type { DoctorAccount } from '@/features/doctorAccounts/types/doctorAccount';

interface SearchableSelectOption {
  id: string;
  title: string;
  subtitle: string;
  meta?: string;
}

interface SearchableSelectProps {
  label: string;
  placeholder: string;
  options: SearchableSelectOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
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
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);

  // Sync input display when selectedId changes externally (e.g. form reset)
  useEffect(() => {
    const match = options.find((o) => o.id === selectedId);
    setInputValue(match ? match.title : '');
  }, [selectedId, options]);

  const filtered = inputValue && !options.find((o) => o.id === selectedId && o.title === inputValue)
    ? options.filter((option) =>
        [option.title, option.subtitle, option.meta]
          .filter((value): value is string => typeof value === 'string')
          .some((value) => value.toLowerCase().includes(inputValue.toLowerCase()))
      )
    : options;

  return (
    <div className="relative">
      <Label>{label}</Label>
      <Input
        value={inputValue}
        placeholder={placeholder}
        onChange={(event) => {
          setInputValue(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        className="pr-10"
      />
      <div className="pointer-events-none absolute right-3 top-[calc(50%+11px)] -translate-y-1/2 text-slate-400">
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
                setInputValue(option.title);
                setOpen(false);
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

export { SearchableSelect };

export interface ReassignPayload {
  assignmentId: string;
  newDoctorId: string;
}

const reassignSchema = z.object({
  newDoctorId: z.string().min(1, 'Select a new doctor'),
});

interface ReassignDoctorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignment: DoctorAssignment | null;
  doctors: DoctorAccount[];
  onConfirm: (payload: ReassignPayload) => void;
}

export const ReassignDoctorModal = ({ open, onOpenChange, assignment, doctors, onConfirm }: ReassignDoctorModalProps): ReactElement => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof reassignSchema>>({
    resolver: zodResolver(reassignSchema),
    defaultValues: { newDoctorId: '' },
    mode: 'onTouched',
  });

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = async (values: z.infer<typeof reassignSchema>): Promise<void> => {
    if (!assignment) return;
    onConfirm({ assignmentId: assignment.assignmentId, newDoctorId: values.newDoctorId });
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
            Route the care assignment to a new physician.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-6 pb-6 pt-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Current physician</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{assignment.doctorName}</p>
            <p className="text-sm text-slate-500">{assignment.doctorSpecialization}</p>
          </div>

          <Controller
            control={control}
            name="newDoctorId"
            render={({ field }) => (
              <SearchableSelect
                label="New Doctor"
                placeholder="Search doctor"
                options={doctors
                  .filter((doctor) => doctor.doctorId !== assignment.doctorId)
                  .map((doctor) => ({
                    id: doctor.doctorId,
                    title: `${doctor.fullName} · ${doctor.specialization}`,
                    subtitle: doctor.specialization,
                    meta: doctor.isActive ? 'Available' : 'Inactive',
                  }))}
                selectedId={field.value}
                onSelect={field.onChange}
                error={errors.newDoctorId?.message}
              />
            )}
          />

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
  assignment: DoctorAssignment | null;
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
          <p>{assignment ? assignment.assignmentId.slice(0, 8).toUpperCase() : 'No assignment selected.'}</p>
          <p className="mt-3">Patient: {assignment?.patientName}</p>
          <p>Doctor: {assignment?.doctorName}</p>
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
  assignment: DoctorAssignment | null;
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
                <p><span className="font-semibold text-slate-900">ID:</span> {assignment.assignmentId.slice(0, 8).toUpperCase()}</p>
                <p><span className="font-semibold text-slate-900">Date assigned:</span> {new Date(assignment.assignedDate).toLocaleDateString()}</p>
                <p><span className="font-semibold text-slate-900">Status:</span> <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${assignment.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>{assignment.isActive ? 'Active' : 'Inactive'}</span></p>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Patient Info</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{assignment.patientName}</p>
                  </div>
                  <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs uppercase">{assignment.patientStatus}</Badge>
                </div>
                <div className="mt-4 grid gap-3 text-sm text-slate-600">
                  <p><span className="font-semibold text-slate-900">Patient ID:</span> {assignment.patientId}</p>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Doctor Info</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{assignment.doctorName}</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 text-sm text-slate-600">
                  <p><span className="font-semibold text-slate-900">Doctor ID:</span> {assignment.doctorId}</p>
                  <p><span className="font-semibold text-slate-900">Specialization:</span> {assignment.doctorSpecialization}</p>
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
