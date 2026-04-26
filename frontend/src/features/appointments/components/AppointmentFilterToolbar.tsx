import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, Search, Filter } from "lucide-react";
import { type ReactElement } from "react";
import type { FilterOptions } from "../types/appointment";

interface AppointmentFilterToolbarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onRefresh: () => void;
  doctors: Array<{ id: number; name: string; specialization: string }>;
  specializations: string[];
}

export const AppointmentFilterToolbar = ({
  filters,
  onFiltersChange,
  onRefresh,
  doctors,
  specializations,
}: AppointmentFilterToolbarProps): ReactElement => {
  const updateFilter = <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end flex-wrap">
        {/* Search */}
        <div className="flex-1 min-w-0 lg:min-w-75">
          <Label htmlFor="search" className="text-sm font-medium text-slate-700 mb-2 block">
            Search Appointments
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="search"
              placeholder="Search by ID, patient, or doctor..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Date Range */}
        <div className="w-full lg:w-auto">
          <Label className="text-sm font-medium text-slate-700 mb-2 block">
            Date Range
          </Label>
          <div className="flex gap-2">
            <Input
              type="date"
              value={filters.dateRange.from?.toISOString().split('T')[0] || ''}
              onChange={(e) => updateFilter('dateRange', {
                ...filters.dateRange,
                from: e.target.value ? new Date(e.target.value) : null
              })}
              className="w-full lg:w-35"
            />
            <Input
              type="date"
              value={filters.dateRange.to?.toISOString().split('T')[0] || ''}
              onChange={(e) => updateFilter('dateRange', {
                ...filters.dateRange,
                to: e.target.value ? new Date(e.target.value) : null
              })}
              className="w-full lg:w-35"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="w-full lg:w-auto">
          <Label htmlFor="status" className="text-sm font-medium text-slate-700 mb-2 block">
            Status
          </Label>
          <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
            <SelectTrigger className="w-full lg:w-35">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
              <SelectItem value="NO_SHOW">No Show</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Doctor Filter */}
        <div className="w-full lg:w-auto">
          <Label className="text-sm font-medium text-slate-700 mb-2 block">
            Doctor
          </Label>
          <Select value={filters.doctor} onValueChange={(value) => updateFilter('doctor', value)}>
            <SelectTrigger className="w-full lg:w-45">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Doctors</SelectItem>
              {doctors.map((doctor) => (
                <SelectItem key={doctor.id} value={doctor.id.toString()}>
                  {doctor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Specialization Filter */}
        <div className="w-full lg:w-auto">
          <Label className="text-sm font-medium text-slate-700 mb-2 block">
            Specialization
          </Label>
          <Select value={filters.specialization} onValueChange={(value) => updateFilter('specialization', value)}>
            <SelectTrigger className="w-full lg:w-37.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specialties</SelectItem>
              {specializations.map((spec) => (
                <SelectItem key={spec} value={spec}>
                  {spec}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort */}
        <div className="w-full lg:w-auto">
          <Label className="text-sm font-medium text-slate-700 mb-2 block">
            Sort By
          </Label>
          <Select value={filters.sortBy} onValueChange={(value: any) => updateFilter('sortBy', value)}>
            <SelectTrigger className="w-full lg:w-35">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nearest">Nearest First</SelectItem>
              <SelectItem value="latest">Latest First</SelectItem>
              <SelectItem value="patient_name">Patient Name A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <div className="flex gap-2 w-full lg:w-auto">
          <Button variant="outline" size="sm" onClick={onRefresh} className="flex-1 lg:flex-none">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="flex-1 lg:flex-none">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>
      </div>
    </div>
  );
};
