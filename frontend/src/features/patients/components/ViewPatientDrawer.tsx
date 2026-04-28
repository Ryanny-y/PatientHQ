import { type ReactElement } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import type { Patient } from '@/features/patients/types/patient';
import StatusBadge from '@/features/patients/components/StatusBadge';
import { calculateAge, formatDate } from '@/features/patients/utils/patientUtils';

interface ViewPatientDrawerProps {
  patient: Patient | null;
  open: boolean;
  onClose: () => void;
}

const ViewPatientDrawer = ({ patient, open, onClose }: ViewPatientDrawerProps): ReactElement => {
  if (!patient) return <></>;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Clinical Profile</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Personal Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Patient ID</span>
                <span className="text-sm font-medium text-blue-600">#{patient.patientId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Full Name</span>
                <span className="text-sm font-medium">{patient.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Date of Birth</span>
                <span className="text-sm font-medium">{formatDate(patient.dateOfBirth)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Age</span>
                <span className="text-sm font-medium">{calculateAge(patient.dateOfBirth)} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Gender</span>
                <span className="text-sm font-medium">{patient.gender}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Contact Number</span>
                <span className="text-sm font-medium font-mono">{patient.contactNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Email</span>
                <span className="text-sm font-medium">{patient.email}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-sm text-slate-500">Address</span>
                <span className="text-sm font-medium text-right max-w-[60%]">{patient.address}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Medical Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Blood Type</span>
                <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-700">
                  {patient.bloodType}
                </span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-sm text-slate-500">Allergies</span>
                <span className="text-sm font-medium text-right max-w-[60%]">{patient.allergies || 'None'}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Emergency Contact</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Name</span>
                <span className="text-sm font-medium">{patient.emergencyContactName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Contact Number</span>
                <span className="text-sm font-medium font-mono">{patient.emergencyContactNumber}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">System Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Status</span>
                <StatusBadge status={patient.status} />
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Registered Date</span>
                <span className="text-sm font-medium">{formatDate(patient.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Assigned Doctor</span>
                <span className="text-sm font-medium">{patient.assignedDoctor || 'Unassigned'}</span>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ViewPatientDrawer;
