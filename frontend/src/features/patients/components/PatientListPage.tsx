import { type ReactElement, useState, useMemo } from 'react';
import { UserPlus, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePatientList } from '@/features/patients/hooks/usePatientList';
import PatientStatsCards from '@/features/patients/components/PatientStatsCards';
import PatientFilterToolbar from '@/features/patients/components/PatientFilterToolbar';
import PatientTable from '@/features/patients/components/PatientTable';
import PatientCardList from '@/features/patients/components/PatientCardList';
import ViewPatientDrawer from '@/features/patients/components/ViewPatientDrawer';
import EditPatientModal from '@/features/patients/components/EditPatientModal';
import PatientHistoryModal from '@/features/patients/components/PatientHistoryModal';
import ArchiveConfirmDialog from '@/features/patients/components/ArchiveConfirmDialog';
import type { Patient } from '@/features/patients/types/Patient';
import { updatePatient, archivePatient } from '@/features/patients/services/patientService';
import { useToast } from '@/shared/hooks/useToast';

const PatientListPage = (): ReactElement => {
  const { patients, isLoading, refetch } = usePatientList();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [bloodTypeFilter, setBloodTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [viewDrawerOpen, setViewDrawerOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [historyModalOpen, setHistoryModalOpen] = useState<boolean>(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState<boolean>(false);

  const filteredAndSortedPatients = useMemo(() => {
    let filtered = patients;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.patient_id.toString().includes(query) ||
          p.full_name.toLowerCase().includes(query) ||
          p.contact_number.includes(query) ||
          p.email.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    if (genderFilter !== 'all') {
      filtered = filtered.filter((p) => p.gender === genderFilter);
    }

    if (bloodTypeFilter !== 'all') {
      filtered = filtered.filter((p) => p.blood_type === bloodTypeFilter);
    }

    const sorted = [...filtered];
    if (sortBy === 'newest') {
      sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === 'oldest') {
      sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else if (sortBy === 'name-asc') {
      sorted.sort((a, b) => a.full_name.localeCompare(b.full_name));
    } else if (sortBy === 'name-desc') {
      sorted.sort((a, b) => b.full_name.localeCompare(a.full_name));
    }

    return sorted;
  }, [patients, searchQuery, statusFilter, genderFilter, bloodTypeFilter, sortBy]);

  const handleViewProfile = (patient: Patient): void => {
    setSelectedPatient(patient);
    setViewDrawerOpen(true);
  };

  const handleEditPatient = (patient: Patient): void => {
    setSelectedPatient(patient);
    setEditModalOpen(true);
  };

  const handleViewHistory = (patient: Patient): void => {
    setSelectedPatient(patient);
    setHistoryModalOpen(true);
  };

  const handleArchivePatient = (patient: Patient): void => {
    setSelectedPatient(patient);
    setArchiveDialogOpen(true);
  };

  const handleSaveEdit = async (data: Partial<Patient>): Promise<void> => {
    if (!selectedPatient) return;

    const response = await updatePatient(selectedPatient.patient_id, data);
    if (response.success) {
      toast('Patient updated successfully');
      refetch();
    } else {
      toast(response.message, 'error');
    }
  };

  const handleConfirmArchive = async (): Promise<void> => {
    if (!selectedPatient) return;

    const response = await archivePatient(selectedPatient.patient_id);
    if (response.success) {
      toast('Patient archived successfully');
      refetch();
    } else {
      toast(response.message, 'error');
    }
    setArchiveDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-500">Loading patients...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Patient List</h1>
          <p className="text-sm text-slate-500 mt-1">
            View and manage registered patients across the hospital system.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Register Patient
          </Button>
        </div>
      </div>

      <PatientStatsCards patients={patients} />

      <PatientFilterToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        genderFilter={genderFilter}
        onGenderFilterChange={setGenderFilter}
        bloodTypeFilter={bloodTypeFilter}
        onBloodTypeFilterChange={setBloodTypeFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        onRefresh={refetch}
      />

      <div className="hidden lg:block">
        <PatientTable
          patients={filteredAndSortedPatients}
          onViewProfile={handleViewProfile}
          onEditPatient={handleEditPatient}
          onViewHistory={handleViewHistory}
          onArchivePatient={handleArchivePatient}
        />
      </div>

      <div className="lg:hidden">
        <PatientCardList
          patients={filteredAndSortedPatients}
          onViewProfile={handleViewProfile}
          onEditPatient={handleEditPatient}
          onViewHistory={handleViewHistory}
          onArchivePatient={handleArchivePatient}
        />
      </div>

      <ViewPatientDrawer
        patient={selectedPatient}
        open={viewDrawerOpen}
        onClose={() => setViewDrawerOpen(false)}
      />

      <EditPatientModal
        patient={selectedPatient}
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveEdit}
      />

      <PatientHistoryModal
        patient={selectedPatient}
        open={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
      />

      <ArchiveConfirmDialog
        patient={selectedPatient}
        open={archiveDialogOpen}
        onClose={() => setArchiveDialogOpen(false)}
        onConfirm={handleConfirmArchive}
      />
    </div>
  );
};

export default PatientListPage;
