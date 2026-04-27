import { type ReactElement } from 'react';
import { MoreHorizontal, Eye, Pencil, KeyRound, PowerOff, Power, Trash2 } from 'lucide-react';
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/features/adminAccounts/components/StatusBadge';
import type { AdminAccount } from '@/features/adminAccounts/types/adminAccount';

interface AdminCardListMobileProps {
  admins: AdminAccount[];
  currentUsername: string;
  onView: (admin: AdminAccount) => void;
  onEdit: (admin: AdminAccount) => void;
  onResetPassword: (admin: AdminAccount) => void;
  onToggleStatus: (admin: AdminAccount) => void;
  onDelete: (admin: AdminAccount) => void;
}

const AdminCardListMobile = ({
  admins, currentUsername,
  onView, onEdit, onResetPassword, onToggleStatus, onDelete,
}: AdminCardListMobileProps): ReactElement => (
  <div className="space-y-3">
    {admins.length === 0 && (
      <div className="bg-white rounded-xl border border-slate-100 p-8 text-center text-sm text-slate-400">
        No admin accounts found.
      </div>
    )}
    {admins.map((admin) => (
      <div key={admin.adminId} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <span className="text-blue-700 text-sm font-bold">
                {admin.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <p className="text-sm font-semibold text-slate-800">{admin.fullName}</p>
                {admin.username === currentUsername && (
                  <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-medium">You</span>
                )}
              </div>
              <p className="text-xs text-slate-500">@{admin.username}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => onView(admin)}>
                <Eye className="h-3.5 w-3.5" /> View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(admin)}>
                <Pencil className="h-3.5 w-3.5" /> Edit Account
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onResetPassword(admin)}>
                <KeyRound className="h-3.5 w-3.5" /> Reset Password
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onToggleStatus(admin)}>
                {admin.isActive
                  ? <><PowerOff className="h-3.5 w-3.5 text-amber-500" /> Deactivate</>
                  : <><Power className="h-3.5 w-3.5 text-emerald-500" /> Activate</>
                }
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(admin)}
                disabled={admin.username === currentUsername}
                className="text-red-600 focus:text-red-700 focus:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {admin.username === currentUsername ? 'Cannot delete self' : 'Delete'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-50 grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-slate-400 mb-0.5">Email</p>
            <p className="text-slate-600 truncate">{admin.email}</p>
          </div>
          <div>
            <p className="text-slate-400 mb-0.5">Status</p>
            <StatusBadge isActive={admin.isActive} />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default AdminCardListMobile;
