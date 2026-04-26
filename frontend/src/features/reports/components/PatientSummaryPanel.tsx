import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type ReactElement } from 'react';
import type { PatientSummary } from '../types/report';

interface PatientSummaryPanelProps {
  patient?: PatientSummary | null;
}

export const PatientSummaryPanel = ({ patient }: PatientSummaryPanelProps): ReactElement => {
  if (!patient) {
    return (
      <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <CardContent className="p-6 text-slate-500">Select a patient event to view summary details.</CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900">Patient Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6 text-sm text-slate-700">
        <div>
          <div className="text-slate-500">Full Name</div>
          <div className="font-semibold text-slate-900">{patient.full_name}</div>
        </div>
        <div>
          <div className="text-slate-500">Patient ID</div>
          <div className="font-semibold text-slate-900">#{patient.patient_id}</div>
        </div>
        <div>
          <div className="text-slate-500">Status</div>
          <div className="font-semibold text-slate-900">{patient.status}</div>
        </div>
        <div>
          <div className="text-slate-500">Assigned Doctor</div>
          <div className="font-semibold text-slate-900">{patient.assigned_doctor}</div>
        </div>
        <div>
          <div className="text-slate-500">Last Visit</div>
          <div className="font-semibold text-slate-900">{patient.last_visit}</div>
        </div>
        <div>
          <div className="text-slate-500">Total Events</div>
          <div className="font-semibold text-slate-900">{patient.total_events}</div>
        </div>
      </CardContent>
    </Card>
  );
};