import { type ReactElement } from 'react';
import { MoreHorizontal, Eye, Pencil, KeyRound, PowerOff, Power, Trash2 } from 'lucide-react';
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/features/adminAccounts/components/StatusBadge';
import type { AdminAccount } from '@/features/adminAccounts/types/adminAccount';

interface AdminTableProps {
  admins: AdminAccount[];
  currentUsername: string;
  onView: (admin: AdminAccount) => void;
  onEdit: (admin: AdminAccount) => void;
  onResetPassword: (admin: AdminAccount) => void;
  onToggleStatus: (admin: AdminAccount) => void;
  onDelete: (admin: AdminAccount) => void;
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  totalFiltered: number;
  pageSize: number;
}

const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const AdminTable = ({
  admins, currentUsername,
  onView, onEdit, onResetPassword, onToggleStatus, onDelete,
  page, totalPages, onPageChange, totalFiltered, pageSize,
}: AdminTableProps): ReactElement => {
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalFiltered);

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Admin ID</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Username</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Full Name</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Email</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden xl:table-cell">Contact</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Created</th>
              <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider sticky right-0 bg-slate-50/60">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {admins.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-12 text-center text-sm text-slate-400">
                  No admin accounts found.
                </td>
              </tr>
            ) : (
              admins.map((admin) => (
                <tr key={admin.admin_id} className="hover:bg-slate-50/50 transition-colors group">
                  {/* ID */}
                  <td className="px-5 py-4">
                    <span className="font-mono text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      ADM-{String(admin.admin_id).padStart(4, '0')}
                    </span>
                  </td>
                  {/* Username */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <span className="text-blue-700 text-[10px] font-bold">
                          {admin.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <span className="font-medium text-slate-800">{admin.username}</span>
                      {admin.username === currentUsername && (
                        <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-medium">You</span>
                      )}
                    </div>
                  </td>
                  {/* Full name */}
                  <td className="px-5 py-4 text-slate-700">{admin.full_name}</td>
                  {/* Email */}
                  <td className="px-5 py-4 text-slate-500 hidden lg:table-cell">{admin.email}</td>
                  {/* Contact */}
                  <td className="px-5 py-4 text-slate-500 hidden xl:table-cell font-mono text-xs">{admin.contact_number}</td>
                  {/* Status */}
                  <td className="px-5 py-4">
                    <StatusBadge isActive={admin.is_active} />
                  </td>
                  {/* Created */}
                  <td className="px-5 py-4 text-slate-400 text-xs hidden lg:table-cell whitespace-nowrap">
                    {formatDate(admin.created_at)}
                  </td>
                  {/* Actions */}
                  <td className="px-5 py-4 text-right sticky right-0 bg-white group-hover:bg-slate-50/50 transition-colors">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 opacity-60 group-hover:opacity-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Account Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
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
                          {admin.is_active
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
                          {admin.username === currentUsername ? 'Cannot delete self' : 'Delete Account'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between gap-4">
        <p className="text-xs text-slate-400">
          {totalFiltered === 0 ? 'No results' : `Showing ${from}–${to} of ${totalFiltered} admins`}
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="outline" size="sm"
            className="h-7 px-2.5 text-xs"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              variant={p === page ? 'default' : 'outline'}
              size="sm"
              className="h-7 w-7 p-0 text-xs"
              onClick={() => onPageChange(p)}
            >
              {p}
            </Button>
          ))}
          <Button
            variant="outline" size="sm"
            className="h-7 px-2.5 text-xs"
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminTable;
