package com.patienthq.backend.features.medical_record.service;

import com.patienthq.backend.features.medical_record.dto.MedicalRecordDto;
import com.patienthq.backend.features.medical_record.dto.MedicalRecordMetadataDto;
import com.patienthq.backend.features.medical_record.dto.request.CreateMedicalRecordRequest;
import com.patienthq.backend.features.medical_record.dto.request.UpdateMedicalRecordRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface MedicalRecordService {
    MedicalRecordDto createMedicalRecord(CreateMedicalRecordRequest request);

    Page<MedicalRecordDto> getAllMedicalRecords(UUID patientId, UUID doctorId, String search, Pageable pageable);

    MedicalRecordDto getMedicalRecordById(UUID id);

    List<MedicalRecordDto> getMedicalRecordsByPatientId(UUID patientId);

    List<MedicalRecordDto> getMedicalRecordsByDoctorId(UUID doctorId);

    MedicalRecordDto updateMedicalRecord(UUID id, UpdateMedicalRecordRequest request);

    void deleteMedicalRecord(UUID id);

    MedicalRecordMetadataDto getMedicalRecordMetadata();
}
