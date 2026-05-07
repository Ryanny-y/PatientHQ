import { type ReactElement } from 'react';
import { MoreHorizontal, Eye, Pencil, KeyRound, PowerOff, Power, Trash2 } from 'lucide-react';
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/features/adminAccounts/components/StatusBadge';
import WardBadge from '@/features/nurseAccounts/components/WardBadge';
import type { NurseAccount } from '@/features/nurseAccounts/types/nurseAccount';

interface NurseCardListMobileProps {
  nurses: NurseAccount[];
  onView: (n: NurseAccount) => void;
  onEdit: (n: NurseAccount) => void;
  onResetPassword: (n: NurseAccount) => void;
  onToggleStatus: (n: NurseAccount) => void;
  onDelete: (n: NurseAccount) => void;
  canUpdate?: boolean;
  canDelete?: boolean;
}

const NurseCardListMobile = ({
  nurses, onView, onEdit, onResetPassword, onToggleStatus, onDelete,
  canUpdate = false, canDelete = false,
}: NurseCardListMobileProps): ReactElement => (
  <div className="space-y-3">
    {nurses.length === 0 && (
      <div className="bg-white rounded-xl border border-slate-100 p-8 text-center text-sm text-slate-400">
        No nurse accounts found.
      </div>
    )}
    {nurses.map((nurse) => (
      <div key={nurse.nurseId} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
              <span className="text-violet-700 text-sm font-bold">
                {nurse.fullName.split(' ').filter((p) => !p.includes(',')).map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 mb-0.5">{nurse.fullName}</p>
              <p className="text-xs text-slate-400">@{nurse.username}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => onView(nurse)}>
                <Eye className="h-3.5 w-3.5" /> View Details
              </DropdownMenuItem>
              {canUpdate && (
                <>
                  <DropdownMenuItem onClick={() => onEdit(nurse)}>
                    <Pencil className="h-3.5 w-3.5" /> Edit Account
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onResetPassword(nurse)}>
                    <KeyRound className="h-3.5 w-3.5" /> Reset Password
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onToggleStatus(nurse)}>
                    {nurse.isActive
                      ? <><PowerOff className="h-3.5 w-3.5 text-amber-500" /> Deactivate</>
                      : <><Power className="h-3.5 w-3.5 text-emerald-500" /> Activate</>
                    }
                  </DropdownMenuItem>
                </>
              )}
              {canDelete && (
                <DropdownMenuItem
                  onClick={() => onDelete(nurse)}
                  disabled={nurse.isActive && nurse.patients_monitored_today > 0}
                  className="text-red-600 focus:text-red-700 focus:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {nurse.isActive && nurse.patients_monitored_today > 0 ? 'Has active patients' : 'Delete'}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-50 space-y-2">
          <div className="flex items-center justify-between">
            <WardBadge ward={nurse.assignedWard} />
            <StatusBadge isActive={nurse.isActive} />
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="text-slate-400 mb-0.5">Email</p>
              <p className="text-slate-600 truncate">{nurse.email}</p>
            </div>
            <div>
              <p className="text-slate-400 mb-0.5">License</p>
              <p className="text-slate-600 font-mono">{nurse.licenseNumber}</p>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default NurseCardListMobile;
