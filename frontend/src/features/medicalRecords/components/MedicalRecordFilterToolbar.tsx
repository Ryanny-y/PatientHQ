import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw, Search, Filter } from "lucide-react";
import { type ReactElement } from "react";
import type { FilterOptions } from "../types/medicalRecord";

interface MedicalRecordFilterToolbarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onRefresh: () => void;
  doctors: Array<{ id: number; name: string }>;
}

export const MedicalRecordFilterToolbar = ({
  filters,
  onFiltersChange,
  onRefresh,
  doctors,
}: MedicalRecordFilterToolbarProps): ReactElement => {
  const updateFilter = <K extends keyof FilterOptions>(
    key: K,
    value: FilterOptions[K],
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
        {/* Search */}
        <div className="flex-1 min-w-0">
          <Label
            htmlFor="search"
            className="text-sm font-medium text-slate-700 mb-2 block"
          >
            Search Records
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="search"
              placeholder="Search by record ID, patient name, diagnosis, or doctor..."
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
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
              value={filters.dateRange.from?.toISOString().split("T")[0] || ""}
              onChange={(e) =>
                updateFilter("dateRange", {
                  ...filters.dateRange,
                  from: e.target.value ? new Date(e.target.value) : null,
                })
              }
              className="w-full lg:w-35"
              placeholder="From"
            />
            <Input
              type="date"
              value={filters.dateRange.to?.toISOString().split("T")[0] || ""}
              onChange={(e) =>
                updateFilter("dateRange", {
                  ...filters.dateRange,
                  to: e.target.value ? new Date(e.target.value) : null,
                })
              }
              className="w-full lg:w-35"
              placeholder="To"
            />
          </div>
        </div>

        {/* Doctor Filter */}
        <div className="w-full lg:w-auto">
          <Label
            htmlFor="doctor"
            className="text-sm font-medium text-slate-700 mb-2 block"
          >
            Doctor
          </Label>
          <Select
            value={filters.doctor}
            onValueChange={(value) => updateFilter("doctor", value)}
          >
            <SelectTrigger className="w-full lg:w-45">
              <SelectValue placeholder="All Doctors" />
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

        {/* Patient Status */}
        <div className="w-full lg:w-auto">
          <Label
            htmlFor="status"
            className="text-sm font-medium text-slate-700 mb-2 block"
          >
            Patient Status
          </Label>
          <Select
            value={filters.patientStatus}
            onValueChange={(value) => updateFilter("patientStatus", value)}
          >
            <SelectTrigger className="w-full lg:w-35">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Discharged">Discharged</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort */}
        <div className="w-full lg:w-auto">
          <Label
            htmlFor="sort"
            className="text-sm font-medium text-slate-700 mb-2 block"
          >
            Sort By
          </Label>
          <Select
            value={filters.sortBy}
            onValueChange={(value: any) => updateFilter("sortBy", value)}
          >
            <SelectTrigger className="w-full lg:w-35">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="patient_name">Patient Name A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <div className="flex gap-2 w-full lg:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="flex-1 lg:flex-none"
          >
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
