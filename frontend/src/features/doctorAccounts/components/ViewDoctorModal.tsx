import { type ReactElement } from 'react';
import { Stethoscope, User, Phone, Mail, Calendar, Clock, FileText, Users, CalendarDays } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/features/adminAccounts/components/StatusBadge';
import SpecializationBadge from '@/features/doctorAccounts/components/SpecializationBadge';
import type { DoctorAccount } from '@/features/doctorAccounts/types/doctorAccount';

interface ViewDoctorModalProps {
  doctor: DoctorAccount | null;
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

const ViewDoctorModal = ({ doctor, open, onClose, onEdit }: ViewDoctorModalProps): ReactElement => {
  if (!doctor) return <></>;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <span className="text-emerald-700 font-bold text-sm">
                {doctor.full_name.replace('Dr. ', '').split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </span>
            </div>
            <div>
              <DialogTitle>{doctor.full_name}</DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-0.5">
                <span>@{doctor.username}</span>
                <span>·</span>
                <SpecializationBadge specialization={doctor.specialization} />
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-5 space-y-6">
          {/* Profile Information */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Stethoscope className="h-3.5 w-3.5 text-emerald-600" />
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Profile Information</h4>
            </div>
            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Doctor ID" value={`DOC-${String(doctor.doctor_id).padStart(4, '0')}`} />
                <Field label="User ID" value={`USR-${String(doctor.user_id).padStart(4, '0')}`} />
              </div>
              <Field label="Username" value={doctor.username} icon={User} />
              <Field label="Full Name" value={doctor.full_name} icon={User} />
              <Field label="Email Address" value={doctor.email} icon={Mail} />
              <Field label="Contact Number" value={doctor.contact_number} icon={Phone} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Specialization" value={doctor.specialization} icon={Stethoscope} />
                <Field label="License Number" value={doctor.license_number} icon={FileText} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Role</p>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <Stethoscope className="h-3 w-3" /> DOCTOR
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Status</p>
                  <StatusBadge isActive={doctor.is_active} />
                </div>
              </div>
              <Field
                label="Created Date"
                value={new Date(doctor.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                icon={Calendar}
              />
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* Activity Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-3.5 w-3.5 text-emerald-600" />
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Clinical Activity</h4>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center mx-auto mb-2">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-lg font-bold text-slate-800">{doctor.assigned_patients}</p>
                <p className="text-[10px] text-slate-400 leading-tight">Assigned Patients</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                <div className="h-8 w-8 rounded-lg bg-violet-100 flex items-center justify-center mx-auto mb-2">
                  <CalendarDays className="h-4 w-4 text-violet-600" />
                </div>
                <p className="text-lg font-bold text-slate-800">{doctor.upcoming_appointments}</p>
                <p className="text-[10px] text-slate-400 leading-tight">Upcoming Appts.</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center mx-auto mb-2">
                  <Clock className="h-4 w-4 text-emerald-600" />
                </div>
                <p className="text-xs font-semibold text-slate-700 mt-1">{doctor.last_login}</p>
                <p className="text-[10px] text-slate-400 leading-tight mt-0.5">Last Login</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button onClick={onEdit} className="gap-1.5">Edit Account</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewDoctorModal;
