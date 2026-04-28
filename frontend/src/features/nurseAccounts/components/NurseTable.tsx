import { type ReactElement } from 'react';
import { MoreHorizontal, Eye, Pencil, KeyRound, PowerOff, Power, Trash2 } from 'lucide-react';
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/features/adminAccounts/components/StatusBadge';
import WardBadge from '@/features/nurseAccounts/components/WardBadge';
import type { NurseAccount } from '@/features/nurseAccounts/types/nurseAccount';

interface NurseTableProps {
  nurses: NurseAccount[];
  onView: (n: NurseAccount) => void;
  onEdit: (n: NurseAccount) => void;
  onResetPassword: (n: NurseAccount) => void;
  onToggleStatus: (n: NurseAccount) => void;
  onDelete: (n: NurseAccount) => void;
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  totalFiltered: number;
  pageSize: number;
}

const formatDate = (s: string): string =>
  new Date(s).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const NurseTable = ({
  nurses, onView, onEdit, onResetPassword, onToggleStatus, onDelete,
  page, totalPages, onPageChange, totalFiltered, pageSize,
}: NurseTableProps): ReactElement => {
  const from = totalFiltered === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalFiltered);

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Nurse ID</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nurse</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Assigned Ward</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">License No.</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden xl:table-cell">Email</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden xl:table-cell">Contact</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Created</th>
              <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider sticky right-0 bg-slate-50/60">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {nurses.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-5 py-14 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                      <HeartPulseIcon />
                    </div>
                    <p className="text-sm text-slate-400">No nurse accounts found.</p>
                  </div>
                </td>
              </tr>
            ) : (
              nurses.map((nurse) => (
                <tr key={nurse.nurseId} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-5 py-4">
                    <span className="font-mono text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      NRS-{String(nurse.nurseId).padStart(4, '0')}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                        <span className="text-violet-700 text-[10px] font-bold">
                          {nurse.fullName.split(' ').filter((p) => !p.includes(',')).map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-800 leading-none truncate">{nurse.fullName}</p>
                        <p className="text-xs text-slate-400 mt-0.5">@{nurse.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <WardBadge ward={nurse.assignedWard} />
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className="font-mono text-xs text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                      {nurse.licenseNumber}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-500 text-xs hidden xl:table-cell truncate max-w-40">
                    {nurse.email}
                  </td>
                  <td className="px-5 py-4 text-slate-500 hidden xl:table-cell font-mono text-xs">
                    {nurse.contactNumber}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge isActive={nurse.isActive} />
                  </td>
                  <td className="px-5 py-4 text-slate-400 text-xs hidden lg:table-cell whitespace-nowrap">
                    {formatDate(nurse.createdAt)}
                  </td>
                  <td className="px-5 py-4 text-right sticky right-0 bg-white group-hover:bg-slate-50/50 transition-colors">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 opacity-60 group-hover:opacity-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Nurse Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onView(nurse)}>
                          <Eye className="h-3.5 w-3.5" /> View Details
                        </DropdownMenuItem>
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
                        <DropdownMenuItem
                          onClick={() => onDelete(nurse)}
                          disabled={nurse.isActive && nurse.patients_monitored_today > 0}
                          className="text-red-600 focus:text-red-700 focus:bg-red-50 disabled:opacity-40"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          {nurse.isActive && nurse.patients_monitored_today > 0
                            ? 'Has active patients'
                            : 'Delete Account'}
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

      <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between gap-4">
        <p className="text-xs text-slate-400">
          {totalFiltered === 0 ? 'No results' : `Showing ${from}–${to} of ${totalFiltered} nurses`}
        </p>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" className="h-7 px-2.5 text-xs"
            disabled={page === 1} onClick={() => onPageChange(page - 1)}>
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button key={p} variant={p === page ? 'default' : 'outline'} size="sm"
              className="h-7 w-7 p-0 text-xs" onClick={() => onPageChange(p)}>
              {p}
            </Button>
          ))}
          <Button variant="outline" size="sm" className="h-7 px-2.5 text-xs"
            disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

// Inline icon to avoid unused import warning
const HeartPulseIcon = (): ReactElement => (
  <svg className="h-5 w-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h3l3-9 4 18 3-9h5" />
  </svg>
);

export default NurseTable;
