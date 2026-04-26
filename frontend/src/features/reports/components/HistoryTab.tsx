import { type ReactElement } from 'react';
import { FilterToolbar } from './FilterToolbar';
import { PatientHistoryTimeline } from './PatientHistoryTimeline';
import { PatientSummaryPanel } from './PatientSummaryPanel';
import type { HistoryEvent, PatientSummary, UserRole } from '../types/report';

interface HistoryTabProps {
  events: HistoryEvent[];
  filteredEvents: HistoryEvent[];
  selectedPatient: PatientSummary | null;
  userRole: UserRole;
  filters: {
    search: string;
    dateFrom: string;
    dateTo: string;
    eventType: string;
  };
  onSearchChange: (value: string) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onEventTypeChange: (value: string) => void;
  onSelectPatient: (patientId: number) => void;
}

export const HistoryTab = ({
  filteredEvents,
  selectedPatient,
  filters,
  onSearchChange,
  onDateFromChange,
  onDateToChange,
  onEventTypeChange,
  onSelectPatient,
}: HistoryTabProps): ReactElement => (
  <div className="space-y-6">
    <FilterToolbar
      label="Patient history filters"
      searchValue={filters.search}
      onSearchChange={onSearchChange}
      dateFrom={filters.dateFrom}
      dateTo={filters.dateTo}
      onDateFromChange={onDateFromChange}
      onDateToChange={onDateToChange}
      filters={[
        { label: 'All Event Types', value: 'all' },
        { label: 'Medical Record', value: 'MEDICAL_RECORD' },
        { label: 'Vital Signs', value: 'VITAL_SIGNS' },
        { label: 'Appointment', value: 'APPOINTMENT' },
      ]}
      selectedFilter={filters.eventType}
      onFilterChange={onEventTypeChange}
      sortOptions={[]}
      selectedSort=""
      onSortChange={() => undefined}
    />

    <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
      <PatientHistoryTimeline events={filteredEvents} onSelectPatient={onSelectPatient} />
      <PatientSummaryPanel patient={selectedPatient} />
    </div>
  </div>
);