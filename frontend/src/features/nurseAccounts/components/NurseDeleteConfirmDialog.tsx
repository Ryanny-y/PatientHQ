import { useState, type ReactElement } from 'react';
import { AlertTriangle, Loader2, ShieldAlert } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { NurseAccount } from '@/features/nurseAccounts/types/nurseAccount';

interface NurseDeleteConfirmDialogProps {
  nurse: NurseAccount | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const NurseDeleteConfirmDialog = ({ nurse, open, onClose, onConfirm }: NurseDeleteConfirmDialogProps): ReactElement => {
  const [isDeleting, setIsDeleting] = useState(false);

  // Block deletion if nurse has active patients today
  const hasActivePatients = (nurse?.isActive ?? false) && (nurse?.patients_monitored_today ?? 0) > 0;

  const handleConfirm = async (): Promise<void> => {
    if (hasActivePatients) return;
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
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${hasActivePatients ? 'bg-amber-100' : 'bg-red-100'}`}>
              {hasActivePatients
                ? <ShieldAlert className="h-5 w-5 text-amber-600" />
                : <AlertTriangle className="h-5 w-5 text-red-600" />
              }
            </div>
            <div>
              <DialogTitle className={hasActivePatients ? 'text-amber-700' : 'text-red-700'}>
                {hasActivePatients ? 'Deletion Restricted' : 'Delete Nurse Account'}
              </DialogTitle>
              <p className="text-sm text-slate-500 mt-1">
                {hasActivePatients
                  ? <>
                      <span className="font-semibold text-slate-700">{nurse?.fullName}</span> currently has{' '}
                      <span className="font-semibold text-amber-700">{nurse?.patients_monitored_today} active patient(s)</span> assigned today.
                    </>
                  : <>
                      You are about to permanently delete{' '}
                      <span className="font-semibold text-slate-700">{nurse?.fullName}</span>
                      {' '}(@{nurse?.username}).
                    </>
                }
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-4">
          {hasActivePatients ? (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-700 leading-relaxed">
              <strong>Action Required:</strong> Reassign or discharge all active patients before deleting this nurse account to maintain patient care continuity.
            </div>
          ) : (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700 leading-relaxed">
              <strong>Warning:</strong> This action permanently removes the nurse profile, credentials, and access rights. This cannot be undone.
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            {hasActivePatients ? 'Close' : 'Cancel'}
          </Button>
          {!hasActivePatients && (
            <Button variant="destructive" onClick={handleConfirm} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
              {isDeleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Delete Account
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NurseDeleteConfirmDialog;
