import { useState, type ReactElement } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { AdminAccount } from '@/features/adminAccounts/types/adminAccount';

interface DeleteConfirmDialogProps {
  admin: AdminAccount | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmDialog = ({ admin, open, onClose, onConfirm }: DeleteConfirmDialogProps): ReactElement => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async (): Promise<void> => {
    setIsDeleting(true);
    await new Promise((r) => setTimeout(r, 700));
    onConfirm();
    setIsDeleting(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm" hideClose>
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-red-700">Delete Admin Account</DialogTitle>
              <p className="text-sm text-slate-500 mt-1">
                You are about to permanently delete{' '}
                <span className="font-semibold text-slate-700">{admin?.full_name}</span>
                {' '}(@{admin?.username}).
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-4">
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700 leading-relaxed">
            <strong>Warning:</strong> This action permanently removes the admin profile and linked user credentials. This cannot be undone.
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>Cancel</Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Delete Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
