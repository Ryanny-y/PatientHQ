import { useState } from "react";
import { useMedicalRecordMutation } from "./useMedicalRecordMutation";
import { useMedicalRecordMetaQuery, useMedicalRecordQuery } from "./useMedicalRecordQuery";
import { usePatientQuery } from "@/features/patients/hooks/usePatientQuery";
import { useDoctorsQuery } from "@/features/doctorAccounts/hooks/useDoctorsQuery";
import { useToast } from "@/shared/hooks/useToast";
import type { MedicalRecord, MedicalRecordFormData } from "../types/medicalRecord";

const PAGE_SIZE = 10;

export const useMedicalRecords = () => {
  const [search, setSearch] = useState("");
  const [patientId, setPatientId] = useState<string | undefined>();
  const [doctorId, setDoctorId] = useState<string | undefined>();
  const [page, setPage] = useState(1);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view' | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  const { toast } = useToast();

  const { data: recordsData, refetch, isLoading } = useMedicalRecordQuery({
    page: page - 1,
    size: PAGE_SIZE,
    patientId,
    doctorId,
    search,
  });

  const { data: patientsData } = usePatientQuery({
    page: 0,
    size: 100, // Get all patients for dropdowns
  });

  const { data: doctorsData } = useDoctorsQuery({
    page: 0,
    size: 100, // Get all doctors for dropdowns
  });

  const patients =
    patientsData?.data?.content.map((patient) => ({
      patientId: patient.patientId.toString(),
      fullName: patient.fullName,
      status: patient.status,
    })) || [];

  const doctors =
    doctorsData?.data?.content.map((doctor) => ({
      doctorId: doctor.doctorId,
      fullName: doctor.fullName,
      specialization: doctor.specialization,
    })) || [];

  const mutations = useMedicalRecordMutation();
  const { data: meta } = useMedicalRecordMetaQuery();

  const handleCreateRecord = async (data: MedicalRecordFormData) => {
    try {
      await mutations.createMedicalRecord.mutateAsync(data);
      toast("Medical record has been successfully created.", "success");
      setModalMode(null);
    } catch {
      toast("Failed to create medical record.", "error");
    }
  };

  const handleUpdateRecord = async (id: string, data: Partial<MedicalRecordFormData>) => {
    try {
      await mutations.updateMedicalRecord.mutateAsync({ id, values: data });
      toast("Medical record has been successfully updated.", "success");
      setModalMode(null);
      setSelectedRecord(null);
    } catch {
      toast("Failed to update medical record.", "error");
    }
  };

  const handleDeleteRecord = async (id: string) => {
    try {
      await mutations.deleteMedicalRecord.mutateAsync(id);
      toast("Medical record has been successfully deleted.", "success");
    } catch {
      toast("Failed to delete medical record.", "error");
    }
  };

  const handleViewRecord = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setModalMode('view');
  };

  const handleEditRecord = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setModalMode('edit');
  };

  const handleAddRecord = () => {
    setModalMode('add');
  };

  const handleRefresh = () => {
    refetch();
    toast("Medical records have been updated.", "success");
  };

  return {
    // Data
    meta,
    records: recordsData?.data?.content || [],
    totalRecords: recordsData?.data?.totalElements || 0,
    totalPages: recordsData?.data?.totalPages || 0,
    currentPage: page,
    patients,
    doctors,

    // State
    search,
    patientId,
    doctorId,
    modalMode,
    selectedRecord,

    // Setters
    setSearch,
    setPatientId,
    setDoctorId,
    setPage,
    setModalMode,
    setSelectedRecord,

    // Handlers
    handleCreateRecord,
    handleUpdateRecord,
    handleDeleteRecord,
    handleViewRecord,
    handleEditRecord,
    handleAddRecord,
    handleRefresh,

    // Loading states
    isLoading,
    isCreating: mutations.createMedicalRecord.isPending,
    isUpdating: mutations.updateMedicalRecord.isPending,
    isDeleting: mutations.deleteMedicalRecord.isPending,
  };
};
