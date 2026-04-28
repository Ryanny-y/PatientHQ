import { type ReactElement } from 'react';
import { HeartPulse, User, Phone, Mail, Calendar, FileText, Activity, ClipboardList } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/features/adminAccounts/components/StatusBadge';
import WardBadge from '@/features/nurseAccounts/components/WardBadge';
import type { NurseAccount } from '@/features/nurseAccounts/types/nurseAccount';

interface ViewNurseModalProps {
  nurse: NurseAccount | null;
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
}

const Field = ({ label, value, icon: Icon }: { label: string; value: string; icon?: React.ElementType }): ReactElement => (
  <div className="flex items-start gap-3">
    {Icon && (
      <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="h-3.5 w-3.5 text-slate-500" />
      </div>
    )}
    <div className="min-w-0">
      <p className="text-xs text-slate-400 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-slate-800 break-all">{value}</p>
    </div>
  </div>
);

const ViewNurseModal = ({ nurse, open, onClose, onEdit }: ViewNurseModalProps): ReactElement => {
  if (!nurse) return <></>;
  
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
              <span className="text-violet-700 font-bold text-sm">
                {nurse.fullName.split(' ').filter((p) => !p.includes(',')).map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div>
              <DialogTitle>{nurse.fullName}</DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-0.5">
                <span>@{nurse.username}</span>
                <span>·</span>
                <WardBadge ward={nurse.assignedWard} />
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-5 space-y-6">
          {/* Profile Information */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <HeartPulse className="h-3.5 w-3.5 text-violet-600" />
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Profile Information</h4>
            </div>
            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Nurse ID" value={`NRS-${String(nurse.nurseId).padStart(4, '0')}`} />
                <Field label="User ID" value={`USR-${String(nurse.userId).padStart(4, '0')}`} />
              </div>
              <Field label="Username" value={nurse.username} icon={User} />
              <Field label="Full Name" value={nurse.fullName} icon={User} />
              <Field label="Email Address" value={nurse.email} icon={Mail} />
              <Field label="Contact Number" value={nurse.contactNumber} icon={Phone} />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Assigned Ward</p>
                  <WardBadge ward={nurse.assignedWard} showIcon />
                </div>
                <Field label="License Number" value={nurse.licenseNumber} icon={FileText} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Role</p>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-violet-50 text-violet-700 border border-violet-200">
                    <HeartPulse className="h-3 w-3" /> NURSE
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Status</p>
                  <StatusBadge isActive={nurse.isActive} />
                </div>
              </div>
              <Field
                label="Created Date"
                value={new Date(nurse.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                icon={Calendar}
              />
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* Activity Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-3.5 w-3.5 text-violet-600" />
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Operational Activity</h4>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                <div className="h-8 w-8 rounded-lg bg-violet-100 flex items-center justify-center mx-auto mb-2">
                  <ClipboardList className="h-4 w-4 text-violet-600" />
                </div>
                <p className="text-lg font-bold text-slate-800">{nurse.patients_monitored_today}</p>
                <p className="text-[10px] text-slate-400 leading-tight">Patients Today</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center mx-auto mb-2">
                  <Activity className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-lg font-bold text-slate-800">{nurse.recent_vital_logs}</p>
                <p className="text-[10px] text-slate-400 leading-tight">Vital Logs</p>
              </div>
              {/* <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center mx-auto mb-2">
                  <Clock className="h-4 w-4 text-emerald-600" />
                </div>
                <p className="text-xs font-semibold text-slate-700 mt-1 leading-tight">{nurse.last_login}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Last Login</p>
              </div> */}
            </div>

            {/* Active patient warning */}
            {nurse.isActive && nurse.patients_monitored_today > 0 && (
              <div className="mt-3 flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
                <Activity className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                <p className="text-xs text-amber-700">
                  This nurse has <strong>{nurse.patients_monitored_today} active patient(s)</strong> today. Deletion is restricted until reassigned.
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button onClick={onEdit} className="bg-violet-600 hover:bg-violet-700">Edit Account</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewNurseModal;
