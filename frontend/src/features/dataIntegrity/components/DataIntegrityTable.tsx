import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ShieldCheck, RefreshCw } from 'lucide-react';
import { type ReactElement } from 'react';
import { IntegrityStatusBadge } from './IntegrityStatusBadge';
import type { IntegrityVerificationDto } from '../types/dataIntegrity';
import type { PatientRow } from '../hooks/useDataIntegrity';

interface DataIntegrityTableProps {
  patients: PatientRow[];
  verifiedResults: Record<string, IntegrityVerificationDto>;
  verifyingIds: Set<string>;
  recomputingIds: Set<string>;
  onVerify: (patientId: string) => void;
  onRecompute: (patientId: string) => void;
  canRecompute: boolean;
}

export const DataIntegrityTable = ({
  patients,
  verifiedResults,
  verifyingIds,
  recomputingIds,
  onVerify,
  onRecompute,
  canRecompute,
}: DataIntegrityTableProps): ReactElement => (
  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
    <Table>
      <TableHeader>
        <TableRow className="bg-slate-50/80">
          <TableHead className="font-semibold text-slate-700">Patient Name</TableHead>
          <TableHead className="font-semibold text-slate-700">Patient ID</TableHead>
          <TableHead className="font-semibold text-slate-700">Last Verified Status</TableHead>
          <TableHead className="font-semibold text-slate-700">Verified At</TableHead>
          <TableHead className="font-semibold text-slate-700">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {patients.map((patient) => {
          const cached = verifiedResults[patient.patientId];
          const isVerifying = verifyingIds.has(patient.patientId);
          const isRecomputing = recomputingIds.has(patient.patientId);

          return (
            <TableRow key={patient.patientId} className="hover:bg-slate-50/50 transition-colors">
              <TableCell className="font-medium text-slate-900">{patient.patientName}</TableCell>
              <TableCell className="text-slate-500 font-mono text-xs">{patient.patientId}</TableCell>
              <TableCell>
                {cached ? (
                  <IntegrityStatusBadge status={cached.status} />
                ) : (
                  <span className="text-xs text-slate-400 italic">Not verified yet</span>
                )}
              </TableCell>
              <TableCell className="text-slate-600 text-sm">
                {cached ? new Date(cached.verifiedAt).toLocaleString() : '—'}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onVerify(patient.patientId)}
                    disabled={isVerifying || isRecomputing}
                  >
                    {isVerifying ? (
                      <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                    ) : (
                      <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
                    )}
                    {isVerifying ? 'Verifying...' : 'Verify'}
                  </Button>
                  {canRecompute && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRecompute(patient.patientId)}
                      disabled={isVerifying || isRecomputing}
                    >
                      <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isRecomputing ? 'animate-spin' : ''}`} />
                      {isRecomputing ? 'Recomputing...' : 'Recompute'}
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
    {patients.length === 0 && (
      <div className="py-12 text-center text-sm text-slate-500">
        No patients found.
      </div>
    )}
  </div>
);
