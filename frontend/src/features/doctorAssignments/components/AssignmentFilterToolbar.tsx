import { type ReactElement } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { assignmentStatusFilter, assignmentSortOption } from '../types/assignment';

interface AssignmentFilterToolbarProps {
  searchQuery: string;
  statusFilter: assignmentStatusFilter;
  onSearchChange: (value: string) => void;
  patientStatusFilter: string;
  onPatientStatusChange: (value: string) => void;
  sortBy: assignmentSortOption;
  onSortByChange: (value: assignmentSortOption) => void;
  onStatusFilterChange: (value: assignmentStatusFilter) => void;
  onRefresh: () => void;
}

const AssignmentFilterToolbar = ({
  searchQuery,
  statusFilter,
  onSearchChange,
  patientStatusFilter,
  onPatientStatusChange,
  sortBy,
  onSortByChange,
  onStatusFilterChange,
  onRefresh,
}: AssignmentFilterToolbarProps): ReactElement => (
  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="grid gap-4 xl:grid-cols-[1.6fr_auto_1fr_1fr]">
      <div className="space-y-2">
        <Label>Search assignments</Label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Patient name, ID, or doctor"
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4">
        <div>
          <Label>Assignment status</Label>
          <Select value={statusFilter} onValueChange={(v) => onStatusFilterChange(v as assignmentStatusFilter)}>
            <SelectTrigger>
              <SelectValue placeholder={statusFilter === 'all' ? 'All statuses' : statusFilter} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Patient status</Label>
          <Select value={patientStatusFilter} onValueChange={onPatientStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="ADMITTED">Admitted</SelectItem>
              <SelectItem value="DISCHARGED">Discharged</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Sort</Label>
          <Select value={sortBy} onValueChange={(v) => onSortByChange(v as assignmentSortOption)}>
            <SelectTrigger>
              <SelectValue placeholder="Newest" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="patient-asc">Patient Name A-Z</SelectItem>
              <SelectItem value="doctor-asc">Doctor Name A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-end justify-between gap-3 sm:justify-end">
        <Button variant="outline" className="w-full sm:w-auto" onClick={onRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
    </div>
  </div>
);

export default AssignmentFilterToolbar;
