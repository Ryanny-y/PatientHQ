package com.patienthq.backend.features.medical_record.service;

import com.patienthq.backend.features.medical_record.MedicalRecordMapper;
import com.patienthq.backend.features.medical_record.dto.MedicalRecordDto;
import com.patienthq.backend.features.medical_record.dto.MedicalRecordMetadataDto;
import com.patienthq.backend.features.medical_record.dto.request.CreateMedicalRecordRequest;
import com.patienthq.backend.features.medical_record.dto.request.UpdateMedicalRecordRequest;
import com.patienthq.backend.features.medical_record.model.MedicalRecord;
import com.patienthq.backend.features.medical_record.repository.MedicalRecordRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MedicalRecordServiceImpl implements MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;
    private final MedicalRecordMapper medicalRecordMapper;

    @Override
    @Transactional
    public MedicalRecordDto createMedicalRecord(CreateMedicalRecordRequest request) {
        MedicalRecord medicalRecord = MedicalRecord.builder()
                .patientId(request.getPatientId())
                .doctorId(request.getDoctorId())
                .diagnosis(request.getDiagnosis())
                .treatment(request.getTreatment())
                .prescription(request.getPrescription())
                .notes(request.getNotes())
                .build();

        return medicalRecordMapper.toDto(medicalRecordRepository.save(medicalRecord));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MedicalRecordDto> getAllMedicalRecords(UUID patientId, UUID doctorId, String search, Pageable pageable) {
        String formattedSearch = (search != null && !search.isEmpty()) 
            ? "%" + search.toLowerCase() + "%" 
            : null;
        return medicalRecordRepository.findAllWithFilters(patientId, doctorId, formattedSearch, pageable)
                .map(medicalRecordMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public MedicalRecordDto getMedicalRecordById(UUID id) {
        MedicalRecord medicalRecord = medicalRecordRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Medical record not found with id: " + id));
        return medicalRecordMapper.toDto(medicalRecord);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MedicalRecordDto> getMedicalRecordsByPatientId(UUID patientId) {
        return medicalRecordRepository.findByPatientId(patientId)
                .stream()
                .map(medicalRecordMapper::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MedicalRecordDto> getMedicalRecordsByDoctorId(UUID doctorId) {
        return medicalRecordRepository.findByDoctorId(doctorId)
                .stream()
                .map(medicalRecordMapper::toDto)
                .toList();
    }

    @Override
    @Transactional
    public MedicalRecordDto updateMedicalRecord(UUID id, UpdateMedicalRecordRequest request) {
        MedicalRecord medicalRecord = medicalRecordRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Medical record not found with id: " + id));

        if (request.getDiagnosis() != null && !request.getDiagnosis().isBlank()) {
            medicalRecord.setDiagnosis(request.getDiagnosis());
        }
        if (request.getTreatment() != null) {
            medicalRecord.setTreatment(request.getTreatment());
        }
        if (request.getPrescription() != null) {
            medicalRecord.setPrescription(request.getPrescription());
        }
        if (request.getNotes() != null) {
            medicalRecord.setNotes(request.getNotes());
        }

        return medicalRecordMapper.toDto(medicalRecordRepository.save(medicalRecord));
    }

    @Override
    @Transactional
    public void deleteMedicalRecord(UUID id) {
        MedicalRecord medicalRecord = medicalRecordRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Medical record not found with id: " + id));
        medicalRecordRepository.delete(medicalRecord);
    }

    @Override
    @Transactional(readOnly = true)
    public MedicalRecordMetadataDto getMedicalRecordMetadata() {
        long totalRecords = medicalRecordRepository.count();
        long activePatients = medicalRecordRepository.countDistinctPatients();
        long totalDoctors = medicalRecordRepository.countDistinctDoctors();

        // Calculate start of week (Monday 00:00)
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfWeek = now.minusDays(now.getDayOfWeek().getValue() - 1)
                .toLocalDate().atStartOfDay();

        long newThisWeek = medicalRecordRepository.countRecordsCreatedThisWeek(startOfWeek);

        return MedicalRecordMetadataDto.builder()
                .totalRecords(totalRecords)
                .newThisWeek(newThisWeek)
                .activePatients(activePatients)
                .totalDoctors(totalDoctors)
                .build();
    }
}
