package com.patienthq.backend.features.vital_signs.service;

import com.patienthq.backend.features.data_integrity.service.PatientIntegrityService;
import com.patienthq.backend.features.nurse.model.Nurse;
import com.patienthq.backend.features.nurse.service.NurseService;
import com.patienthq.backend.features.patient.model.Patient;
import com.patienthq.backend.features.patient.service.PatientService;
import com.patienthq.backend.features.user.model.User;
import com.patienthq.backend.features.vital_signs.dto.VitalSignsMetadataDto;
import com.patienthq.backend.features.vital_signs.dto.request.CreateVitalSignsRequest;
import com.patienthq.backend.features.vital_signs.model.VitalSign;
import com.patienthq.backend.features.vital_signs.repository.VitalSignsRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VitalSignsServiceImpl implements VitalSignsService {

    private final VitalSignsRepository vitalSignsRepository;
    private final PatientService patientService;
    private final NurseService nurseService;
    private final PatientIntegrityService patientIntegrityService;

    @Override
    @Transactional(readOnly = true)
    public List<VitalSign> getAllVitalSigns() {
        return vitalSignsRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public VitalSign getVitalSignsById(UUID id) {
        return vitalSignsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vital signs not found with ID: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public VitalSignsMetadataDto getVitalSignsMetadata() {
        List<VitalSign> vitalSigns = vitalSignsRepository.findAll();
        LocalDate today = LocalDate.now();

        long recordedToday = vitalSigns.stream()
                .filter(vitalSign -> vitalSign.getRecordedAt() != null)
                .filter(vitalSign -> vitalSign.getRecordedAt().toLocalDate().isEqual(today))
                .count();

        long criticalCount = vitalSigns.stream()
                .filter(this::isCriticalReading)
                .count();

        long patientsMonitored = vitalSigns.stream()
                .map(VitalSign::getPatient)
                .filter(patient -> patient != null && patient.getPatientId() != null)
                .map(patient -> patient.getPatientId())
                .distinct()
                .count();

        return VitalSignsMetadataDto.builder()
                .totalRecords(vitalSigns.size())
                .recordedToday(recordedToday)
                .criticalCount(criticalCount)
                .patientsMonitored(patientsMonitored)
                .build();
    }

    @Override
    @Transactional
    public VitalSign createVitalSigns(CreateVitalSignsRequest request, User currentUser) {
        Patient patient = patientService.getPatientById(request.getPatientId());
        Nurse nurse = nurseService.getNurseByUserId(currentUser.getUserId());

        VitalSign vitalSign = VitalSign.builder()
                .patient(patient)
                .recordedBy(nurse)
                .temperature(request.getTemperature())
                .heartRate(request.getHeartRate())
                .respiratoryRate(request.getRespiratoryRate())
                .oxygenSaturation(request.getOxygenSaturation())
                .bloodPressure(request.getBloodPressure())
                .notes(request.getNotes())
                .build();

        VitalSign saved = vitalSignsRepository.save(vitalSign);
        patientIntegrityService.markPending(request.getPatientId());
        return saved;
    }

    private boolean isCriticalReading(VitalSign vitalSign) {
        return isTemperatureCritical(vitalSign.getTemperature())
                || isHeartRateCritical(vitalSign.getHeartRate())
                || isRespiratoryRateCritical(vitalSign.getRespiratoryRate())
                || isOxygenSaturationCritical(vitalSign.getOxygenSaturation())
                || isBloodPressureCritical(vitalSign.getBloodPressure());
    }

    private boolean isTemperatureCritical(BigDecimal temperature) {
        return temperature != null
                && (temperature.compareTo(BigDecimal.valueOf(35)) < 0
                || temperature.compareTo(BigDecimal.valueOf(38)) >= 0);
    }

    private boolean isHeartRateCritical(Integer heartRate) {
        return heartRate != null && (heartRate < 50 || heartRate > 120);
    }

    private boolean isRespiratoryRateCritical(Integer respiratoryRate) {
        return respiratoryRate != null && (respiratoryRate < 10 || respiratoryRate > 24);
    }

    private boolean isOxygenSaturationCritical(BigDecimal oxygenSaturation) {
        return oxygenSaturation != null && oxygenSaturation.compareTo(BigDecimal.valueOf(92)) < 0;
    }

    private boolean isBloodPressureCritical(String bloodPressure) {
        if (bloodPressure == null || !bloodPressure.contains("/")) {
            return false;
        }

        String[] parts = bloodPressure.trim().split("/");
        if (parts.length != 2) {
            return false;
        }

        try {
            int systolic = Integer.parseInt(parts[0].trim());
            int diastolic = Integer.parseInt(parts[1].trim());
            return systolic >= 180 || diastolic >= 120;
        } catch (NumberFormatException ex) {
            return false;
        }
    }
}
