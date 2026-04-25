import { type ReactElement } from 'react';
import { ShieldCheck, User, Phone, Mail, Calendar, Clock, KeyRound } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/features/adminAccounts/components/StatusBadge';
import type { AdminAccount } from '@/features/adminAccounts/types/adminAccount';

interface ViewAdminModalProps {
  admin: AdminAccount | null;
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

const ViewAdminModal = ({ admin, open, onClose, onEdit }: ViewAdminModalProps): ReactElement => {
  if (!admin) return <></>;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <span className="text-blue-700 text-sm font-bold">
                {admin.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </span>
            </div>
            <div>
              <DialogTitle>{admin.full_name}</DialogTitle>
              <DialogDescription>@{admin.username}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-5 space-y-6">
          {/* Account Information */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <User className="h-3.5 w-3.5 text-blue-600" />
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Account Information</h4>
            </div>
            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Admin ID" value={`ADM-${String(admin.admin_id).padStart(4, '0')}`} />
                <Field label="User ID" value={`USR-${String(admin.user_id).padStart(4, '0')}`} />
              </div>
              <Field label="Username" value={admin.username} icon={User} />
              <Field label="Full Name" value={admin.full_name} icon={User} />
              <Field label="Email Address" value={admin.email} icon={Mail} />
              <Field label="Contact Number" value={admin.contact_number} icon={Phone} />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Role</p>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                    <ShieldCheck className="h-3 w-3" /> ADMIN
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Status</p>
                  <StatusBadge isActive={admin.is_active} />
                </div>
              </div>
              <Field label="Created Date" value={new Date(admin.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} icon={Calendar} />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100" />

          {/* Security Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Security Information</h4>
            </div>
            <div className="space-y-3.5">
              <Field label="Last Login" value={admin.last_login} icon={Clock} />
              <Field label="Password Last Reset" value={new Date(admin.password_last_reset).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} icon={KeyRound} />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button onClick={onEdit}>Edit Account</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewAdminModal;
