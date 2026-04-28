import { type ReactElement, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Clock } from 'lucide-react';
import type { Patient, PatientHistoryEvent } from '@/features/patients/types/patient';
// import { getPatientHistory } from '@/features/patients/services/patientService';

interface PatientHistoryModalProps {
  patient: Patient | null;
  open: boolean;
  onClose: () => void;
}

const PatientHistoryModal = ({ patient, open, onClose }: PatientHistoryModalProps): ReactElement => {
  const [history, setHistory] = useState<PatientHistoryEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // useEffect(() => {
  //   if (patient && open) {
  //     const fetchHistory = async (): Promise<void> => {
  //       setIsLoading(true);
  //       const response = await getPatientHistory(patient.patientId);
  //       if (response.success) {
  //         setHistory(response.data);
  //       }
  //       setIsLoading(false);
  //     };
  //     fetchHistory();
  //   }
  // }, [patient, open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Patient Activity History</DialogTitle>
          {patient && (
            <p className="text-sm text-slate-500">
              {patient.fullName} (#{patient.patientId})
            </p>
          )}
        </DialogHeader>

        <div className="mt-4">
          {isLoading ? (
            <div className="text-center py-8 text-slate-500">Loading history...</div>
          ) : history.length === 0 ? (
            <div className="text-center py-8 text-slate-500">No history available</div>
          ) : (
            <div className="relative space-y-6">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" />
              {history.map((event) => (
                <div key={event.id} className="relative flex gap-4">
                  <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 ring-4 ring-white">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-slate-900">{event.event}</h4>
                      <span className="text-xs text-slate-500">{event.timestamp}</span>
                    </div>
                    <p className="text-sm text-slate-600 mb-1">{event.description}</p>
                    {event.actor && (
                      <p className="text-xs text-slate-500">by {event.actor}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PatientHistoryModal;
