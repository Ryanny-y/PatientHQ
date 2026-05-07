import { type ReactElement } from 'react';
import { Clock, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { VitalSigns } from '../types/vitalSigns';

interface VitalSignsCardListMobileProps {
  vitalSigns: VitalSigns[];
  onView: (v: VitalSigns) => void;
  onEdit: (v: VitalSigns) => void;
  onDelete: (v: VitalSigns) => void;
  canModify?: boolean;
}

const fmt = (val: number | null, unit: string): string =>
  val !== null && val !== undefined ? `${val} ${unit}` : '—';

const VitalSignsCardListMobile = ({ vitalSigns, onView, onEdit, onDelete, canModify = false }: VitalSignsCardListMobileProps): ReactElement => (
  <div className="space-y-4">
    {vitalSigns.length === 0 ? (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400">
        No vital signs records found.
      </div>
    ) : (
      vitalSigns.map((v) => (
        <article key={v.vitalId} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{v.patientName}</p>
              <p className="mt-1 text-xs text-slate-500">Recorded by {v.recordedByName}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(v)}>View Details</DropdownMenuItem>
                {canModify && <DropdownMenuItem onClick={() => onEdit(v)}>Edit</DropdownMenuItem>}
                {canModify && <DropdownMenuItem onClick={() => onDelete(v)} className="text-red-600">Delete</DropdownMenuItem>}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {[
              { label: 'Temp', value: fmt(v.temperature, '°C') },
              { label: 'Heart Rate', value: fmt(v.heartRate, 'bpm') },
              { label: 'SpO₂', value: fmt(v.oxygenSaturation, '%') },
              { label: 'BP', value: v.bloodPressure ?? '—' },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col rounded-2xl bg-slate-50 px-3 py-2">
                <span className="text-xs text-slate-400">{label}</span>
                <span className="font-semibold text-slate-900">{value}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-1 text-xs text-slate-400">
            <Clock className="h-3.5 w-3.5" />
            {new Date(v.recordedAt).toLocaleDateString()}
          </div>
        </article>
      ))
    )}
  </div>
);

export default VitalSignsCardListMobile;
