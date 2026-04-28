import { Search, RefreshCw, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { statusFilter, sortOption } from '@/features/doctorAccounts/types/doctorAccount';

interface DoctorSearchToolbarProps {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: statusFilter;
  onStatusChange: (v: statusFilter) => void;
  sortOption: sortOption;
  onSortChange: (v: sortOption) => void;
  onRefresh: () => void;
  totalFiltered: number;
}

const DoctorSearchToolbar = ({
  search, onSearchChange,
  statusFilter, onStatusChange,
  sortOption, onSortChange,
  onRefresh, totalFiltered,
}: DoctorSearchToolbarProps) => (
  <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        <Input
          placeholder="Search by name, username, email, or license..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-9 bg-slate-50 border-slate-200 text-sm"
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Status filter */}
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <Select value={statusFilter} onValueChange={(v) => onStatusChange(v as statusFilter)}>
            <SelectTrigger className="h-9 w-32 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort */}
        <Select value={sortOption} onValueChange={(v) => onSortChange(v as sortOption)}>
          <SelectTrigger className="h-9 w-32 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="name-az">Name A–Z</SelectItem>
          </SelectContent>
        </Select>

        {/* Refresh */}
        <Button variant="outline" size="icon" className="h-9 w-9 shrink-0" onClick={onRefresh} title="Refresh">
          <RefreshCw className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>

    {search && (
      <p className="mt-2 text-xs text-slate-400">
        {totalFiltered} result{totalFiltered !== 1 ? 's' : ''} for &ldquo;{search}&rdquo;
      </p>
    )}
  </div>
);

export default DoctorSearchToolbar;
