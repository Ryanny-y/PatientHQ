import { useState, type ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, KeyRound, Loader2 } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/features/adminAccounts/components/FormField';
import { cn } from '@/shared/utils/cn';
import { resetPasswordSchema, type resetPasswordFormValues } from '@/features/adminAccounts/types/adminAccount';
import type { NurseAccount } from '@/features/nurseAccounts/types/nurseAccount';

interface NurseResetPasswordModalProps {
  nurse: NurseAccount | null;
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const NurseResetPasswordModal = ({ nurse, open, onClose, onSubmit }: NurseResetPasswordModalProps): ReactElement => {
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<resetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const handleReset = async (): Promise<void> => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    onSubmit();
    reset();
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { reset(); onClose(); } }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <KeyRound className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <DialogTitle>Reset Nurse Password</DialogTitle>
              <DialogDescription>{nurse ? `For @${nurse.username}` : ''}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleReset)} className="px-6 py-5 space-y-4">
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-700">
            The nurse will need to use the new password on their next login.
          </div>

          <FormField label="New Password" error={errors.new_password?.message} required>
            <div className="relative">
              <Input type={showNew ? 'text' : 'password'} placeholder="Min. 8 characters"
                className={cn('pr-9', errors.new_password && 'border-red-400')} {...register('new_password')} />
              <button type="button" tabIndex={-1} onClick={() => setShowNew((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showNew ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
          </FormField>

          <FormField label="Confirm Password" error={errors.confirmPassword?.message} required>
            <div className="relative">
              <Input type={showConfirm ? 'text' : 'password'} placeholder="Re-enter new password"
                className={cn('pr-9', errors.confirmPassword && 'border-red-400')} {...register('confirmPassword')} />
              <button type="button" tabIndex={-1} onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showConfirm ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
          </FormField>

          <div className="flex items-center justify-end gap-3 pt-1">
            <Button type="button" variant="outline" onClick={() => { reset(); onClose(); }}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-amber-500 hover:bg-amber-600">
              {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Reset Password
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NurseResetPasswordModal;
