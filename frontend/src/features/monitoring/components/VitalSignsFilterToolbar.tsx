import { type ReactElement } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { vitalDateFilter, vitalSortOption } from '../types/vitalSigns';

interface VitalSignsFilterToolbarProps {
  search: string;
  onSearchChange: (v: string) => void;
  dateFilter: vitalDateFilter;
  onDateFilterChange: (v: vitalDateFilter) => void;
  sortBy: vitalSortOption;
  onSortByChange: (v: vitalSortOption) => void;
  onRefresh: () => void;
}

const VitalSignsFilterToolbar = ({
  search,
  onSearchChange,
  dateFilter,
  onDateFilterChange,
  sortBy,
  onSortByChange,
  onRefresh,
}: VitalSignsFilterToolbarProps): ReactElement => (
  <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm space-y-4">
    <div className="flex flex-col lg:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search by patient name or ID..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Button variant="outline" size="icon" onClick={onRefresh}>
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>

    <div className="grid grid-cols-2 gap-3">
      <Select value={dateFilter} onValueChange={(v) => onDateFilterChange(v as vitalDateFilter)}>
        <SelectTrigger>
          <SelectValue placeholder="Date Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Time</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="week">This Week</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sortBy} onValueChange={(v) => onSortByChange(v as vitalSortOption)}>
        <SelectTrigger>
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
          <SelectItem value="patient-asc">Patient A-Z</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
);

export default VitalSignsFilterToolbar;
