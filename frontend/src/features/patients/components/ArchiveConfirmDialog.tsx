import { type ReactElement } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';
import type { Patient } from '@/features/patients/types/patient';

interface ArchiveConfirmDialogProps {
  patient: Patient | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ArchiveConfirmDialog = ({ patient, open, onClose, onConfirm }: ArchiveConfirmDialogProps): ReactElement => {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <AlertDialogTitle>Archive this patient?</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-2">
            <p>
              You are about to archive <span className="font-semibold">{patient?.fullName}</span> (#{patient?.patientId}).
            </p>
            <p className="text-amber-600 font-medium">
              Warning: This hides the patient from active lists but preserves medical history.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
            Archive Patient
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ArchiveConfirmDialog;
