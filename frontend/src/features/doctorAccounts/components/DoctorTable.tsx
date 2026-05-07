import { type ReactElement } from 'react';
import { MoreHorizontal, Eye, Pencil, KeyRound, PowerOff, Power, Trash2 } from 'lucide-react';
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/features/adminAccounts/components/StatusBadge';
import SpecializationBadge from '@/features/doctorAccounts/components/SpecializationBadge';
import type { DoctorAccount } from '@/features/doctorAccounts/types/doctorAccount';

interface DoctorTableProps {
  doctors: DoctorAccount[];
  onView: (d: DoctorAccount) => void;
  onEdit: (d: DoctorAccount) => void;
  onResetPassword: (d: DoctorAccount) => void;
  onToggleStatus: (d: DoctorAccount) => void;
  onDelete: (d: DoctorAccount) => void;
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  totalFiltered: number;
  pageSize: number;
  canUpdate?: boolean;
  canDelete?: boolean;
}

const formatDate = (s: string): string =>
  new Date(s).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const DoctorTable = ({
  doctors, onView, onEdit, onResetPassword, onToggleStatus, onDelete,
  page, totalPages, onPageChange, totalFiltered, pageSize,
  canUpdate = false, canDelete = false,
}: DoctorTableProps): ReactElement => {
  const from = totalFiltered === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalFiltered);

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Doctor ID</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Physician</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Specialization</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">License No.</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden xl:table-cell">Email</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden xl:table-cell">Contact</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Created</th>
              <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider sticky right-0 bg-slate-50/60">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {doctors.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-5 py-14 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                      <Eye className="h-5 w-5 text-slate-300" />
                    </div>
                    <p className="text-sm text-slate-400">No doctor accounts found.</p>
                  </div>
                </td>
              </tr>
            ) : (
              doctors.map((doc) => (
                <tr key={doc.doctorId} className="hover:bg-slate-50/50 transition-colors group">
                  {/* ID */}
                  <td className="px-5 py-4">
                    <span className="font-mono text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      {doc.doctorId.slice(-4).toUpperCase()}
                    </span>
                  </td>
                  {/* Physician */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <span className="text-emerald-700 text-[10px] font-bold">
                          {doc.fullName.replace('Dr. ', '').split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-800 leading-none truncate">{doc.fullName}</p>
                        <p className="text-xs text-slate-400 mt-0.5">@{doc.username}</p>
                      </div>
                    </div>
                  </td>
                  {/* Specialization */}
                  <td className="px-5 py-4">
                    <SpecializationBadge specialization={doc.specialization} />
                  </td>
                  {/* License */}
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className="font-mono text-xs text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                      {doc.licenseNumber}
                    </span>
                  </td>
                  {/* Email */}
                  <td className="px-5 py-4 text-slate-500 text-xs hidden xl:table-cell truncate max-w-40">
                    {doc.email}
                  </td>
                  {/* Contact */}
                  <td className="px-5 py-4 text-slate-500 hidden xl:table-cell font-mono text-xs">
                    {doc.contactNumber}
                  </td>
                  {/* Status */}
                  <td className="px-5 py-4">
                    <StatusBadge isActive={doc.isActive} />
                  </td>
                  {/* Created */}
                  <td className="px-5 py-4 text-slate-400 text-xs hidden lg:table-cell whitespace-nowrap">
                    {formatDate(doc.createdAt)}
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
                        <DropdownMenuLabel>Physician Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onView(doc)}>
                          <Eye className="h-3.5 w-3.5" /> View Details
                        </DropdownMenuItem>
                        {canUpdate && (
                          <>
                            <DropdownMenuItem onClick={() => onEdit(doc)}>
                              <Pencil className="h-3.5 w-3.5" /> Edit Account
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onResetPassword(doc)}>
                              <KeyRound className="h-3.5 w-3.5" /> Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onToggleStatus(doc)}>
                              {doc.isActive
                                ? <><PowerOff className="h-3.5 w-3.5 text-amber-500" /> Deactivate</>
                                : <><Power className="h-3.5 w-3.5 text-emerald-500" /> Activate</>
                              }
                            </DropdownMenuItem>
                          </>
                        )}
                        {canDelete && (
                          <DropdownMenuItem
                            onClick={() => onDelete(doc)}
                            className="text-red-600 focus:text-red-700 focus:bg-red-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete Account
                          </DropdownMenuItem>
                        )}
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
          {totalFiltered === 0 ? 'No results' : `Showing ${from}–${to} of ${totalFiltered} doctors`}
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

export default DoctorTable;
