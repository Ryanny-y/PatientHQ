import { useState, useEffect, type ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, HeartPulse, Loader2 } from 'lucide-react';
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
  addNurseSchema, editNurseSchema, WARDS,
  type addNurseFormValues, type editNurseFormValues,
} from '@/features/nurseAccounts/types/nurseAccount';
import type { NurseAccount } from '@/features/nurseAccounts/types/nurseAccount';

const SectionLabel = ({ children }: { children: string }): ReactElement => (
  <div className="flex items-center gap-2 pt-1">
    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{children}</p>
    <div className="flex-1 h-px bg-slate-100" />
  </div>
);

// ── Add Form ───────────────────────────────────────────────────────────────
interface AddFormProps {
  onClose: () => void;
  onSubmit: (values: addNurseFormValues) => void;
}

const AddNurseForm = ({ onClose, onSubmit }: AddFormProps): ReactElement => {
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<addNurseFormValues>({
    resolver: zodResolver(addNurseSchema),
    defaultValues: {
      username: '', password: '', confirm_password: '',
      full_name: '', assigned_ward: '', license_number: '',
      email: '', contact_number: '', is_active: true,
    },
  });

  const isActive = watch('is_active');
  const assignedWard = watch('assigned_ward');

  const submit = async (values: addNurseFormValues): Promise<void> => {
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
        <Input placeholder="e.g. nursecruz" className={cn(errors.username && 'border-red-400')} {...register('username')} />
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
        <FormField label="Confirm Password" error={errors.confirm_password?.message} required>
          <div className="relative">
            <Input type={showConfirm ? 'text' : 'password'} placeholder="Re-enter"
              className={cn('pr-9', errors.confirm_password && 'border-red-400')} {...register('confirm_password')} />
            <button type="button" tabIndex={-1} onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              {showConfirm ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
          </div>
        </FormField>
      </div>

      <SectionLabel>Nurse Profile</SectionLabel>
      <FormField label="Full Name" error={errors.full_name?.message} required>
        <Input placeholder="e.g. Angela Cruz, RN" className={cn(errors.full_name && 'border-red-400')} {...register('full_name')} />
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Assigned Ward" error={errors.assigned_ward?.message} required>
          <Select value={assignedWard} onValueChange={(v) => setValue('assigned_ward', v)}>
            <SelectTrigger className={cn('h-10 text-sm', errors.assigned_ward && 'border-red-400')}>
              <SelectValue placeholder="Select ward..." />
            </SelectTrigger>
            <SelectContent>
              {WARDS.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="License Number" error={errors.license_number?.message} required>
          <Input placeholder="RN-YYYY-XXXX" className={cn(errors.license_number && 'border-red-400')} {...register('license_number')} />
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Email Address" error={errors.email?.message} required>
          <Input type="email" placeholder="nurse@hospital.com" className={cn(errors.email && 'border-red-400')} {...register('email')} />
        </FormField>
        <FormField label="Contact Number" error={errors.contact_number?.message} required>
          <Input placeholder="09XXXXXXXXX" className={cn(errors.contact_number && 'border-red-400')} {...register('contact_number')} />
        </FormField>
      </div>

      <div className="flex items-center gap-3 p-3 rounded-lg bg-violet-50 border border-violet-100">
        <HeartPulse className="h-4 w-4 text-violet-600 shrink-0" />
        <div>
          <p className="text-xs font-medium text-violet-800">Role: NURSE</p>
          <p className="text-xs text-violet-600">Automatically assigned. Operational ward access only.</p>
        </div>
      </div>

      <SectionLabel>Account Status</SectionLabel>
      <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50">
        <div>
          <Label className="text-sm font-medium text-slate-700">Active Account</Label>
          <p className="text-xs text-slate-400 mt-0.5">
            {isActive ? 'Nurse can log in and access ward modules.' : 'Operational access is currently disabled.'}
          </p>
        </div>
        <Switch checked={isActive} onCheckedChange={(v) => setValue('is_active', v)} />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting} className="bg-violet-600 hover:bg-violet-700">
          {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Create Nurse
        </Button>
      </div>
    </form>
  );
};

// ── Edit Form ──────────────────────────────────────────────────────────────
interface EditFormProps {
  nurse: NurseAccount;
  onClose: () => void;
  onSubmit: (values: editNurseFormValues) => void;
}

const EditNurseForm = ({ nurse, onClose, onSubmit }: EditFormProps): ReactElement => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<editNurseFormValues>({
    resolver: zodResolver(editNurseSchema),
    defaultValues: {
      username: nurse.username, full_name: nurse.full_name,
      assigned_ward: nurse.assigned_ward, license_number: nurse.license_number,
      email: nurse.email, contact_number: nurse.contact_number, is_active: nurse.is_active,
    },
  });

  useEffect(() => {
    reset({
      username: nurse.username, full_name: nurse.full_name,
      assigned_ward: nurse.assigned_ward, license_number: nurse.license_number,
      email: nurse.email, contact_number: nurse.contact_number, is_active: nurse.is_active,
    });
  }, [nurse, reset]);

  const isActive = watch('is_active');
  const assignedWard = watch('assigned_ward');

  const submit = async (values: editNurseFormValues): Promise<void> => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    onSubmit(values);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="px-6 py-5 space-y-4">
      <SectionLabel>Nursing Profile</SectionLabel>
      <FormField label="Username" error={errors.username?.message} required>
        <Input placeholder="e.g. nursecruz" className={cn(errors.username && 'border-red-400')} {...register('username')} />
      </FormField>
      <FormField label="Full Name" error={errors.full_name?.message} required>
        <Input placeholder="e.g. Angela Cruz, RN" className={cn(errors.full_name && 'border-red-400')} {...register('full_name')} />
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Assigned Ward" error={errors.assigned_ward?.message} required>
          <Select value={assignedWard} onValueChange={(v) => setValue('assigned_ward', v)}>
            <SelectTrigger className={cn('h-10 text-sm', errors.assigned_ward && 'border-red-400')}>
              <SelectValue placeholder="Select ward..." />
            </SelectTrigger>
            <SelectContent>
              {WARDS.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="License Number" error={errors.license_number?.message} required>
          <Input placeholder="RN-YYYY-XXXX" className={cn(errors.license_number && 'border-red-400')} {...register('license_number')} />
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Email Address" error={errors.email?.message} required>
          <Input type="email" placeholder="nurse@hospital.com" className={cn(errors.email && 'border-red-400')} {...register('email')} />
        </FormField>
        <FormField label="Contact Number" error={errors.contact_number?.message} required>
          <Input placeholder="09XXXXXXXXX" className={cn(errors.contact_number && 'border-red-400')} {...register('contact_number')} />
        </FormField>
      </div>

      <div className="flex items-center gap-3 p-3 rounded-lg bg-violet-50 border border-violet-100">
        <HeartPulse className="h-4 w-4 text-violet-600 shrink-0" />
        <div>
          <p className="text-xs font-medium text-violet-800">Role: NURSE</p>
          <p className="text-xs text-violet-600">Password is not editable here. Use Reset Password instead.</p>
        </div>
      </div>

      <SectionLabel>Account Status</SectionLabel>
      <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50">
        <div>
          <Label className="text-sm font-medium text-slate-700">Active Account</Label>
          <p className="text-xs text-slate-400 mt-0.5">
            {isActive ? 'Nurse can log in and access ward modules.' : 'Operational access is currently disabled.'}
          </p>
        </div>
        <Switch checked={isActive} onCheckedChange={(v) => setValue('is_active', v)} />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting} className="bg-violet-600 hover:bg-violet-700">
          {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </form>
  );
};

// ── Modal Shell ────────────────────────────────────────────────────────────
interface NurseFormModalProps {
  mode: 'add' | 'edit';
  nurse?: NurseAccount | null;
  open: boolean;
  onClose: () => void;
  onSubmitAdd?: (values: addNurseFormValues) => void;
  onSubmitEdit?: (values: editNurseFormValues) => void;
}

const NurseFormModal = ({ mode, nurse, open, onClose, onSubmitAdd, onSubmitEdit }: NurseFormModalProps): ReactElement => (
  <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
    <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-violet-600 flex items-center justify-center">
            <HeartPulse className="h-4 w-4 text-white" />
          </div>
          <div>
            <DialogTitle>{mode === 'add' ? 'Create Nurse Account' : 'Edit Nurse Account'}</DialogTitle>
            <DialogDescription>
              {mode === 'add' ? 'Register a new nurse and ward assignment.' : `Editing credentials for ${nurse?.full_name ?? ''}`}
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>
      {mode === 'add' && <AddNurseForm onClose={onClose} onSubmit={onSubmitAdd ?? (() => undefined)} />}
      {mode === 'edit' && nurse && <EditNurseForm nurse={nurse} onClose={onClose} onSubmit={onSubmitEdit ?? (() => undefined)} />}
    </DialogContent>
  </Dialog>
);

export default NurseFormModal;
