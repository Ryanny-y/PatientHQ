import { useState, useEffect, type ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, ShieldCheck, Loader2 } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { FormField } from '@/features/adminAccounts/components/FormField';
import { cn } from '@/shared/utils/cn';
import {
  addAdminSchema, editAdminSchema,
  type addAdminFormValues, type editAdminFormValues,
} from '@/features/adminAccounts/types/adminAccount';
import type { AdminAccount } from '@/features/adminAccounts/types/adminAccount';

const SectionLabel = ({ children }: { children: string }): ReactElement => (
  <div className="flex items-center gap-2 pt-1">
    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{children}</p>
    <div className="flex-1 h-px bg-slate-100" />
  </div>
);

// ── Add Form ───────────────────────────────────────────────────────────────
interface AddFormProps {
  onClose: () => void;
  onSubmit: (values: addAdminFormValues) => void;
}

const AddAdminForm = ({ onClose, onSubmit }: AddFormProps): ReactElement => {
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<addAdminFormValues>({
    resolver: zodResolver(addAdminSchema),
    defaultValues: { username: '', password: '', confirmPassword: '', fullName: '', email: '', contactNumber: '', isActive: true },
  });

  const isActive = watch('isActive');

  const submit = async (values: addAdminFormValues): Promise<void> => {
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
        <Input placeholder="e.g. admin.santos" className={cn(errors.username && 'border-red-400')} {...register('username')} />
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

      <SectionLabel>Profile Information</SectionLabel>
      <FormField label="Full Name" error={errors.fullName?.message} required>
        <Input placeholder="e.g. Maria Santos" className={cn(errors.fullName && 'border-red-400')} {...register('fullName')} />
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Email Address" error={errors.email?.message} required>
          <Input type="email" placeholder="admin@hospital.com" className={cn(errors.email && 'border-red-400')} {...register('email')} />
        </FormField>
        <FormField label="Contact Number" error={errors.contactNumber?.message} required>
          <Input placeholder="09XXXXXXXXX" className={cn(errors.contactNumber && 'border-red-400')} {...register('contactNumber')} />
        </FormField>
      </div>

      <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
        <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
        <div>
          <p className="text-xs font-medium text-blue-800">Role: ADMIN</p>
          <p className="text-xs text-blue-500">Automatically assigned to all accounts on this page.</p>
        </div>
      </div>

      <SectionLabel>Account Status</SectionLabel>
      <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50">
        <div>
          <Label className="text-sm font-medium text-slate-700">Active Account</Label>
          <p className="text-xs text-slate-400 mt-0.5">
            {isActive ? 'Admin can log in and access the system.' : 'Admin access is currently disabled.'}
          </p>
        </div>
        <Switch checked={isActive} onCheckedChange={(v) => setValue('isActive', v)} />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Create Admin
        </Button>
      </div>
    </form>
  );
};

// ── Edit Form ──────────────────────────────────────────────────────────────
interface EditFormProps {
  admin: AdminAccount;
  onClose: () => void;
  onSubmit: (values: editAdminFormValues) => void;
}

const EditAdminForm = ({ admin, onClose, onSubmit }: EditFormProps): ReactElement => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<editAdminFormValues>({
    resolver: zodResolver(editAdminSchema),
    defaultValues: { username: admin.username, fullName: admin.fullName, email: admin.email, contactNumber: admin.contactNumber, isActive: admin.isActive },
  });

  useEffect(() => {
    reset({ username: admin.username, fullName: admin.fullName, email: admin.email, contactNumber: admin.contactNumber, isActive: admin.isActive });
  }, [admin, reset]);

  const isActive = watch('isActive');

  const submit = async (values: editAdminFormValues): Promise<void> => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    onSubmit(values);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="px-6 py-5 space-y-4">
      <SectionLabel>Profile Information</SectionLabel>
      <FormField label="Username" error={errors.username?.message} required>
        <Input placeholder="e.g. admin.santos" className={cn(errors.username && 'border-red-400')} {...register('username')} />
      </FormField>
      <FormField label="Full Name" error={errors.fullName?.message} required>
        <Input placeholder="e.g. Maria Santos" className={cn(errors.fullName && 'border-red-400')} {...register('fullName')} />
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Email Address" error={errors.email?.message} required>
          <Input type="email" placeholder="admin@hospital.com" className={cn(errors.email && 'border-red-400')} {...register('email')} />
        </FormField>
        <FormField label="Contact Number" error={errors.contactNumber?.message} required>
          <Input placeholder="09XXXXXXXXX" className={cn(errors.contactNumber && 'border-red-400')} {...register('contactNumber')} />
        </FormField>
      </div>

      <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
        <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
        <div>
          <p className="text-xs font-medium text-blue-800">Role: ADMIN</p>
          <p className="text-xs text-blue-500">Password is not editable here. Use Reset Password instead.</p>
        </div>
      </div>

      <SectionLabel>Account Status</SectionLabel>
      <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50">
        <div>
          <Label className="text-sm font-medium text-slate-700">Active Account</Label>
          <p className="text-xs text-slate-400 mt-0.5">
            {isActive ? 'Admin can log in and access the system.' : 'Admin access is currently disabled.'}
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
interface AdminFormModalProps {
  mode: 'add' | 'edit';
  admin?: AdminAccount | null;
  open: boolean;
  onClose: () => void;
  onSubmitAdd?: (values: addAdminFormValues) => void;
  onSubmitEdit?: (values: editAdminFormValues) => void;
}

const AdminFormModal = ({ mode, admin, open, onClose, onSubmitAdd, onSubmitEdit }: AdminFormModalProps): ReactElement => (
  <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
    <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <ShieldCheck className="h-4 w-4 text-white" />
          </div>
          <div>
            <DialogTitle>{mode === 'add' ? 'Create Admin Account' : 'Edit Admin Account'}</DialogTitle>
            <DialogDescription>
              {mode === 'add' ? 'Add a new hospital administrator.' : `Editing account for ${admin?.fullName ?? ''}`}
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      {mode === 'add' && (
        <AddAdminForm onClose={onClose} onSubmit={onSubmitAdd ?? (() => undefined)} />
      )}
      {mode === 'edit' && admin && (
        <EditAdminForm admin={admin} onClose={onClose} onSubmit={onSubmitEdit ?? (() => undefined)} />
      )}
    </DialogContent>
  </Dialog>
);

export default AdminFormModal;
