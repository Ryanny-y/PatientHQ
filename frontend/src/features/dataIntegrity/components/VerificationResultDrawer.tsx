import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShieldCheck, ShieldAlert, Hash, Clock } from 'lucide-react';
import { type ReactElement } from 'react';
import type { IntegrityVerificationDto } from '../types/dataIntegrity';
import { IntegrityStatusBadge } from './IntegrityStatusBadge';

interface VerificationResultDrawerProps {
  open: boolean;
  onClose: () => void;
  result: IntegrityVerificationDto | null;
}

export const VerificationResultDrawer = ({
  open,
  onClose,
  result,
}: VerificationResultDrawerProps): ReactElement => {
  if (!result) return <></>;

  const Icon = result.valid ? ShieldCheck : ShieldAlert;
  const iconColor = result.valid ? 'text-green-600' : 'text-red-600';
  const iconBg = result.valid ? 'bg-green-50' : 'bg-red-50';

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader className="pb-6">
          <SheetTitle className="text-xl font-semibold text-slate-900">
            Verification Result
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] pr-4">
          <div className="space-y-6">
            {/* Result Banner */}
            <div className={`flex items-center gap-4 rounded-xl p-5 ${iconBg}`}>
              <div className={`rounded-full p-3 ${iconBg}`}>
                <Icon className={`h-6 w-6 ${iconColor}`} />
              </div>
              <div>
                <div className={`text-lg font-semibold ${iconColor}`}>
                  {result.valid ? 'Integrity Valid' : 'Integrity Compromised'}
                </div>
                <div className="text-sm text-slate-600">
                  {result.valid
                    ? 'Patient data matches the stored hash.'
                    : 'Hash mismatch detected — data may have been tampered with.'}
                </div>
              </div>
            </div>

            {/* Patient Info */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
              <h3 className="font-semibold text-slate-900">Patient</h3>
              <div className="text-sm text-slate-700">{result.patientName}</div>
              <div className="text-xs text-slate-500 font-mono">{result.patientId}</div>
              <IntegrityStatusBadge status={result.status} />
            </div>

            {/* Hash Comparison */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Hash Comparison
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-xs font-medium text-slate-500 mb-1">Current Hash</div>
                  <div className={`text-xs font-mono break-all p-3 rounded-lg ${result.valid ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    {result.currentHash}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-500 mb-1">Stored Hash</div>
                  <div className="text-xs font-mono break-all p-3 rounded-lg bg-slate-50 text-slate-700">
                    {result.storedHash}
                  </div>
                </div>
              </div>
            </div>

            {/* Verified At */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 flex items-center gap-3">
              <Clock className="h-4 w-4 text-slate-400" />
              <div>
                <div className="text-xs font-medium text-slate-500">Verified At</div>
                <div className="text-sm text-slate-900">
                  {new Date(result.verifiedAt).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
