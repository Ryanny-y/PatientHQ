import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, FileText, HeartPulse, CalendarCheck } from 'lucide-react';
import { type ReactElement } from 'react';
import type { HistoryEvent } from '../types/report';

interface PatientHistoryTimelineProps {
  events: HistoryEvent[];
  onSelectPatient: (patientId: number) => void;
}

const eventIcons: Record<string, React.ElementType> = {
  MEDICAL_RECORD: FileText,
  VITAL_SIGNS: HeartPulse,
  APPOINTMENT: CalendarCheck,
};

export const PatientHistoryTimeline = ({ events, onSelectPatient }: PatientHistoryTimelineProps): ReactElement => (
  <div className="space-y-5">
    {events.map((event) => {
      const Icon = eventIcons[event.event_type] || FileText;
      return (
        <div key={`${event.event_type}-${event.reference_id}`} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <Badge className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {event.event_type.replace('_', ' ')}
              </Badge>
              <div>
                <h3 className="text-base font-semibold text-slate-900">{event.description}</h3>
                <p className="text-sm text-slate-500">Reference #{event.reference_id}</p>
              </div>
            </div>
            <div className="text-right text-sm text-slate-500">
              <div>{new Date(event.event_date).toLocaleDateString()}</div>
              <div>{new Date(event.event_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-slate-400" />
              <span>Patient: {event.patient_name}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onSelectPatient(event.patient_id)}>
              View Related Record
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      );
    })}
    {events.length === 0 && (
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">No patient history events match the current filters.</div>
    )}
  </div>
);
