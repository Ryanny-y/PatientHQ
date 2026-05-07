import { type ReactElement } from 'react';
import { MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table, TableBody, TableCell, TableHeader, TableRow,
} from '@/components/ui/table';
import type { VitalSigns } from '../types/vitalSigns';

interface VitalSignsTableProps {
  vitalSigns: VitalSigns[];
  onView: (v: VitalSigns) => void;
  onEdit: (v: VitalSigns) => void;
  onDelete: (v: VitalSigns) => void;
  canModify?: boolean;
}

const fmt = (val: number | null, unit: string): string =>
  val !== null && val !== undefined ? `${val} ${unit}` : '—';

const VitalSignsTable = ({ vitalSigns, onView, onEdit, onDelete, canModify = false }: VitalSignsTableProps): ReactElement => (
  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
    <Table className="min-w-full">
      <TableHeader>
        <TableRow>
          <TableCell>Patient</TableCell>
          <TableCell>Temp</TableCell>
          <TableCell>Heart Rate</TableCell>
          <TableCell>SpO₂</TableCell>
          <TableCell>Blood Pressure</TableCell>
          <TableCell>Resp. Rate</TableCell>
          <TableCell>Recorded By</TableCell>
          <TableCell>Recorded At</TableCell>
          <TableCell className="sticky right-0 bg-white">Actions</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vitalSigns.length === 0 ? (
          <TableRow>
            <TableCell colSpan={9} className="py-10 text-center text-sm text-slate-400">
              No vital signs records found.
            </TableCell>
          </TableRow>
        ) : (
          vitalSigns.map((v) => (
            <TableRow key={v.vitalId}>
              <TableCell className="font-medium text-slate-900">{v.patientName}</TableCell>
              <TableCell>{fmt(v.temperature, '°C')}</TableCell>
              <TableCell>{fmt(v.heartRate, 'bpm')}</TableCell>
              <TableCell>{fmt(v.oxygenSaturation, '%')}</TableCell>
              <TableCell>{v.bloodPressure ?? '—'}</TableCell>
              <TableCell>{fmt(v.respiratoryRate, '/min')}</TableCell>
              <TableCell>{v.recordedByName}</TableCell>
              <TableCell>
                {new Date(v.recordedAt).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric',
                })}
              </TableCell>
              <TableCell className="sticky right-0 bg-white">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(v)}>View Details</DropdownMenuItem>
                    {canModify && <DropdownMenuItem onClick={() => onEdit(v)}>Edit</DropdownMenuItem>}
                    {canModify && (
                      <DropdownMenuItem onClick={() => onDelete(v)} className="text-red-600">
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </div>
);

export default VitalSignsTable;
