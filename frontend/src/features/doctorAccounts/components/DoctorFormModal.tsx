import { useState, useEffect, type ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Stethoscope, Loader2 } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormField } from '@/features/adminAccounts/components/FormField';
import { cn } from '@/shared/utils/cn';
import {
  addDoctorSchema, editDoctorSchema, SPECIALIZATIONS,
  type addDoctorFormValues, type editDoctorFormValues,
} from '@/features/doctorAccounts/types/doctorAccount';
import type { DoctorAccount } from '@/features/doctorAccounts/types/doctorAccount';

const SectionLabel = ({ children }: { children: string }): ReactElement => (
  <div className="flex items-center gap-2 pt-1">
    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{children}</p>
    <div className="flex-1 h-px bg-slate-100" />
  </div>
);

// ── Add Form ───────────────────────────────────────────────────────────────
interface AddFormProps {
  onClose: () => void;
  onSubmit: (values: addDoctorFormValues) => void;
}

const AddDoctorForm = ({ onClose, onSubmit }: AddFormProps): ReactElement => {
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<addDoctorFormValues>({
    resolver: zodResolver(addDoctorSchema),
    defaultValues: {
      username: '', password: '', confirmPassword: '',
      fullName: '', specialization: '', licenseNumber: '',
      email: '', contactNumber: '', isActive: true,
    },
  });

  const isActive = watch('isActive');
  const specialization = watch('specialization');

  const submit = async (values: addDoctorFormValues): Promise<void> => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    onSubmit(values);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="px-6 py-5 space-y-4">
      <SectionLabel>User Credentials</SectionLabel>
      <FormField label="Username" error={errors.username?.message} required>
        <Input placeholder="e.g. drgarcia" className={cn(errors.username && 'border-red-400')} {...register('username')} />
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Password" error={errors.password?.message} required>
          <div className="relative">
            <Input type={showPw ? 'text' : 'password'} placeholder="Min. 8 chars"
              className={cn('pr-9', errors.password && 'border-red-400')} {...register('password')} />
            <button type="button" tabIndex={-1} onClick={() => setShowPw((v) => !v)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              {showPw ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
          </div>
        </FormField>
        <FormField label="Confirm Password" error={errors.confirmPassword?.message} required>
          <div className="relative">
            <Input type={showConfirm ? 'text' : 'password'} placeholder="Re-enter"
              className={cn('pr-9', errors.confirmPassword && 'border-red-400')} {...register('confirmPassword')} />
            <button type="button" tabIndex={-1} onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              {showConfirm ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
          </div>
        </FormField>
      </div>

      <SectionLabel>Doctor Profile</SectionLabel>
      <FormField label="Full Name" error={errors.fullName?.message} required>
        <Input placeholder="e.g. Dr. Antonio Garcia" className={cn(errors.fullName && 'border-red-400')} {...register('fullName')} />
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Specialization" error={errors.specialization?.message} required>
          <Select value={specialization} onValueChange={(v) => setValue('specialization', v)}>
            <SelectTrigger className={cn('h-10 text-sm', errors.specialization && 'border-red-400')}>
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent position='item-aligned'>
              {SPECIALIZATIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="License Number" error={errors.licenseNumber?.message} required>
          <Input placeholder="LIC-YYYY-XXXX" className={cn(errors.licenseNumber && 'border-red-400')} {...register('licenseNumber')} />
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Email Address" error={errors.email?.message} required>
          <Input type="email" placeholder="dr@hospital.com" className={cn(errors.email && 'border-red-400')} {...register('email')} />
        </FormField>
        <FormField label="Contact Number" error={errors.contactNumber?.message} required>
          <Input placeholder="09XXXXXXXXX" className={cn(errors.contactNumber && 'border-red-400')} {...register('contactNumber')} />
        </FormField>
      </div>

      <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-100">
        <Stethoscope className="h-4 w-4 text-emerald-600 shrink-0" />
        <div>
          <p className="text-xs font-medium text-emerald-800">Role: DOCTOR</p>
          <p className="text-xs text-emerald-600">Automatically assigned. Clinical access only.</p>
        </div>
      </div>

      <SectionLabel>Account Status</SectionLabel>
      <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50">
        <div>
          <Label className="text-sm font-medium text-slate-700">Active Account</Label>
          <p className="text-xs text-slate-400 mt-0.5">
            {isActive ? 'Physician can log in and access clinical modules.' : 'Clinical access is currently disabled.'}
          </p>
        </div>
        <Switch checked={isActive} onCheckedChange={(v) => setValue('isActive', v)} />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Create Doctor
        </Button>
      </div>
    </form>
  );
};

// ── Edit Form ──────────────────────────────────────────────────────────────
interface EditFormProps {
  doctor: DoctorAccount;
  onClose: () => void;
  onSubmit: (values: editDoctorFormValues) => void;
}

const EditDoctorForm = ({ doctor, onClose, onSubmit }: EditFormProps): ReactElement => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<editDoctorFormValues>({
    resolver: zodResolver(editDoctorSchema),
    defaultValues: {
      username: doctor.username,
      fullName: doctor.fullName,
      specialization: doctor.specialization,
      licenseNumber: doctor.licenseNumber,
      email: doctor.email || undefined,
      contactNumber: doctor.contactNumber || undefined,
      isActive: doctor.isActive,
    },
  });

  useEffect(() => {
    reset({
      username: doctor.username,
      fullName: doctor.fullName,
      specialization: doctor.specialization,
      licenseNumber: doctor.licenseNumber,
      email: doctor.email ?? undefined,
      contactNumber: doctor.contactNumber ?? undefined,
      isActive: doctor.isActive,
    });
  }, [doctor, reset]);

  const isActive = watch('isActive');
  const specialization = watch('specialization');

  const submit = async (values: editDoctorFormValues): Promise<void> => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    onSubmit(values);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="px-6 py-5 space-y-4">
      <SectionLabel>Physician Profile</SectionLabel>
      <FormField label="Username" error={errors.username?.message} required>
        <Input placeholder="e.g. drgarcia" className={cn(errors.username && 'border-red-400')} {...register('username')} />
      </FormField>
      <FormField label="Full Name" error={errors.fullName?.message} required>
        <Input placeholder="e.g. Dr. Antonio Garcia" className={cn(errors.fullName && 'border-red-400')} {...register('fullName')} />
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Specialization" error={errors.specialization?.message} required>
          <Select value={specialization} onValueChange={(v) => setValue('specialization', v)}>
            <SelectTrigger className={cn('h-10 text-sm', errors.specialization && 'border-red-400')}>
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {SPECIALIZATIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="License Number" error={errors.licenseNumber?.message} required>
          <Input placeholder="LIC-YYYY-XXXX" className={cn(errors.licenseNumber && 'border-red-400')} {...register('licenseNumber')} />
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Email Address" error={errors.email?.message} required>
          <Input type="email" placeholder="dr@hospital.com" className={cn(errors.email && 'border-red-400')} {...register('email')} />
        </FormField>
        <FormField label="Contact Number" error={errors.contactNumber?.message} required>
          <Input placeholder="09XXXXXXXXX" className={cn(errors.contactNumber && 'border-red-400')} {...register('contactNumber')} />
        </FormField>
      </div>

      <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-100">
        <Stethoscope className="h-4 w-4 text-emerald-600 shrink-0" />
        <div>
          <p className="text-xs font-medium text-emerald-800">Role: DOCTOR</p>
          <p className="text-xs text-emerald-600">Password is not editable here. Use Reset Password instead.</p>
        </div>
      </div>

      <SectionLabel>Account Status</SectionLabel>
      <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50">
        <div>
          <Label className="text-sm font-medium text-slate-700">Active Account</Label>
          <p className="text-xs text-slate-400 mt-0.5">
            {isActive ? 'Physician can log in and access clinical modules.' : 'Clinical access is currently disabled.'}
          </p>
        </div>
        <Switch checked={isActive} onCheckedChange={(v) => setValue('isActive', v)} />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </form>
  );
};

// ── Modal Shell ────────────────────────────────────────────────────────────
interface DoctorFormModalProps {
  mode: 'add' | 'edit';
  doctor?: DoctorAccount | null;
  open: boolean;
  onClose: () => void;
  onSubmitAdd?: (values: addDoctorFormValues) => void;
  onSubmitEdit?: (values: editDoctorFormValues) => void;
}

const DoctorFormModal = ({ mode, doctor, open, onClose, onSubmitAdd, onSubmitEdit }: DoctorFormModalProps): ReactElement => (
  <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
    <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center">
            <Stethoscope className="h-4 w-4 text-white" />
          </div>
          <div>
            <DialogTitle>{mode === 'add' ? 'Create Doctor Account' : 'Edit Doctor Account'}</DialogTitle>
            <DialogDescription>
              {mode === 'add' ? 'Register a new physician and clinical profile.' : `Editing credentials for ${doctor?.fullName ?? ''}`}
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      {mode === 'add' && (
        <AddDoctorForm onClose={onClose} onSubmit={onSubmitAdd ?? (() => undefined)} />
      )}
      {mode === 'edit' && doctor && (
        <EditDoctorForm doctor={doctor} onClose={onClose} onSubmit={onSubmitEdit ?? (() => undefined)} />
      )}
    </DialogContent>
  </Dialog>
);

export default DoctorFormModal;
