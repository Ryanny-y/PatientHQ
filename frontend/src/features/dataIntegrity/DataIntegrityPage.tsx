import { type ReactElement } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { useAuth } from '@/shared/context/AuthContext';
import { useDataIntegrity } from './hooks/useDataIntegrity';
import { DataIntegrityStatsCards } from './components/DataIntegrityStatsCards';
import { DataIntegrityTable } from './components/DataIntegrityTable';
import { VerificationResultDrawer } from './components/VerificationResultDrawer';
import type { IntegrityStatus } from './types/dataIntegrity';
import { toast } from 'sonner';

const DataIntegrityPage = (): ReactElement => {
  const { user } = useAuth();
  const canRecompute = user?.role === 'ADMIN';

  const {
    patients,
    isLoading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    verifiedResults,
    drawerResult,
    drawerOpen,
    closeDrawer,
    verifyingIds,
    recomputingIds,
    verifyPatient,
    recomputePatient,
    stats,
  } = useDataIntegrity();

  const handleVerify = async (patientId: string): Promise<void> => {
    try {
      await verifyPatient(patientId);
    } catch {
      toast.error('Failed to verify integrity.');
    }
  };

  const handleRecompute = async (patientId: string): Promise<void> => {
    try {
      await recomputePatient(patientId);
      toast.success('Hash recomputed. Re-verify to confirm the new status.');
    } catch {
      toast.error('Failed to recompute hash.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Data Integrity</h1>
        <p className="text-slate-600 mt-1">
          Verify the cryptographic integrity of patient records on-demand using SHA-256 hashing.
        </p>
      </div>

      <DataIntegrityStatsCards
        total={stats.total}
        valid={stats.valid}
        pending={stats.pending}
        tampered={stats.tampered}
        unverified={stats.unverified}
      />

      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by patient name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as IntegrityStatus | 'all')}
          >
            <SelectTrigger className="w-full sm:w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Patients</SelectItem>
              <SelectItem value="VALID">Valid</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="TAMPERED">Tampered</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {statusFilter !== 'all' && (
          <p className="text-xs text-slate-400 mt-3">
            Showing only patients with a cached <strong>{statusFilter}</strong> result. Unverified patients are hidden.
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          Loading patients...
        </div>
      ) : (
        <DataIntegrityTable
          patients={patients}
          verifiedResults={verifiedResults}
          verifyingIds={verifyingIds}
          recomputingIds={recomputingIds}
          onVerify={handleVerify}
          onRecompute={handleRecompute}
          canRecompute={canRecompute}
        />
      )}

      <VerificationResultDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        result={drawerResult}
      />
    </div>
  );
};

export default DataIntegrityPage;
